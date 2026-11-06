"""
Comparison Agent – compares multiple papers using LLM analysis.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from database.models import PaperComparison
from services.llm_service import llm_service

logger = logging.getLogger(__name__)


class ComparisonAgent:
    """Compares 2+ research papers and identifies similarities/differences."""

    name = "comparison"

    async def run(
        self,
        papers: List[Dict[str, Any]],
        summaries: Optional[Dict[int, Dict[str, Any]]] = None,
        project_id: Optional[int] = None,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        """Run comparison across provided papers."""
        if len(papers) < 2:
            return {"error": "At least 2 papers required for comparison"}

        logger.info("[ComparisonAgent] Comparing %d papers", len(papers))

        # Enrich papers with their summaries
        enriched: List[Dict[str, Any]] = []
        for paper in papers:
            p = dict(paper)
            if summaries and paper.get("id") in summaries:
                p["summary"] = summaries[paper["id"]]
            enriched.append(p)

        comparison = await llm_service.compare_papers(enriched)

        # Save to DB
        if db:
            paper_ids = [p["id"] for p in papers if p.get("id")]
            try:
                db_cmp = PaperComparison(
                    project_id=project_id,
                    paper_ids=json.dumps(paper_ids),
                    comparison_data=json.dumps(comparison),
                )
                db.add(db_cmp)
                await db.flush()
                comparison["comparison_id"] = db_cmp.id
            except Exception as exc:
                logger.error("[ComparisonAgent] DB save error: %s", exc)

        logger.info("[ComparisonAgent] Comparison complete")
        return comparison
