"""
Question Answering Agent – answers questions using RAG-style paper context.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from database.models import ChatConversation, ChatMessage
from services.llm_service import llm_service

logger = logging.getLogger(__name__)


class QuestionAnsweringAgent:
    """Answers research questions using paper summaries as context."""

    name = "question_answering"

    async def run(
        self,
        question: str,
        papers: List[Dict[str, Any]],
        summaries: Optional[Dict[int, Dict[str, Any]]] = None,
        conversation_id: Optional[int] = None,
        project_id: Optional[int] = None,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        """Answer question with context from provided papers."""
        logger.info("[QAAgent] Answering: %s", question[:80])

        # Enrich papers
        context_papers: List[Dict[str, Any]] = []
        for paper in papers:
            p = dict(paper)
            if summaries and paper.get("id") in summaries:
                p["summary"] = summaries[paper["id"]]
            context_papers.append(p)

        result = await llm_service.answer_question(question, context_papers)

        # Persist conversation
        if db:
            try:
                conv_id = conversation_id
                if conv_id is None:
                    # Create new conversation
                    conv = ChatConversation(
                        project_id=project_id,
                        title=question[:100],
                    )
                    db.add(conv)
                    await db.flush()
                    await db.refresh(conv)
                    conv_id = conv.id

                # Save user message
                user_msg = ChatMessage(
                    conversation_id=conv_id,
                    role="user",
                    content=question,
                    sources="[]",
                )
                db.add(user_msg)

                # Save assistant message
                sources_json = json.dumps(result.get("sources", []))
                assistant_msg = ChatMessage(
                    conversation_id=conv_id,
                    role="assistant",
                    content=result.get("answer", ""),
                    sources=sources_json,
                )
                db.add(assistant_msg)
                await db.flush()

                result["conversation_id"] = conv_id
            except Exception as exc:
                logger.error("[QAAgent] DB save error: %s", exc)

        return result
