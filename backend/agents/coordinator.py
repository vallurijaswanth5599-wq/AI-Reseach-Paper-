"""
Agent Coordinator – orchestrates the full multi-agent research workflow.
"""
from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from agents.planner import PlannerAgent
from agents.retrieval import RetrievalAgent
from agents.extraction import ExtractionAgent
from agents.summarization import SummarizationAgent
from agents.comparison import ComparisonAgent
from agents.gap_analysis import GapAnalysisAgent
from agents.literature_review import LiteratureReviewAgent
from database.models import AgentExecutionLog
from schemas.schemas import AgentRunRequest

logger = logging.getLogger(__name__)

# In-memory status store keyed by session_id
_STATUS_STORE: Dict[str, Dict[str, Any]] = {}


def _new_status(session_id: str) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "status": "pending",
        "current_agent": None,
        "progress": 0,
        "logs": [],
        "result": None,
        "error": None,
        "started_at": datetime.utcnow().isoformat(),
    }


def _update_status(
    session_id: str,
    *,
    status: Optional[str] = None,
    current_agent: Optional[str] = None,
    progress: Optional[int] = None,
    log_entry: Optional[Dict[str, Any]] = None,
    result: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None,
):
    state = _STATUS_STORE.setdefault(session_id, _new_status(session_id))
    if status:
        state["status"] = status
    if current_agent is not None:
        state["current_agent"] = current_agent
    if progress is not None:
        state["progress"] = progress
    if log_entry:
        state["logs"].append(log_entry)
    if result is not None:
        state["result"] = result
    if error is not None:
        state["error"] = error


