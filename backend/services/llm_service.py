"""
LLM service supporting Gemini and OpenAI, with template fallback.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-1.5-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


# ---------------------------------------------------------------------------
# Template fallback responses
# ---------------------------------------------------------------------------

def _template_summary(title: str, abstract: str) -> Dict[str, Any]:
    return {
        "objective": f"This paper investigates topics related to: {title}.",
        "methodology": "The methodology details are available in the abstract.",
        "dataset": "Dataset information not extracted (LLM not configured).",
        "findings": abstract[:400] + "..." if len(abstract) > 400 else abstract,
        "limitations": "Limitations not extracted (LLM not configured).",
        "future_work": "Future work not extracted (LLM not configured).",
        "full_summary": f"Title: {title}\n\nAbstract: {abstract}",
    }


def _template_comparison(papers: List[Dict]) -> Dict[str, Any]:
    paper_titles = [p.get("title", f"Paper {i+1}") for i, p in enumerate(papers)]
    return {
        "comparison_table": {
            "Title": {p.get("id", str(i)): p.get("title", "") for i, p in enumerate(papers)},
            "Year": {p.get("id", str(i)): str(p.get("year", "N/A")) for i, p in enumerate(papers)},
            "Citations": {p.get("id", str(i)): str(p.get("citations", 0)) for i, p in enumerate(papers)},
        },
        "similarities": ["Both papers address related research areas."],
        "differences": ["Papers differ in their specific focus and methodology."],
        "strengths": {t: ["Published research with documented methodology"] for t in paper_titles},
        "weaknesses": {t: ["LLM analysis not available without API key"] for t in paper_titles},
        "summary": "Comparison requires LLM configuration. Please add GEMINI_API_KEY or OPENAI_API_KEY.",
    }


def _template_gap_analysis(papers: List[Dict], topic: str) -> Dict[str, Any]:
    return {
        "gaps": [
            {
                "description": f"Further research needed in {topic}",
                "evidence": "Based on the collected papers",
                "suggested_directions": ["Conduct systematic review", "Empirical studies", "Cross-domain analysis"],
            }
        ],
        "themes": [f"Research on {topic}", "Methodology improvements", "Application domains"],
        "summary": "Gap analysis requires LLM configuration. Please add GEMINI_API_KEY or OPENAI_API_KEY.",
    }


def _template_answer(question: str, papers: List[Dict]) -> Dict[str, Any]:
    return {
        "answer": f"To answer '{question}', please review the provided papers. LLM not configured.",
        "sources": [{"paper_id": p.get("id"), "snippet": p.get("abstract", "")[:200]} for p in papers[:3]],
        "confidence": 0.0,
        "disclaimer": "LLM service not configured. Add GEMINI_API_KEY or OPENAI_API_KEY for AI-powered answers.",
    }


def _template_review(papers: List[Dict], topic: str, citation_style: str) -> Dict[str, Any]:
    titles = [p.get("title", "Unknown") for p in papers]
    refs = []
    for i, p in enumerate(papers):
        authors = ", ".join((p.get("authors") or [])[:3])
        year = p.get("year", "n.d.")
        title = p.get("title", "Unknown")
        doi = p.get("doi", "")
        if citation_style.upper() == "APA":
            refs.append(f"{authors} ({year}). {title}. {'https://doi.org/' + doi if doi else ''}")
        elif citation_style.upper() == "MLA":
            refs.append(f"{authors}. \"{title}.\" {year}.")
        else:
            refs.append(f"[{i+1}] {authors}, \"{title},\" {year}.")

    return {
        "title": f"Literature Review: {topic}",
        "introduction": f"This literature review examines research on {topic}, drawing from {len(papers)} papers.",
        "background": f"Research in {topic} has grown significantly in recent years.",
        "themes": ["Theme 1: Core methodologies", "Theme 2: Applications", "Theme 3: Limitations"],
        "literature_analysis": "\n".join([f"- {t}" for t in titles]),
        "methodology_comparison": "Methodological comparison requires LLM configuration.",
        "findings": "Key findings require LLM configuration for synthesis.",
        "limitations": "Identified limitations require LLM-based analysis.",
        "gaps": "Research gaps require LLM configuration to identify.",
        "conclusion": f"This review covers {len(papers)} papers on {topic}.",
        "references": refs,
    }


# ---------------------------------------------------------------------------
# LLM Service
# ---------------------------------------------------------------------------

class LLMService:
    """Unified LLM service with Gemini, OpenAI, and template fallback."""

    def __init__(self):
        self.provider = LLM_PROVIDER
        self.model = LLM_MODEL
        self._gemini_client = None
        self._openai_client = None
        self._configured = False
        self._init_client()

    def _init_client(self):
        """Initialize the LLM client based on provider and available keys."""
        if self.provider == "gemini" and GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                import google.generativeai as genai
                genai.configure(api_key=GEMINI_API_KEY)
                self._gemini_client = genai.GenerativeModel(self.model)
                self._configured = True
                logger.info("Gemini LLM configured with model: %s", self.model)
            except Exception as exc:
                logger.warning("Gemini init failed: %s", exc)

        elif self.provider == "openai" and OPENAI_API_KEY and OPENAI_API_KEY != "your_openai_api_key_here":
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(api_key=OPENAI_API_KEY)
                self._configured = True
                logger.info("OpenAI LLM configured")
            except Exception as exc:
                logger.warning("OpenAI init failed: %s", exc)

        if not self._configured:
            # Try Gemini even if provider is openai (fallback)
            if not self._configured and GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=GEMINI_API_KEY)
                    self._gemini_client = genai.GenerativeModel("gemini-1.5-flash")
                    self._configured = True
                    logger.info("Gemini LLM configured as fallback")
                except Exception:
                    pass

        if not self._configured:
            logger.warning("No LLM API key configured – template fallback mode active.")

    @property
    def is_configured(self) -> bool:
        return self._configured

    async def generate(self, prompt: str, system_prompt: str = "") -> str:
        """Generate text from a prompt."""
        if not self._configured:
            return "LLM not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to .env"

        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt

        try:
            if self._gemini_client:
                response = self._gemini_client.generate_content(full_prompt)
                return response.text
            elif self._openai_client:
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                response = self._openai_client.chat.completions.create(
                    model=self.model if "gpt" in self.model else "gpt-3.5-turbo",
                    messages=messages,
                    max_tokens=4096,
                )
                return response.choices[0].message.content or ""
        except Exception as exc:
            logger.error("LLM generation error: %s", exc)
            return f"LLM error: {exc}"

        return "LLM not available."

    def _extract_json(self, text: str) -> Optional[Dict]:
        """Extract JSON from LLM response."""
        # Try to find JSON block
        for pattern in [r"```json\s*([\s\S]+?)\s*```", r"```\s*([\s\S]+?)\s*```", r"(\{[\s\S]+\})"]:
            import re
            match = re.search(pattern, text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    continue
        # Try whole text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return None

    async def summarize_paper(self, title: str, abstract: str, content: str = "") -> Dict[str, Any]:
        """Generate structured paper summary."""
        if not self._configured:
            return _template_summary(title, abstract)

        text_for_summary = content[:3000] if content else abstract[:2000]

        prompt = f"""Analyze this research paper and return a JSON object with exactly these keys:
