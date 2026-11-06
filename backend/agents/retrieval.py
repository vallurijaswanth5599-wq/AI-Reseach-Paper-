"""
Paper Retrieval Agent – searches academic sources and saves to DB.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.models import ResearchPaper
from services.academic_search import AcademicSearchService

logger = logging.getLogger(__name__)

search_service = AcademicSearchService()


class RetrievalAgent:
    """Retrieves papers from multiple academic sources and persists them."""

    name = "retrieval"

    async def run(
        self,
        topic: str,
        keywords: Optional[List[str]] = None,
        sources: Optional[List[str]] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        max_results: int = 20,
        db: Optional[AsyncSession] = None,
    ) -> List[Dict[str, Any]]:
        """Search all sources, deduplicate, save to DB and return paper dicts."""
        logger.info("[RetrievalAgent] Retrieving papers for: %s", topic)

        if sources is None:
            sources = ["arxiv", "semantic_scholar", "openalex"]

        raw_papers = await search_service.search(
            topic=topic,
            keywords=keywords,
            sources=sources,
            year_from=year_from,
            year_to=year_to,
            max_results=max_results,
        )

        logger.info("[RetrievalAgent] Found %d papers after deduplication", len(raw_papers))

        saved_papers: List[Dict[str, Any]] = []

        for paper_data in raw_papers:
            db_paper = await self._upsert_paper(paper_data, db)
            enriched = {**paper_data, "id": db_paper.id if db_paper else None}
            saved_papers.append(enriched)

        return saved_papers

    async def _upsert_paper(
        self, paper_data: Dict[str, Any], db: Optional[AsyncSession]
    ) -> Optional[ResearchPaper]:
        """Insert or update a paper in the DB. Returns the ORM object."""
        if db is None:
            return None

        try:
            # Try to find existing by arxiv_id, semantic_id, or doi
            existing = None

            if paper_data.get("arxiv_id"):
                result = await db.execute(
                    select(ResearchPaper).where(ResearchPaper.arxiv_id == paper_data["arxiv_id"])
                )
                existing = result.scalars().first()

            if not existing and paper_data.get("semantic_id"):
                result = await db.execute(
                    select(ResearchPaper).where(ResearchPaper.semantic_id == paper_data["semantic_id"])
                )
                existing = result.scalars().first()

            if not existing and paper_data.get("doi"):
                result = await db.execute(
                    select(ResearchPaper).where(ResearchPaper.doi == paper_data["doi"])
                )
                existing = result.scalars().first()

            if existing:
                # Update citations if newer info
                if paper_data.get("citations", 0) > (existing.citations or 0):
                    existing.citations = paper_data["citations"]
                if not existing.abstract and paper_data.get("abstract"):
                    existing.abstract = paper_data["abstract"]
                await db.flush()
                return existing

            # Create new paper
            paper = ResearchPaper(
                arxiv_id=paper_data.get("arxiv_id"),
                semantic_id=paper_data.get("semantic_id"),
                title=paper_data.get("title", "Unknown"),
                authors=json.dumps(paper_data.get("authors", [])),
                abstract=paper_data.get("abstract", ""),
                year=paper_data.get("year"),
                doi=paper_data.get("doi"),
                url=paper_data.get("url"),
                pdf_url=paper_data.get("pdf_url"),
                source=paper_data.get("source", "unknown"),
                citations=paper_data.get("citations", 0),
                keywords=json.dumps(paper_data.get("keywords", [])),
            )
            db.add(paper)
            await db.flush()
            await db.refresh(paper)
            return paper

        except Exception as exc:
            logger.error("[RetrievalAgent] DB upsert error: %s", exc)
            await db.rollback()
            return None
