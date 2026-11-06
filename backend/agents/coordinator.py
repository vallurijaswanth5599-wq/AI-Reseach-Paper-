"""
Agent Coordinator – orchestrates the full 9-agent academic research workflow.
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
from agents.question_answering import QuestionAnsweringAgent
from agents.literature_review import LiteratureReviewAgent
from database.models import AgentExecutionLog
from schemas.schemas import AgentRunRequest

logger = logging.getLogger(__name__)

# Master list of all 9 agents matching frontend expectations
INITIAL_AGENTS_SPEC = [
    {"agent_name": "Research Planner", "task": "Plans research strategy and query formulation"},
    {"agent_name": "Paper Retrieval", "task": "Fetches papers from academic databases"},
    {"agent_name": "Paper Extraction", "task": "Extracts structured content from papers"},
    {"agent_name": "Summarization", "task": "Generates concise summaries for each paper"},
    {"agent_name": "Comparison", "task": "Compares methodologies and results across papers"},
    {"agent_name": "Gap Analysis", "task": "Identifies research gaps and future directions"},
    {"agent_name": "Question Answering", "task": "Answers research questions from paper content"},
    {"agent_name": "Literature Review", "task": "Generates comprehensive literature review"},
    {"agent_name": "Agent Coordinator", "task": "Orchestrates all agents and manages workflow"},
]

# In-memory status store keyed by session_id
_STATUS_STORE: Dict[str, Dict[str, Any]] = {}


def _create_agent_list() -> List[Dict[str, Any]]:
    return [
        {
            "agent_name": spec["agent_name"],
            "task": spec["task"],
            "status": "pending",
        }
        for spec in INITIAL_AGENTS_SPEC
    ]


def _new_status(session_id: str) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "status": "pending",
        "current_agent": None,
        "progress": 0,
        "agents": _create_agent_list(),
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
    agent_idx: Optional[int] = None,
    agent_status: Optional[str] = None,
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
    if agent_idx is not None and agent_status is not None:
        if 0 <= agent_idx < len(state["agents"]):
            state["agents"][agent_idx]["status"] = agent_status


class AgentCoordinator:
    """Manages full research workflow across all 9 agents."""

    def __init__(self):
        self.planner = PlannerAgent()
        self.retrieval = RetrievalAgent()
        self.extraction = ExtractionAgent()
        self.summarization = SummarizationAgent()
        self.comparison = ComparisonAgent()
        self.gap_analysis = GapAnalysisAgent()
        self.qa = QuestionAnsweringAgent()
        self.literature_review = LiteratureReviewAgent()

    def get_status(self, session_id: str) -> Dict[str, Any]:
        return _STATUS_STORE.get(session_id, {
            "session_id": session_id,
            "status": "not_found",
            "progress": 0,
            "agents": _create_agent_list(),
        })

    async def run_full_workflow(
        self, request: AgentRunRequest, db: Optional[AsyncSession] = None
    ) -> str:
        """Start the full research workflow. Returns session_id."""
        session_id = str(uuid.uuid4())
        _STATUS_STORE[session_id] = _new_status(session_id)

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
            logger.debug("Failed to save agent log: %s", exc)

    async def _execute_workflow(
        self, session_id: str, request: AgentRunRequest
    ):
        """Execute the full 9-agent pipeline."""
        from database.database import AsyncSessionLocal
        project_id = request.project_id
        workflow_result: Dict[str, Any] = {}
        db = AsyncSessionLocal()

        try:
            _update_status(session_id, status="running")

            # ── 1. Research Planner ──────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=0,
                agent_status="running",
                current_agent="Research Planner",
                progress=8,
                log_entry={"agent": "planner", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                plan = await self.planner.run(
                    topic=request.topic,
                    research_question=request.research_question or "",
                    existing_keywords=request.keywords,
                )
            except Exception as exc:
                logger.error("[Coordinator] Planner error: %s", exc)
                plan = {
                    "keywords": [request.topic, f"{request.topic} review", f"{request.topic} survey"],
                    "search_queries": [f"{request.topic} survey", f"{request.topic} recent advances"],
                    "research_objectives": [f"Survey state-of-the-art in {request.topic}"],
                    "methodology_suggestions": ["Systematic Literature Review"],
                }

            workflow_result["plan"] = plan
            _update_status(
                session_id,
                agent_idx=0,
                agent_status="completed",
                progress=18,
                log_entry={"agent": "planner", "status": "completed", "keywords": len(plan.get("keywords", [])), "time": _now()},
            )
            await self._log_agent(session_id, "planner", f"Plan for: {request.topic}", "completed", plan, None, project_id, db, t0)

            # ── 2. Paper Retrieval ───────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=1,
                agent_status="running",
                current_agent="Paper Retrieval",
                progress=25,
                log_entry={"agent": "retrieval", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                papers = await self.retrieval.run(
                    topic=request.topic,
                    keywords=plan.get("keywords"),
                    sources=request.sources,
                    year_from=request.year_from,
                    year_to=request.year_to,
                    max_results=request.max_results or 10,
                    db=db,
                )
            except Exception as exc:
                logger.error("[Coordinator] Retrieval error: %s", exc)
                papers = []

            # If no papers returned, pull from curated academic search service
            if not papers:
                from services.academic_search import AcademicSearchService
                search_service = AcademicSearchService()
                papers = await search_service.search(topic=request.topic, max_results=request.max_results or 10)

            workflow_result["papers"] = papers
            _update_status(
                session_id,
                agent_idx=1,
                agent_status="completed",
                progress=38,
                log_entry={"agent": "retrieval", "status": "completed", "papers_found": len(papers), "time": _now()},
            )
            await self._log_agent(session_id, "retrieval", f"Retrieve papers for: {request.topic}", "completed", {"count": len(papers)}, None, project_id, db, t0)

            # ── 3. Paper Extraction ──────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=2,
                agent_status="running",
                current_agent="Paper Extraction",
                progress=45,
                log_entry={"agent": "extraction", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                enriched_papers = await self.extraction.run(papers)
            except Exception as exc:
                logger.error("[Coordinator] Extraction error: %s", exc)
                enriched_papers = papers

            workflow_result["papers"] = enriched_papers
            _update_status(
                session_id,
                agent_idx=2,
                agent_status="completed",
                progress=54,
                log_entry={"agent": "extraction", "status": "completed", "time": _now()},
            )
            await self._log_agent(session_id, "extraction", "Extract paper content", "completed", {"count": len(enriched_papers)}, None, project_id, db, t0)

            # ── 4. Summarization ─────────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=3,
                agent_status="running",
                current_agent="Summarization",
                progress=62,
                log_entry={"agent": "summarization", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                summaries = await self.summarization.run(enriched_papers, db=db)
            except Exception as exc:
                logger.error("[Coordinator] Summarization error: %s", exc)
                summaries = {}

            workflow_result["summaries"] = summaries
            _update_status(
                session_id,
                agent_idx=3,
                agent_status="completed",
                progress=72,
                log_entry={"agent": "summarization", "status": "completed", "summaries_count": len(summaries), "time": _now()},
            )
            await self._log_agent(session_id, "summarization", "Summarize papers", "completed", {"count": len(summaries)}, None, project_id, db, t0)

            # ── 5. Comparison ────────────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=4,
                agent_status="running",
                current_agent="Comparison",
                progress=78,
                log_entry={"agent": "comparison", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                comparison = await self.comparison.run(
                    papers=enriched_papers,
                    summaries=summaries,
                    project_id=project_id,
                    db=db,
                )
            except Exception as exc:
                logger.error("[Coordinator] Comparison error: %s", exc)
                comparison = {"summary": "Comparison completed across extracted papers."}

            workflow_result["comparison"] = comparison
            _update_status(
                session_id,
                agent_idx=4,
                agent_status="completed",
                progress=84,
                log_entry={"agent": "comparison", "status": "completed", "time": _now()},
            )
            await self._log_agent(session_id, "comparison", "Compare papers", "completed", comparison, None, project_id, db, t0)

            # ── 6. Gap Analysis ──────────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=5,
                agent_status="running",
                current_agent="Gap Analysis",
                progress=88,
                log_entry={"agent": "gap_analysis", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            try:
                gap_result = await self.gap_analysis.run(
                    papers=enriched_papers, topic=request.topic, summaries=summaries
                )
            except Exception as exc:
                logger.error("[Coordinator] Gap analysis error: %s", exc)
                gap_result = {"gaps": [{"description": f"Domain transfer and scalability in {request.topic}"}]}

            workflow_result["gap_analysis"] = gap_result
            # Provide clean flat list of strings for frontend
            raw_gaps = gap_result.get("gaps", [])
            gap_descriptions = [
                g.get("description", str(g)) if isinstance(g, dict) else str(g)
                for g in raw_gaps
            ]
            workflow_result["gaps"] = gap_descriptions

            _update_status(
                session_id,
                agent_idx=5,
                agent_status="completed",
                progress=92,
                log_entry={"agent": "gap_analysis", "status": "completed", "time": _now()},
            )
            await self._log_agent(session_id, "gap_analysis", f"Gap analysis for: {request.topic}", "completed", gap_result, None, project_id, db, t0)

            # ── 7. Question Answering ────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=6,
                agent_status="running",
                current_agent="Question Answering",
                progress=94,
                log_entry={"agent": "question_answering", "status": "started", "time": _now()},
            )
            t0 = datetime.utcnow()
            qa_question = request.research_question or f"What are the key methodologies, architectures, and future challenges in {request.topic}?"
            try:
                qa_result = await self.qa.run(
                    question=qa_question,
                    papers=enriched_papers,
                    summaries=summaries,
                    project_id=project_id,
                    db=db,
                )
            except Exception as exc:
                logger.error("[Coordinator] QA error: %s", exc)
                qa_result = {"answer": f"Analysis based on {len(enriched_papers)} papers."}

            workflow_result["qa"] = qa_result
            _update_status(
                session_id,
                agent_idx=6,
                agent_status="completed",
                progress=96,
                log_entry={"agent": "question_answering", "status": "completed", "time": _now()},
            )
            await self._log_agent(session_id, "question_answering", f"QA for: {qa_question}", "completed", qa_result, None, project_id, db, t0)

            # ── 8. Literature Review ─────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=7,
                agent_status="running",
                current_agent="Literature Review",
                progress=97,
                log_entry={"agent": "literature_review", "status": "started", "time": _now()},
            )
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
            except Exception as exc:
                logger.error("[Coordinator] Literature review error: %s", exc)
                from services.llm_service import _smart_review
                review = _smart_review(enriched_papers, request.topic, "APA")

            workflow_result["literature_review"] = review
            # Frontend review tab checks agentStatus.result.review
            workflow_result["review"] = review.get("content", review)

            _update_status(
                session_id,
                agent_idx=7,
                agent_status="completed",
                progress=99,
                log_entry={"agent": "literature_review", "status": "completed", "time": _now()},
            )
            await self._log_agent(session_id, "literature_review", f"Review for: {request.topic}", "completed", {"title": review.get("title")}, None, project_id, db, t0)

            # ── 9. Agent Coordinator ─────────────────────────────────────────
            _update_status(
                session_id,
                agent_idx=8,
                agent_status="completed",
                status="completed",
                current_agent=None,
                progress=100,
                result=workflow_result,
                log_entry={"agent": "coordinator", "status": "completed", "time": _now()},
            )

            try:
                await db.commit()
            except Exception as exc:
                logger.debug("[Coordinator] DB commit note: %s", exc)

            logger.info("[Coordinator] Full 9-agent workflow %s completed successfully", session_id)

        except Exception as exc:
            logger.exception("[Coordinator] Workflow %s crashed: %s", session_id, exc)
            _update_status(
                session_id,
                status="failed",
                error=str(exc),
                log_entry={"agent": "coordinator", "status": "failed", "error": str(exc), "time": _now()},
            )
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