- objective: main research objective (1-2 sentences)
- methodology: methods and approaches used (2-3 sentences)
- dataset: datasets or experimental setup (1-2 sentences, "Not specified" if unknown)
- findings: key results and contributions (3-4 sentences)
- limitations: acknowledged limitations (1-2 sentences, "Not specified" if unknown)
- future_work: future research directions (1-2 sentences, "Not specified" if unknown)
- full_summary: comprehensive 150-word summary

Title: {title}
Abstract: {abstract}
Additional content: {text_for_summary[:1500] if text_for_summary != abstract else ''}

Return ONLY the JSON object, no additional text."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "objective" in result:
            return result
        return _template_summary(title, abstract)

    async def compare_papers(self, papers_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate paper comparison analysis."""
        if not self._configured:
            return _template_comparison(papers_data)

        papers_text = ""
        for i, p in enumerate(papers_data):
            papers_text += f"\nPaper {i+1} (ID: {p.get('id', i+1)}):\n"
            papers_text += f"Title: {p.get('title', 'Unknown')}\n"
            papers_text += f"Authors: {', '.join(p.get('authors', [])[:3])}\n"
            papers_text += f"Year: {p.get('year', 'N/A')}\n"
            papers_text += f"Abstract: {p.get('abstract', '')[:400]}\n"
            if p.get("summary"):
                s = p["summary"]
                papers_text += f"Methodology: {s.get('methodology', '')[:300]}\n"
                papers_text += f"Findings: {s.get('findings', '')[:300]}\n"

        prompt = f"""Compare these {len(papers_data)} research papers and return a JSON object with:
- comparison_table: dict of aspect -> dict of paper_id -> value. Aspects: Objective, Methodology, Dataset, Findings, Limitations
- similarities: list of strings describing similarities
- differences: list of strings describing key differences
- strengths: dict of paper title -> list of strengths
- weaknesses: dict of paper title -> list of weaknesses
- summary: 100-word overall comparison summary

Papers:
{papers_text}

Return ONLY the JSON object."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "comparison_table" in result:
            return result
        return _template_comparison(papers_data)

    async def analyze_gaps(self, papers_data: List[Dict[str, Any]], topic: str) -> Dict[str, Any]:
        """Identify research gaps from collection of papers."""
        if not self._configured:
            return _template_gap_analysis(papers_data, topic)

        papers_text = ""
        for i, p in enumerate(papers_data[:10]):
            papers_text += f"\n- {p.get('title', 'Unknown')} ({p.get('year', 'N/A')})"
            papers_text += f"\n  Abstract: {p.get('abstract', '')[:300]}"

        prompt = f"""Analyze these papers on "{topic}" and identify research gaps. Return JSON with:
- gaps: list of objects, each with: description, evidence, suggested_directions (list)
- themes: list of main research themes found
- summary: 100-word summary of the state of the field and gaps

Papers:
{papers_text}

Return ONLY the JSON object."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "gaps" in result:
            return result
        return _template_gap_analysis(papers_data, topic)

    async def answer_question(self, question: str, context_papers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Answer a question using paper context."""
        if not self._configured:
            return _template_answer(question, context_papers)

        context = ""
        for i, p in enumerate(context_papers[:5]):
            context += f"\n[Paper {i+1}] {p.get('title', 'Unknown')} ({p.get('year', 'N/A')})\n"
            context += f"Abstract: {p.get('abstract', '')[:400]}\n"
            if p.get("summary"):
                s = p["summary"]
                context += f"Findings: {s.get('findings', '')[:300]}\n"

        prompt = f"""Answer the following question based on the provided research papers.

Question: {question}

Research Papers Context:
{context}

Return a JSON object with:
- answer: comprehensive answer based on the papers (2-3 paragraphs)
- sources: list of objects with paper_title and relevant_snippet
- confidence: float 0-1 indicating confidence in the answer
- disclaimer: any important caveats

Return ONLY the JSON object."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "answer" in result:
            return result
        return _template_answer(question, context_papers)

    async def generate_literature_review(
        self,
        papers_data: List[Dict[str, Any]],
        topic: str,
        citation_style: str = "APA",
    ) -> Dict[str, Any]:
        """Generate a structured literature review."""
        if not self._configured:
            return _template_review(papers_data, topic, citation_style)

        papers_text = ""
        for i, p in enumerate(papers_data[:15]):
            papers_text += f"\n[{i+1}] Title: {p.get('title', 'Unknown')}\n"
            papers_text += f"Authors: {', '.join((p.get('authors') or [])[:3])}\n"
            papers_text += f"Year: {p.get('year', 'N/A')}\n"
            papers_text += f"Abstract: {p.get('abstract', '')[:300]}\n"
            if p.get("summary"):
                s = p["summary"]
                papers_text += f"Findings: {s.get('findings', '')[:200]}\n"

        prompt = f"""Write a comprehensive academic literature review on "{topic}" using these {len(papers_data)} papers.
Citation style: {citation_style}

Return a JSON object with these exact keys:
- title: review title
- introduction: 2-3 paragraph introduction (200+ words)
- background: background and context (150+ words)
- themes: list of 3-5 main themes identified
- literature_analysis: detailed analysis of the literature (300+ words)
- methodology_comparison: comparison of research methods used (150+ words)
- findings: synthesis of key findings (200+ words)
- limitations: limitations of existing research (100+ words)
- gaps: identified research gaps (100+ words)
- conclusion: conclusion and future directions (150+ words)
- references: list of formatted {citation_style} citations for each paper

Papers:
{papers_text}

Return ONLY the JSON object."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "introduction" in result:
            return result
        return _template_review(papers_data, topic, citation_style)

    async def generate_search_keywords(self, topic: str, research_question: str = "") -> List[str]:
        """Generate expanded search keywords for a topic."""
        if not self._configured:
            words = topic.lower().split()
            return list(set(words + [topic, f"{topic} survey", f"{topic} review"]))[:10]

        prompt = f"""Generate 10-15 specific search keywords and phrases for finding research papers on:
Topic: {topic}
Research question: {research_question if research_question else 'Not specified'}

Return a JSON array of keyword strings only. Include synonyms, related terms, and specific technical terms.
Example: ["machine learning", "deep neural networks", "supervised learning", ...]

Return ONLY the JSON array."""

        response = await self.generate(prompt)
        # Try to extract JSON array
        import re
        match = re.search(r"\[[\s\S]+\]", response)
        if match:
            try:
                keywords = json.loads(match.group(0))
                if isinstance(keywords, list):
                    return [str(k) for k in keywords[:15]]
            except Exception:
                pass

        # Fallback: split topic into words
        return [topic] + topic.split()[:5]

    async def plan_research(self, topic: str, research_question: str = "") -> Dict[str, Any]:
        """Create a structured research plan."""
        if not self._configured:
            return {
                "keywords": [topic] + topic.split()[:4],
                "search_queries": [f"{topic} survey", f"{topic} review", f"recent advances {topic}"],
                "research_objectives": [f"Understand the state of {topic}", "Identify key methodologies"],
                "methodology_suggestions": ["Systematic literature review", "Thematic analysis"],
            }

        prompt = f"""Create a structured research plan for the following topic.

Topic: {topic}
Research Question: {research_question if research_question else 'Not specified'}

Return a JSON object with:
- keywords: list of 10+ search keywords
- search_queries: list of 5+ specific search query strings
- research_objectives: list of 4-6 research objectives
- methodology_suggestions: list of suggested research approaches

Return ONLY the JSON object."""

        response = await self.generate(prompt)
        result = self._extract_json(response)
        if result and "keywords" in result:
            return result

        return {
            "keywords": [topic] + topic.split()[:4],
            "search_queries": [f"{topic} survey", f"{topic} review"],
            "research_objectives": [f"Survey {topic}"],
            "methodology_suggestions": ["Systematic review"],
        }


# Singleton instance
llm_service = LLMService()
