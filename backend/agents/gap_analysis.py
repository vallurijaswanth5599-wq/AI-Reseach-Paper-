"""
Gap Analysis Agent – identifies underexplored research areas.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from services.llm_service import llm_service

logger = logging.getLogger(__name__)


class GapAnalysisAgent:
    """Analyzes a collection of papers to identify research gaps."""

    name = "gap_analysis"

    async def run(
        self,
        papers: List[Dict[str, Any]],
        topic: str,
        summaries: Optional[Dict[int, Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Identify research gaps from paper collection."""
        logger.info("[GapAnalysisAgent] Analyzing %d papers for gaps on: %s", len(papers), topic)

        # Enrich papers with summaries
        enriched: List[Dict[str, Any]] = []
        for paper in papers:
            p = dict(paper)
            if summaries and paper.get("id") in summaries:
                p["summary"] = summaries[paper["id"]]
            enriched.append(p)

        result = await llm_service.analyze_gaps(enriched, topic)
        result["papers_analyzed"] = len(papers)
        result["topic"] = topic

        logger.info("[GapAnalysisAgent] Found %d research gaps", len(result.get("gaps", [])))
        return result
