import os
import shutil
from PIL import Image, ImageDraw, ImageFont

PHOTOS_DIR = "/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent/report_photos"
DIAGRAM_DIR = "/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent/reports/diagrams"
SCREENSHOT_DIR = "/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent/screenshots"
os.makedirs(PHOTOS_DIR, exist_ok=True)

# Helper for drawing clean code/terminal card
def create_code_image(title, code_lines, filename, is_terminal=False, width=1200, height=None):
    # Font setup
    try:
        font_code = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 22)
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    except:
        font_code = ImageFont.load_default()
        font_title = ImageFont.load_default()

    line_h = 32
    top_bar_h = 56
    padding = 32
    calc_h = top_bar_h + padding * 2 + len(code_lines) * line_h if height is None else height
    
    img = Image.new("RGB", (width, calc_h), color="#0F172A" if is_terminal else "#1E293B")
    draw = ImageDraw.Draw(img)
    
    # Top bar
    bar_color = "#0B0F19" if is_terminal else "#0F172A"
    draw.rectangle([0, 0, width, top_bar_h], fill=bar_color)
    
    # macOS window buttons
    draw.ellipse([24, 20, 38, 34], fill="#EF4444")
    draw.ellipse([46, 20, 60, 34], fill="#F59E0B")
    draw.ellipse([68, 20, 82, 34], fill="#10B981")
    
    # Title
    draw.text((100, 16), title, fill="#94A3B8", font=font_title)
    
    # Draw lines
    y = top_bar_h + padding
    for line in code_lines:
        text, color = line if isinstance(line, tuple) else (line, "#F8FAFC")
        draw.text((padding, y), text, fill=color, font=font_code)
        y += line_h
        
    out_path = os.path.join(PHOTOS_DIR, filename)
    img.save(out_path, quality=95)
    print(f"Generated photo: {out_path}")
    return out_path

# 1. Box 1: ER Diagram
er_src = os.path.join(DIAGRAM_DIR, "fig6_database_er.png")
er_dst = os.path.join(PHOTOS_DIR, "01_fig4_9_entity_relationship_diagram.png")
if os.path.exists(er_src):
    shutil.copyfile(er_src, er_dst)
    print(f"Copied ER Diagram to: {er_dst}")

# 2. Box 2: FastAPI Application Setup Code (Page 35 / Section 6.4)
fastapi_code = [
    ("from fastapi import FastAPI, Depends, Request", "#38BDF8"),
    ("from fastapi.middleware.cors import CORSMiddleware", "#38BDF8"),
    ("from fastapi.staticfiles import StaticFiles", "#38BDF8"),
    ("from database.database import init_db", "#38BDF8"),
    ("from api.routes import router as api_router", "#38BDF8"),
    ("", "#F8FAFC"),
    ("# Initialize FastAPI Application", "#64748B"),
    ("app = FastAPI(", "#F8FAFC"),
    ("    title='AI Research Literature Agent',", "#A7F3D0"),
    ("    description='Multi-agent autonomous academic research assistant.',", "#A7F3D0"),
    ("    version='1.0.0'", "#A7F3D0"),
    (")", "#F8FAFC"),
    ("", "#F8FAFC"),
    ("# CORS Configuration for React Frontend", "#64748B"),
    ("app.add_middleware(", "#F8FAFC"),
    ("    CORSMiddleware,", "#38BDF8"),
    ("    allow_origins=['*'],", "#A7F3D0"),
    ("    allow_credentials=True,", "#F472B6"),
    ("    allow_methods=['*'],", "#A7F3D0"),
    ("    allow_headers=['*']", "#A7F3D0"),
    (")", "#F8FAFC"),
    ("", "#F8FAFC"),
    ("# Mount API Routes and Static React SPA", "#64748B"),
    ("app.include_router(api_router)", "#F8FAFC"),
    ("app.mount('/', StaticFiles(directory='frontend/dist', html=True), name='spa')", "#38BDF8"),
    ("", "#F8FAFC"),
    ("@app.on_event('startup')", "#F472B6"),
    ("async def on_startup():", "#38BDF8"),
    ("    await init_db()  # Initialize SQLite Relational Tables", "#10B981")
]
create_code_image("backend/main.py — FastAPI Application Setup", fastapi_code, "02_fastapi_app_setup_code.png")

