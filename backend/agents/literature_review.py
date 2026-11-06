"""
Literature Review Agent – generates full structured reviews with DOCX/PDF export.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from database.models import LiteratureReview
from services.llm_service import llm_service
from utils.document_export import generate_docx, generate_pdf

logger = logging.getLogger(__name__)


class LiteratureReviewAgent:
    """Generates comprehensive academic literature reviews."""

    name = "literature_review"

    async def run(
        self,
        papers: List[Dict[str, Any]],
        topic: str,
        citation_style: str = "APA",
        summaries: Optional[Dict[int, Dict[str, Any]]] = None,
        project_id: Optional[int] = None,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        """Generate literature review from papers."""
        logger.info("[LiteratureReviewAgent] Generating review for: %s (%d papers)", topic, len(papers))

        # Enrich with summaries
        enriched: List[Dict[str, Any]] = []
        for paper in papers:
            p = dict(paper)
            if summaries and paper.get("id") in summaries:
                p["summary"] = summaries[paper["id"]]
            enriched.append(p)

        review_content = await llm_service.generate_literature_review(enriched, topic, citation_style)

        # Build paper_ids list
        paper_ids = [p["id"] for p in papers if p.get("id")]

        # Save to DB
        review_id = None
        if db:
            try:
                db_review = LiteratureReview(
                    project_id=project_id,
                    title=review_content.get("title", f"Literature Review: {topic}"),
                    content=json.dumps(review_content),
                    papers_used=json.dumps(paper_ids),
                    citation_style=citation_style,
                )
                db.add(db_review)
                await db.flush()
                await db.refresh(db_review)
                review_id = db_review.id
            except Exception as exc:
                logger.error("[LiteratureReviewAgent] DB save error: %s", exc)

        # Generate DOCX and PDF
        try:
            docx_bytes = generate_docx(review_content, enriched)
            pdf_bytes = generate_pdf(review_content, enriched)
            review_content["docx_available"] = len(docx_bytes) > 0
            review_content["pdf_available"] = len(pdf_bytes) > 0
        except Exception as exc:
            logger.error("[LiteratureReviewAgent] Export generation error: %s", exc)
            review_content["docx_available"] = False
            review_content["pdf_available"] = False

        review_content["review_id"] = review_id
        review_content["paper_ids"] = paper_ids
        review_content["topic"] = topic
        review_content["citation_style"] = citation_style

        logger.info("[LiteratureReviewAgent] Review complete (id=%s)", review_id)
        return review_content
