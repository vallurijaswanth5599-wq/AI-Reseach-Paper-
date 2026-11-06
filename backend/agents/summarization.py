"""
Summarization Agent – generates structured summaries for papers using LLM.
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.models import PaperSummary
from services.llm_service import llm_service

logger = logging.getLogger(__name__)


class SummarizationAgent:
    """Generates LLM-based structured summaries for research papers."""

    name = "summarization"

    async def run(
        self,
        papers: List[Dict[str, Any]],
        db: Optional[AsyncSession] = None,
    ) -> Dict[int, Dict[str, Any]]:
        """Summarize all papers concurrently. Returns dict of paper_id -> summary."""
        logger.info("[SummarizationAgent] Summarizing %d papers", len(papers))

        sem = asyncio.Semaphore(5)

        async def _summarize_single(paper: Dict[str, Any]) -> tuple[Optional[int], Optional[Dict[str, Any]]]:
            async with sem:
                paper_id = paper.get("id")
                if paper_id is None:
                    return None, None

                # Check for existing summary in DB
                if db:
                    try:
                        existing = await self._get_existing_summary(paper_id, db)
                        if existing:
                            return paper_id, existing
                    except Exception as e:
                        logger.debug("DB lookup error for summary %s: %s", paper_id, e)

                title = paper.get("title", "Unknown")
                abstract = paper.get("abstract", "")
                extracted_text = paper.get("extracted_text", "")
                content = extracted_text if extracted_text and len(extracted_text) > len(abstract) else abstract

                summary = await llm_service.summarize_paper(title, abstract, content)
                summary["paper_id"] = paper_id

                if db:
                    try:
                        await self._save_summary(paper_id, summary, db)
                    except Exception as e:
                        logger.debug("DB save error for summary %s: %s", paper_id, e)

                return paper_id, summary

        results = await asyncio.gather(*[_summarize_single(p) for p in papers], return_exceptions=True)

        summaries: Dict[int, Dict[str, Any]] = {}
        for res in results:
            if isinstance(res, tuple) and res[0] is not None and res[1] is not None:
                summaries[res[0]] = res[1]

        logger.info("[SummarizationAgent] Completed %d summaries", len(summaries))
        return summaries

    async def _get_existing_summary(
        self, paper_id: int, db: AsyncSession
    ) -> Optional[Dict[str, Any]]:
        try:
            result = await db.execute(
                select(PaperSummary).where(PaperSummary.paper_id == paper_id)
            )
            summary_obj = result.scalars().first()
            if summary_obj:
                return {
                    "paper_id": paper_id,
                    "objective": summary_obj.objective,
                    "methodology": summary_obj.methodology,
                    "dataset": summary_obj.dataset,
                    "findings": summary_obj.findings,
                    "limitations": summary_obj.limitations,
                    "future_work": summary_obj.future_work,
                    "full_summary": summary_obj.full_summary,
                }
        except Exception as exc:
            logger.error("[SummarizationAgent] DB query error: %s", exc)
        return None

    async def _save_summary(
        self, paper_id: int, summary: Dict[str, Any], db: AsyncSession
    ) -> None:
        try:
            db_summary = PaperSummary(
                paper_id=paper_id,
                objective=summary.get("objective", ""),
                methodology=summary.get("methodology", ""),
                dataset=summary.get("dataset", ""),
                findings=summary.get("findings", ""),
                limitations=summary.get("limitations", ""),
                future_work=summary.get("future_work", ""),
                full_summary=summary.get("full_summary", ""),
            )
            db.add(db_summary)
            await db.flush()
        except Exception as exc:
            logger.error("[SummarizationAgent] Failed to save summary: %s", exc)