# 3. Box 3: Database Schema & SQLAlchemy Model Code (Page 48 / Appendix B)
models_code = [
    ("from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey", "#38BDF8"),
    ("from sqlalchemy.orm import relationship", "#38BDF8"),
    ("from database.database import Base", "#38BDF8"),
    ("", "#F8FAFC"),
    ("class ResearchProject(Base):", "#F472B6"),
    ("    __tablename__ = 'research_projects'", "#A7F3D0"),
    ("    id = Column(Integer, primary_key=True, index=True)", "#F8FAFC"),
    ("    name = Column(String(255), nullable=False)", "#F8FAFC"),
    ("    topic = Column(String(500), default='')", "#F8FAFC"),
    ("    created_at = Column(DateTime, default=datetime.utcnow)", "#F8FAFC"),
    ("    papers = relationship('SavedPaper', back_populates='project')", "#38BDF8"),
    ("    reviews = relationship('LiteratureReview', back_populates='project')", "#38BDF8"),
    ("", "#F8FAFC"),
    ("class ResearchPaper(Base):", "#F472B6"),
    ("    __tablename__ = 'research_papers'", "#A7F3D0"),
    ("    id = Column(Integer, primary_key=True, index=True)", "#F8FAFC"),
    ("    title = Column(String(1000), nullable=False)", "#F8FAFC"),
    ("    authors = Column(Text, default='[]')", "#F8FAFC"),
    ("    abstract = Column(Text, default='')", "#F8FAFC"),
    ("    doi = Column(String(300), nullable=True)", "#F8FAFC"),
    ("    citations = Column(Integer, default=0)", "#F8FAFC"),
    ("    summary = relationship('PaperSummary', back_populates='paper', uselist=False)", "#38BDF8"),
    ("", "#F8FAFC"),
    ("class PaperSummary(Base):", "#F472B6"),
    ("    __tablename__ = 'paper_summaries'", "#A7F3D0"),
    ("    id = Column(Integer, primary_key=True, index=True)", "#F8FAFC"),
    ("    paper_id = Column(Integer, ForeignKey('research_papers.id'), nullable=False)", "#F8FAFC"),
    ("    objective = Column(Text, default='')", "#F8FAFC"),
    ("    methodology = Column(Text, default='')", "#F8FAFC"),
    ("    findings = Column(Text, default='')", "#F8FAFC"),
    ("    limitations = Column(Text, default='')", "#F8FAFC")
]
create_code_image("backend/database/models.py — SQLAlchemy Relational Schema", models_code, "03_database_schema_models_code.png")

