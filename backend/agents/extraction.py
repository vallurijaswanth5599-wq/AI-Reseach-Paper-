"""
Paper Extraction Agent – enriches papers with full text where available.
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

FETCH_TIMEOUT = aiohttp.ClientTimeout(total=20)
MAX_TEXT_LENGTH = 10000


class ExtractionAgent:
    """Tries to enrich paper data with full text from PDFs or web pages."""

    name = "extraction"

    async def run(self, papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enrich each paper. Returns enriched list."""
        logger.info("[ExtractionAgent] Extracting content for %d papers", len(papers))
        tasks = [self._enrich_paper(paper) for paper in papers]
        enriched = await asyncio.gather(*tasks, return_exceptions=True)

        results: List[Dict[str, Any]] = []
        for i, res in enumerate(enriched):
            if isinstance(res, Exception):
                logger.debug("[ExtractionAgent] Paper %d extraction failed: %s", i, res)
                results.append(papers[i])
            else:
                results.append(res)

        return results

    async def _enrich_paper(self, paper: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt to extract text content from a single paper."""
        enriched = dict(paper)

        # Skip if we already have a substantial abstract
        abstract = paper.get("abstract", "")
        if len(abstract) > 500:
            enriched["extracted_text"] = abstract
            return enriched

        # Try PDF extraction (only for arxiv which has reliable PDFs)
        pdf_url = paper.get("pdf_url")
        if pdf_url and "arxiv.org" in pdf_url:
            text = await self._fetch_pdf_text(pdf_url)
            if text:
                enriched["extracted_text"] = text[:MAX_TEXT_LENGTH]
                if not abstract and len(text) > 100:
                    # Use first 500 chars as abstract
                    enriched["abstract"] = text[:500]
                return enriched

        # Fallback: use existing abstract
        enriched["extracted_text"] = abstract
        return enriched

    async def _fetch_pdf_text(self, pdf_url: str) -> Optional[str]:
        """Download PDF and extract text using PyMuPDF."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(pdf_url, timeout=FETCH_TIMEOUT, allow_redirects=True) as resp:
                    if resp.status != 200:
                        return None
                    content_type = resp.headers.get("content-type", "")
                    if "pdf" not in content_type.lower() and not pdf_url.endswith(".pdf"):
                        return None
                    pdf_bytes = await resp.read()

            # Use PyMuPDF to extract text
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(stream=pdf_bytes, filetype="pdf")
                pages_text = []
                for page in doc:
                    pages_text.append(page.get_text())
                    if len("\n".join(pages_text)) > MAX_TEXT_LENGTH:
                        break
                doc.close()
                return "\n".join(pages_text)[:MAX_TEXT_LENGTH]
            except Exception:
                pass

            # Fallback: try pdfplumber
            try:
                import io
                import pdfplumber
                with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                    texts = []
                    for page in pdf.pages[:5]:
                        t = page.extract_text() or ""
                        texts.append(t)
                        if len("\n".join(texts)) > MAX_TEXT_LENGTH:
                            break
                return "\n".join(texts)[:MAX_TEXT_LENGTH]
            except Exception:
                pass

        except asyncio.TimeoutError:
            logger.debug("[ExtractionAgent] PDF fetch timed out: %s", pdf_url)
        except Exception as exc:
            logger.debug("[ExtractionAgent] PDF fetch error: %s", exc)

        return None