class AgentCoordinator:
    """Manages full research workflow across all agents."""

    def __init__(self):
        self.planner = PlannerAgent()
        self.retrieval = RetrievalAgent()
        self.extraction = ExtractionAgent()
        self.summarization = SummarizationAgent()
        self.comparison = ComparisonAgent()
        self.gap_analysis = GapAnalysisAgent()
        self.literature_review = LiteratureReviewAgent()

    def get_status(self, session_id: str) -> Dict[str, Any]:
        return _STATUS_STORE.get(session_id, {"session_id": session_id, "status": "not_found"})

    async def run_full_workflow(
        self, request: AgentRunRequest, db: Optional[AsyncSession] = None
    ) -> str:
        """Start the full research workflow. Returns session_id."""
        session_id = str(uuid.uuid4())
        _STATUS_STORE[session_id] = _new_status(session_id)

        # Run workflow asynchronously with its own session
        import asyncio
        asyncio.create_task(self._execute_workflow(session_id, request))
        return session_id

    async def _log_agent(
        self,
        session_id: str,
        agent_name: str,
        task: str,
        status: str,
        result: Any,
        error: Optional[str],
        project_id: Optional[int],
        db: AsyncSession,
        started_at: datetime,
    ):
        """Persist an agent execution log."""
        try:
            log = AgentExecutionLog(
                project_id=project_id,
                agent_name=agent_name,
                task=task,
                status=status,
                result=json.dumps(result) if not isinstance(result, str) else result,
                error=error,
                started_at=started_at,
                completed_at=datetime.utcnow(),
            )
            db.add(log)
            await db.flush()
        except Exception as exc:
            logger.error("Failed to save agent log: %s", exc)

    async def _execute_workflow(
        self, session_id: str, request: AgentRunRequest, _db: Optional[AsyncSession] = None
    ):
        """Execute the full agent pipeline."""
        from database.database import AsyncSessionLocal
        project_id = request.project_id
        workflow_result: Dict[str, Any] = {}
        db = AsyncSessionLocal()

        try:
            _update_status(session_id, status="running")

            # ── Step 1: Planner ──────────────────────────────────────────────
            _update_status(session_id, current_agent="planner", progress=5,
                           log_entry={"agent": "planner", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                plan = await self.planner.run(
                    topic=request.topic,
                    research_question=request.research_question or "",
                    existing_keywords=request.keywords,
                )
                workflow_result["plan"] = plan
                _update_status(session_id, progress=15,
                               log_entry={"agent": "planner", "status": "completed",
                                          "keywords": len(plan.get("keywords", [])), "time": _now()})
                await self._log_agent(session_id, "planner", f"Plan for: {request.topic}",
                                      "completed", plan, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Planner failed: %s", exc)
                _update_status(session_id, log_entry={"agent": "planner", "status": "failed", "error": str(exc)})
                plan = {"keywords": request.keywords or [request.topic], "search_queries": []}
                await self._log_agent(session_id, "planner", f"Plan for: {request.topic}",
                                      "failed", {}, str(exc), project_id, db, t0)

            # ── Step 2: Retrieval ─────────────────────────────────────────────
            _update_status(session_id, current_agent="retrieval", progress=20,
                           log_entry={"agent": "retrieval", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                papers = await self.retrieval.run(
                    topic=request.topic,
                    keywords=plan.get("keywords"),
                    sources=request.sources,
                    year_from=request.year_from,
                    year_to=request.year_to,
                    max_results=request.max_results or 15,
                    db=db,
                )
                workflow_result["papers"] = papers
                _update_status(session_id, progress=40,
                               log_entry={"agent": "retrieval", "status": "completed",
                                          "papers_found": len(papers), "time": _now()})
                await self._log_agent(session_id, "retrieval", f"Retrieve papers for: {request.topic}",
                                      "completed", {"count": len(papers)}, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Retrieval failed: %s", exc)
                _update_status(session_id, log_entry={"agent": "retrieval", "status": "failed", "error": str(exc)})
                papers = []
                await self._log_agent(session_id, "retrieval", f"Retrieve papers for: {request.topic}",
                                      "failed", {}, str(exc), project_id, db, t0)

            if not papers:
                _update_status(session_id, status="completed", progress=100,
                               result={"plan": workflow_result.get("plan"), "papers": [],
                                       "message": "No papers found for the given topic."})
                return

            # ── Step 3: Extraction ────────────────────────────────────────────
            _update_status(session_id, current_agent="extraction", progress=45,
                           log_entry={"agent": "extraction", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                enriched_papers = await self.extraction.run(papers)
                workflow_result["papers"] = enriched_papers
                _update_status(session_id, progress=55,
                               log_entry={"agent": "extraction", "status": "completed", "time": _now()})
                await self._log_agent(session_id, "extraction", "Extract paper content",
                                      "completed", {"count": len(enriched_papers)}, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Extraction failed: %s", exc)
                enriched_papers = papers
                await self._log_agent(session_id, "extraction", "Extract paper content",
                                      "failed", {}, str(exc), project_id, db, t0)

            # ── Step 4: Summarization ─────────────────────────────────────────
            _update_status(session_id, current_agent="summarization", progress=60,
                           log_entry={"agent": "summarization", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                summaries = await self.summarization.run(enriched_papers, db=db)
                workflow_result["summaries"] = summaries
                _update_status(session_id, progress=75,
                               log_entry={"agent": "summarization", "status": "completed",
                                          "summaries_count": len(summaries), "time": _now()})
                await self._log_agent(session_id, "summarization", "Summarize papers",
                                      "completed", {"count": len(summaries)}, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Summarization failed: %s", exc)
                summaries = {}
                await self._log_agent(session_id, "summarization", "Summarize papers",
                                      "failed", {}, str(exc), project_id, db, t0)

            # ── Step 5: Gap Analysis ──────────────────────────────────────────
            _update_status(session_id, current_agent="gap_analysis", progress=80,
                           log_entry={"agent": "gap_analysis", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                gap_result = await self.gap_analysis.run(
                    papers=enriched_papers, topic=request.topic, summaries=summaries
                )
                workflow_result["gap_analysis"] = gap_result
                _update_status(session_id, progress=88,
                               log_entry={"agent": "gap_analysis", "status": "completed", "time": _now()})
                await self._log_agent(session_id, "gap_analysis", f"Gap analysis for: {request.topic}",
                                      "completed", gap_result, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Gap analysis failed: %s", exc)
                workflow_result["gap_analysis"] = {}
                await self._log_agent(session_id, "gap_analysis", f"Gap analysis for: {request.topic}",
                                      "failed", {}, str(exc), project_id, db, t0)

            # ── Step 6: Literature Review ─────────────────────────────────────
            _update_status(session_id, current_agent="literature_review", progress=90,
                           log_entry={"agent": "literature_review", "status": "started", "time": _now()})
            t0 = datetime.utcnow()
            try:
                review = await self.literature_review.run(
                    papers=enriched_papers,
                    topic=request.topic,
                    citation_style="APA",
                    summaries=summaries,
                    project_id=project_id,
                    db=db,
                )
                workflow_result["literature_review"] = review
                _update_status(session_id, progress=98,
                               log_entry={"agent": "literature_review", "status": "completed", "time": _now()})
                await self._log_agent(session_id, "literature_review", f"Review for: {request.topic}",
                                      "completed", {"review_id": review.get("review_id")}, None, project_id, db, t0)
            except Exception as exc:
                logger.error("[Coordinator] Literature review failed: %s", exc)
                workflow_result["literature_review"] = {}
                await self._log_agent(session_id, "literature_review", f"Review for: {request.topic}",
                                      "failed", {}, str(exc), project_id, db, t0)

            # Commit all DB changes
            try:
                await db.commit()
            except Exception as exc:
                logger.error("[Coordinator] DB commit error: %s", exc)

            _update_status(session_id, status="completed", current_agent=None, progress=100,
                           result=workflow_result,
                           log_entry={"agent": "coordinator", "status": "workflow_complete", "time": _now()})
            logger.info("[Coordinator] Workflow %s complete", session_id)

        except Exception as exc:
            logger.exception("[Coordinator] Workflow %s crashed: %s", session_id, exc)
            _update_status(session_id, status="failed", error=str(exc),
                           log_entry={"agent": "coordinator", "status": "failed", "error": str(exc), "time": _now()})
            try:
                await db.rollback()
            except Exception:
                pass
        finally:
            try:
                await db.close()
            except Exception:
                pass


def _now() -> str:
    return datetime.utcnow().isoformat()


# Singleton
coordinator = AgentCoordinator()
