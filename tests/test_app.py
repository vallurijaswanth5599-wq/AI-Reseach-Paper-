import asyncio
import os
import sys
import unittest

# Add backend directory to sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from fastapi.testclient import TestClient
from main import app
from database.database import init_db
from services.academic_search import AcademicSearchService
from utils.document_export import generate_docx, generate_pdf

class TestLiteratureAssistant(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Run init_db synchronously
        asyncio.run(init_db())
        cls.client = TestClient(app)

    def test_01_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertIn("llm_configured", data)
        self.assertIn("db_ok", data)

    def test_02_projects_crud(self):
        # Create project
        create_resp = self.client.post("/api/projects", json={
            "name": "Transformer Attention Mechanisms",
            "topic": "Self-attention architectures in modern deep learning",
            "description": "Evaluation of multi-head attention and sparse attention layers."
        })
        self.assertEqual(create_resp.status_code, 200)
        proj_data = create_resp.json()
        self.assertIn("id", proj_data)
        proj_id = proj_data["id"]

        # List projects
        list_resp = self.client.get("/api/projects")
        self.assertEqual(list_resp.status_code, 200)
        projects = list_resp.json()
        self.assertTrue(any(p["id"] == proj_id for p in projects))

        # Get project
        get_resp = self.client.get(f"/api/projects/{proj_id}")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(get_resp.json()["name"], "Transformer Attention Mechanisms")

    def test_03_stats_endpoint(self):
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_papers", data)
        self.assertIn("total_reviews", data)
        self.assertIn("total_projects", data)

    def test_04_paper_search_endpoint(self):
        search_resp = self.client.post("/api/search", json={
            "topic": "Attention is all you need",
            "keywords": "transformers",
            "sources": ["arxiv"],
            "max_results": 2
        })
        self.assertEqual(search_resp.status_code, 200)
        papers = search_resp.json()
        self.assertIsInstance(papers, list)

    def test_05_summarization_and_comparison(self):
        # Create dummy papers
        papers_data = [
            {
                "title": "Attention Is All You Need",
                "authors": ["Vaswani et al."],
                "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.",
                "year": 2017,
                "source": "arXiv"
            },
            {
                "title": "BERT: Pre-training of Deep Bidirectional Transformers",
                "authors": ["Devlin et al."],
                "abstract": "We introduce a new language representation model called BERT.",
                "year": 2018,
                "source": "arXiv"
            }
        ]

        # Test Compare endpoint
        compare_resp = self.client.post("/api/papers/compare", json={
            "paper_ids": ["dummy-1", "dummy-2"]
        })
        self.assertEqual(compare_resp.status_code, 200)
        comp_data = compare_resp.json()
        self.assertIn("comparison_table", comp_data)

    def test_06_chat_endpoint(self):
        chat_resp = self.client.post("/api/chat", json={
            "message": "What is the key contribution of self-attention?"
        })
        self.assertEqual(chat_resp.status_code, 200)
        chat_data = chat_resp.json()
        self.assertIn("message", chat_data)

    def test_07_literature_review_and_export(self):
        # Generate review
        review_resp = self.client.post("/api/literature-review/generate", json={
            "paper_ids": [],
            "topic": "Multi-Agent Research Systems",
            "citation_style": "IEEE"
        })
        self.assertEqual(review_resp.status_code, 200)
        rev_data = review_resp.json()
        self.assertIn("review_id", rev_data)
        review_id = rev_data["review_id"]

        # Export DOCX
        docx_resp = self.client.get(f"/api/literature-review/export/docx/{review_id}")
        self.assertEqual(docx_resp.status_code, 200)
        self.assertGreater(len(docx_resp.content), 500)

        # Export PDF
        pdf_resp = self.client.get(f"/api/literature-review/export/pdf/{review_id}")
        self.assertEqual(pdf_resp.status_code, 200)
        self.assertGreater(len(pdf_resp.content), 500)

    def test_08_multi_agent_workflow_trigger(self):
        run_resp = self.client.post("/api/agents/run", json={
            "topic": "Graph Neural Networks",
            "sources": ["arxiv"],
            "max_results": 2
        })
        self.assertEqual(run_resp.status_code, 200)
        session_id = run_resp.json()["session_id"]
        self.assertTrue(len(session_id) > 0)

        # Check status
        status_resp = self.client.get(f"/api/agents/status/{session_id}")
        self.assertEqual(status_resp.status_code, 200)

if __name__ == "__main__":
    unittest.main()
