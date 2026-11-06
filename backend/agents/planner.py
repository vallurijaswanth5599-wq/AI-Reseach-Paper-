"""
Research Planner Agent – generates keywords, queries, and research plan.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from services.llm_service import llm_service

logger = logging.getLogger(__name__)


class PlannerAgent:
    """Analyzes the topic and produces a structured research plan."""

    name = "planner"

    async def run(
        self,
        topic: str,
        research_question: str = "",
        existing_keywords: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate research plan including keywords, queries, objectives,
        and methodology suggestions.
        """
        logger.info("[PlannerAgent] Planning research for: %s", topic)

        plan = await llm_service.plan_research(topic, research_question)

        # Merge with user-supplied keywords
        all_keywords: List[str] = plan.get("keywords", [])
        if existing_keywords:
            for kw in existing_keywords:
                if kw not in all_keywords:
                    all_keywords.append(kw)

        # Generate expanded keyword list via LLM
        llm_keywords = await llm_service.generate_search_keywords(topic, research_question)
        for kw in llm_keywords:
            if kw not in all_keywords:
                all_keywords.append(kw)

        # Deduplicate while preserving order
        seen: set = set()
        unique_keywords: List[str] = []
        for kw in all_keywords:
            kw_lower = kw.lower()
            if kw_lower not in seen:
                seen.add(kw_lower)
                unique_keywords.append(kw)

        plan["keywords"] = unique_keywords[:20]

        logger.info("[PlannerAgent] Plan generated: %d keywords, %d queries",
                    len(unique_keywords),
                    len(plan.get("search_queries", [])))

        return {
            "keywords": plan.get("keywords", []),
            "search_queries": plan.get("search_queries", []),
            "research_objectives": plan.get("research_objectives", []),
            "methodology_suggestions": plan.get("methodology_suggestions", []),
            "topic": topic,
            "research_question": research_question,
        }
