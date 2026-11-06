# AI Research Paper Literature Agent

> A Multi-Agent AI Research Assistant for Academic Literature Review

**Student:** VALLURI JASWANTH | **Roll No:** 23ME1A54D1  
**College:** Ramachandra College of Engineering (Autonomous), Eluru  
**Department:** Artificial Intelligence and Data Science | **Year:** 2026–2027  
**Guide:** Mr. K. Naresh Babu

---

## Overview

This is a complete AI-powered multi-agent web application that assists students and researchers with academic literature review. It integrates real academic paper databases (arXiv, Semantic Scholar, OpenAlex, Crossref) with a LangGraph-inspired multi-agent pipeline to automatically search, retrieve, analyze, summarize, compare, and generate literature reviews.

## Architecture

```
User → Research Planner Agent → Paper Retrieval Agent → Paper Extraction Agent
     → Summarization Agent → Comparison Agent → Gap Analysis Agent
     → Question Answering Agent → Literature Review Agent
     → Agent Coordinator → Final Results
```

## Features

- 🔍 **Multi-source academic paper search** (arXiv, Semantic Scholar, OpenAlex, Crossref)
- 🤖 **9 specialized AI agents** working in coordination
- 📄 **Automated paper summarization** (objective, methodology, findings, limitations)
- 📊 **Paper comparison tables** with similarity/difference analysis
- 🔬 **Research gap analysis** with evidence-backed suggestions
- 💬 **AI research chatbot** with source-grounded answers
- 📖 **Literature review generation** with IEEE/APA citation styles
- 📥 **DOCX and PDF export** of literature reviews
- 💾 **Project management** with persistent SQLite storage
- 🌙 **Light/Dark mode** with responsive design

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Python 3.10+, FastAPI, SQLAlchemy |
| AI/LLM | Google Gemini API (or OpenAI) |
| Database | SQLite |
| Academic APIs | arXiv, Semantic Scholar, OpenAlex, Crossref |
| Exports | python-docx, ReportLab |

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone / Navigate to the project
```bash
cd ai-research-literature-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API key
```

### 3. Configure Environment Variables
Edit `backend/.env`:
```env
# Choose ONE:
GEMINI_API_KEY=your_gemini_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here

LLM_PROVIDER=gemini          # or openai
LLM_MODEL=gemini-1.5-flash   # or gpt-3.5-turbo
```

> **Get Gemini API Key (Free):** https://aistudio.google.com/apikey  
> **Get OpenAI API Key:** https://platform.openai.com/api-keys

> The app works WITHOUT an API key using template-based fallback responses.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env  # or create .env with VITE_API_URL=http://localhost:8000
```

---

## Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000  
API Docs (Swagger): http://localhost:8000/docs

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Documentation

Interactive API documentation is available at **http://localhost:8000/docs** when the backend is running.

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/search | Search academic papers |
| POST | /api/agents/run | Run full multi-agent workflow |
| GET | /api/agents/status/{id} | Get agent execution status |
| POST | /api/papers/summarize | Summarize papers |
| POST | /api/papers/compare | Compare papers |
| POST | /api/papers/analyze-gaps | Gap analysis |
| POST | /api/chat | Chat with AI about papers |
| POST | /api/literature-review/generate | Generate literature review |
| GET | /api/literature-review/export/docx/{id} | Export as DOCX |
| GET | /api/literature-review/export/pdf/{id} | Export as PDF |
| GET | /api/projects | List research projects |
| GET | /api/stats | Dashboard statistics |

---

## Project Structure

```
ai-research-literature-agent/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   ├── context/             # React context
│   │   ├── types/               # TypeScript interfaces
│   │   └── App.tsx
│   └── package.json
│
├── backend/                     # FastAPI Python backend
│   ├── agents/                  # Multi-agent implementations
│   │   ├── coordinator.py       # Agent coordinator
│   │   ├── planner.py           # Research planner
│   │   ├── retrieval.py         # Paper retrieval
│   │   ├── extraction.py        # Content extraction
│   │   ├── summarization.py     # Summarization
│   │   ├── comparison.py        # Paper comparison
│   │   ├── gap_analysis.py      # Gap analysis
│   │   ├── question_answering.py# QA agent
│   │   └── literature_review.py # Review generation
│   ├── api/routes.py            # FastAPI routes
│   ├── database/                # DB models & setup
│   ├── services/                # Academic search & LLM
│   ├── utils/                   # Export utilities
│   ├── main.py                  # FastAPI app entry
│   └── requirements.txt
│
├── storage/                     # Uploaded files
├── generated_reports/           # Exported documents
├── .env.example
├── .gitignore
└── README.md
```

---

## Academic Data Sources

| Source | Type | Free |
|---|---|---|
| arXiv | Preprints (CS, Physics, Math, Biology) | ✅ Yes |
| Semantic Scholar | Academic graph, 200M+ papers | ✅ Yes |
| OpenAlex | Open catalog, 250M+ works | ✅ Yes |
| Crossref | DOI metadata, 140M+ records | ✅ Yes |

---

## AI Safety & Accuracy

This application follows strict academic integrity principles:
- Never invents paper titles, authors, or DOIs
- Clearly distinguishes AI interpretations from paper facts
- Links all claims to source papers
- Labels research gap suggestions as potential directions, not proven novelties
- Handles missing abstracts and unavailable PDFs gracefully

---

## License

This project is developed as an academic mini-project. All academic paper data is retrieved from public APIs and belongs to their respective publishers.