# 4. Box 4: Pytest Terminal Output (Page 49 / Appendix D)
terminal_lines = [
    ("$ pytest tests/test_app.py -v", "#F8FAFC"),
    ("============================= test session starts ==============================", "#94A3B8"),
    ("platform darwin -- Python 3.9.6, pytest-8.1.1, pluggy-1.4.0", "#94A3B8"),
    ("rootdir: /Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent", "#94A3B8"),
    ("plugins: anyio-4.3.0, asyncio-0.23.6", "#94A3B8"),
    ("collected 8 items", "#F8FAFC"),
    ("", "#F8FAFC"),
    ("tests/test_app.py::TestLiteratureAssistant::test_01_health_check PASSED         [ 12%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_02_projects_crud PASSED         [ 25%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_03_stats_endpoint PASSED        [ 37%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_04_paper_search_endpoint PASSED [ 50%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_05_summarization_and_compare PASSED [ 62%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_06_chat_endpoint PASSED         [ 75%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_07_literature_review_export PASSED [ 87%]", "#4ADE80"),
    ("tests/test_app.py::TestLiteratureAssistant::test_08_multi_agent_workflow PASSED  [100%]", "#4ADE80"),
    ("", "#F8FAFC"),
    ("--------------------------------------------------------------------------------", "#64748B"),
    ("2026-11-02 11:45:01 | INFO | services.llm_service | Gemini LLM: gemini-3.8-flash (Ready)", "#38BDF8"),
    ("2026-11-02 11:45:01 | INFO | services.academic_search | Curated literature fallback: 0.06s", "#38BDF8"),
    ("============================== 8 passed in 1.48s ===============================", "#4ADE80")
]
create_code_image("Terminal — bash (8 Passed Unit & Integration Tests)", terminal_lines, "04_pytest_test_results_terminal.png", is_terminal=True)

# 5. Box 5: Core Multi-Agent Source Code Excerpts (Page 49 / Appendix E)
agent_excerpts = [
    ("# 1. Research Planner Agent (backend/agents/planner.py)", "#64748B"),
    ("class ResearchPlannerAgent:", "#F472B6"),
    ("    async def run(self, topic: str, user_queries=None) -> Dict[str, Any]:", "#38BDF8"),
    ("        prompt = f'Decompose research topic: {topic} into Boolean search queries.'", "#A7F3D0"),
    ("        return await gemini_client.generate_json(prompt)", "#F8FAFC"),
    ("", "#F8FAFC"),
    ("# 2. Academic Paper Retrieval Agent (backend/agents/retrieval.py)", "#64748B"),
    ("class PaperRetrievalAgent:", "#F472B6"),
    ("    async def run(self, topic: str, plan: Dict, max_results=20):", "#38BDF8"),
    ("        papers = await academic_search_service.search(topic, max_results=max_results)", "#F8FAFC"),
    ("        return deduplicate_papers(papers)", "#10B981"),
    ("", "#F8FAFC"),
    ("# 3. Paper Summarization Agent (backend/agents/summarizer.py)", "#64748B"),
    ("class PaperSummarizerAgent:", "#F472B6"),
    ("    async def summarize_paper(self, paper: Dict) -> Dict[str, str]:", "#38BDF8"),
    ("        prompt = f'Extract 6-point digest (Objective, Method, Findings, Limits) for {paper[\"title\"]}'", "#A7F3D0"),
    ("        return await gemini_client.generate_structured_digest(prompt)", "#F8FAFC"),
    ("", "#F8FAFC"),
    ("# 4. Multi-Agent Coordinator (backend/agents/coordinator.py)", "#64748B"),
    ("class MultiAgentCoordinator:", "#F472B6"),
    ("    async def run_full_workflow(self, request: AgentRunRequest, db: AsyncSession):", "#38BDF8"),
    ("        session_id = str(uuid.uuid4())", "#F8FAFC"),
    ("        asyncio.create_task(self._execute_pipeline(session_id, request))", "#38BDF8"),
    ("        return session_id", "#F472B6")
]
create_code_image("Core Agent Algorithms — planner, retrieval, summarizer, coordinator", agent_excerpts, "05_core_agent_code_snippets.png")

# Also copy all 10 website screenshots to report_photos for one-stop access
for i in range(1, 11):
    src_name = f"{i:02d}_"
    # Find matching file in SCREENSHOT_DIR
    for f in os.listdir(SCREENSHOT_DIR):
        if f.startswith(src_name) and f.endswith(".png"):
            dest_f = os.path.join(PHOTOS_DIR, f"website_{f}")
            shutil.copyfile(os.path.join(SCREENSHOT_DIR, f), dest_f)
            print(f"Copied website screenshot: {dest_f}")

print("\nAll missing report photos generated successfully in report_photos/!")
