"""
Pydantic schemas for the Research Literature Agent API.
"""
from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, field_validator, model_validator


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_json_field(v: Any) -> Any:
    """Parse a JSON string into a Python object if needed."""
    if isinstance(v, str):
        try:
            return json.loads(v)
        except (ValueError, TypeError):
            return v
    return v


# ---------------------------------------------------------------------------
# Paper schemas
# ---------------------------------------------------------------------------

class PaperResult(BaseModel):
    """Unified paper result returned from any academic search source."""
    id: Optional[int] = None
    arxiv_id: Optional[str] = None
    semantic_id: Optional[str] = None
    title: str
    authors: List[str] = []
    abstract: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    pdf_url: Optional[str] = None
    source: str = "unknown"
    citations: int = 0
    keywords: List[str] = []

    model_config = {"from_attributes": True}


class PaperResponse(PaperResult):
    """Full paper response including DB id and timestamps."""
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    @field_validator("authors", "keywords", mode="before")
    @classmethod
    def parse_list_fields(cls, v: Any) -> Any:
        return _parse_json_field(v)

    model_config = {"from_attributes": True}


class PaperSummaryResponse(BaseModel):
    id: int
    paper_id: int
    objective: str = ""
    methodology: str = ""
    dataset: str = ""
    findings: str = ""
    limitations: str = ""
    future_work: str = ""
    full_summary: str = ""
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Project schemas
# ---------------------------------------------------------------------------

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    topic: Optional[str] = ""


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""
    topic: Optional[str] = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Search schemas
# ---------------------------------------------------------------------------

class SearchRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    keywords: Optional[Union[List[str], str]] = []
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    sources: Optional[List[str]] = ["arxiv", "semantic_scholar", "openalex"]
    max_results: Optional[int] = Field(default=20, ge=1, le=100)
    project_id: Optional[int] = None

    @field_validator("keywords", mode="before")
    @classmethod
    def parse_keywords(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [k.strip() for k in v.split(",") if k.strip()]
        return v or []


# ---------------------------------------------------------------------------
# Summarize / Compare / Gap schemas
# ---------------------------------------------------------------------------

class SummarizeRequest(BaseModel):
    paper_ids: List[Union[int, str]] = Field(default=[])
    project_id: Optional[int] = None


class CompareRequest(BaseModel):
    paper_ids: List[Union[int, str]] = Field(default=[])
    project_id: Optional[int] = None


class GapAnalysisRequest(BaseModel):
    paper_ids: List[Union[int, str]] = Field(default=[])
    topic: str = Field(..., min_length=1)
    project_id: Optional[int] = None


# ---------------------------------------------------------------------------
# Chat schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    conversation_id: Optional[Union[int, str]] = None
    message: str = Field(..., min_length=1)
    paper_ids: Optional[List[Union[int, str]]] = []
    project_id: Optional[int] = None


class ChatMessageResponse(BaseModel):
    id: Union[int, str]
    conversation_id: Union[int, str]
    role: str
    content: str
    sources: Any = []
    created_at: Optional[datetime] = None

    @field_validator("sources", mode="before")
    @classmethod
    def parse_sources(cls, v: Any) -> Any:
        return _parse_json_field(v)

    model_config = {"from_attributes": True}


class ChatConversationResponse(BaseModel):
    id: Union[int, str]
    project_id: Optional[int] = None
    title: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Literature Review schemas
# ---------------------------------------------------------------------------

class LiteratureReviewRequest(BaseModel):
    paper_ids: Optional[List[Union[int, str]]] = []
    project_id: Optional[int] = None
    citation_style: Optional[str] = "IEEE"
    topic: str = Field(..., min_length=1)


class LiteratureReviewResponse(BaseModel):
    id: int
    project_id: Optional[int] = None
    title: str
    content: Any = {}
    papers_used: Any = []
    citation_style: str
    created_at: Optional[datetime] = None

    @field_validator("content", "papers_used", mode="before")
    @classmethod
    def parse_json(cls, v: Any) -> Any:
        return _parse_json_field(v)

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Agent schemas
# ---------------------------------------------------------------------------

class AgentRunRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    research_question: Optional[str] = ""
    keywords: Optional[List[str]] = []
    sources: Optional[List[str]] = ["arxiv", "semantic_scholar", "openalex"]
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    project_id: Optional[int] = None
    max_results: Optional[int] = Field(default=15, ge=1, le=50)


class AgentStatusResponse(BaseModel):
    session_id: str
    status: str   # pending | running | completed | failed
    current_agent: Optional[str] = None
    progress: int = 0          # 0-100
    logs: List[Dict[str, Any]] = []
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class AgentLogResponse(BaseModel):
    id: int
    project_id: Optional[int] = None
    agent_name: str
    task: str
    status: str
    result: Any = {}
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    @field_validator("result", mode="before")
    @classmethod
    def parse_result(cls, v: Any) -> Any:
        return _parse_json_field(v)

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Saved papers
# ---------------------------------------------------------------------------

class SavePaperRequest(BaseModel):
    paper_id: int
    project_id: Optional[int] = None
    notes: Optional[str] = ""


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

class StatsResponse(BaseModel):
    total_papers: int = 0
    total_reviews: int = 0
    total_projects: int = 0
    recent_searches: List[Dict[str, Any]] = []
