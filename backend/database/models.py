"""
SQLAlchemy ORM models for the Research Literature Agent.
"""
import json
from datetime import datetime
from typing import Any

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, func,
)
from sqlalchemy.orm import relationship

from database.database import Base


# ---------------------------------------------------------------------------
# Helper – store Python objects as JSON strings
# ---------------------------------------------------------------------------

class JSONEncodedColumn(Text):
    """A Text column that transparently serialises/deserialises JSON."""
    pass


def _json_default(val: Any) -> Any:
    return val


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    topic = Column(String(500), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    comparisons = relationship("PaperComparison", back_populates="project", cascade="all, delete-orphan")
    reviews = relationship("LiteratureReview", back_populates="project", cascade="all, delete-orphan")
    conversations = relationship("ChatConversation", back_populates="project", cascade="all, delete-orphan")
    saved_papers = relationship("SavedPaper", back_populates="project", cascade="all, delete-orphan")
    execution_logs = relationship("AgentExecutionLog", back_populates="project", cascade="all, delete-orphan")
    search_queries = relationship("SearchQuery", back_populates="project", cascade="all, delete-orphan")


class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)
    arxiv_id = Column(String(100), nullable=True, index=True)
    semantic_id = Column(String(200), nullable=True, index=True)
    title = Column(String(1000), nullable=False)
    authors = Column(Text, default="[]")          # JSON list of strings
    abstract = Column(Text, default="")
    year = Column(Integer, nullable=True)
    doi = Column(String(300), nullable=True, index=True)
    url = Column(String(1000), nullable=True)
    pdf_url = Column(String(1000), nullable=True)
    source = Column(String(100), default="unknown")
    citations = Column(Integer, default=0)
    keywords = Column(Text, default="[]")         # JSON list of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    summary = relationship("PaperSummary", back_populates="paper", uselist=False, cascade="all, delete-orphan")
    saved_in = relationship("SavedPaper", back_populates="paper", cascade="all, delete-orphan")


class PaperSummary(Base):
    __tablename__ = "paper_summaries"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("research_papers.id", ondelete="CASCADE"), nullable=False)
    objective = Column(Text, default="")
    methodology = Column(Text, default="")
    dataset = Column(Text, default="")
    findings = Column(Text, default="")
    limitations = Column(Text, default="")
    future_work = Column(Text, default="")
    full_summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    paper = relationship("ResearchPaper", back_populates="summary")


class PaperComparison(Base):
    __tablename__ = "paper_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    paper_ids = Column(Text, default="[]")        # JSON list of ints
    comparison_data = Column(Text, default="{}")  # JSON dict
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="comparisons")


class LiteratureReview(Base):
    __tablename__ = "literature_reviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), default="")
    content = Column(Text, default="{}")          # JSON dict of sections
    papers_used = Column(Text, default="[]")      # JSON list of paper ids
    citation_style = Column(String(50), default="APA")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="reviews")


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("chat_conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="user")     # user | assistant
    content = Column(Text, default="")
    sources = Column(Text, default="[]")          # JSON list of source dicts
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("ChatConversation", back_populates="messages")


class SavedPaper(Base):
    __tablename__ = "saved_papers"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    paper_id = Column(Integer, ForeignKey("research_papers.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="saved_papers")
    paper = relationship("ResearchPaper", back_populates="saved_in")


class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    agent_name = Column(String(100), default="")
    task = Column(Text, default="")
    status = Column(String(50), default="pending")   # pending | running | completed | failed
    result = Column(Text, default="{}")               # JSON
    error = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("ResearchProject", back_populates="execution_logs")


class SearchQuery(Base):
    __tablename__ = "search_queries"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="CASCADE"), nullable=True)
    query = Column(String(1000), default="")
    filters = Column(Text, default="{}")         # JSON
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ResearchProject", back_populates="search_queries")
