with open("/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent/build_final_filled_report.py", "r") as f:
    code = f.read()

# Replace TOC matching
old_toc = """    elif "6.1  [Module 1] Implementation" in c1_text:
        r.cells[1].text = "6.1  React SPA Frontend & State Management Implementation"
    elif "6.2  [Module 2] Implementation" in c1_text:
        r.cells[1].text = "6.2  FastAPI Asynchronous Backend Controller Implementation"
    elif "6.3  [Module 3] Implementation" in c1_text:
        r.cells[1].text = "6.3  Multi-Agent Orchestration & LLM Prompt Engine Implementation"
    elif "6.4  [Module 4 / Final] Implementation" in c1_text:
        r.cells[1].text = "6.4  Document Generation (Word/PDF) & Fast Fallback Implementation"
    elif "7.2  [Output Screen 1]" in c1_text:
        r.cells[1].text = "7.2  Landing Page & Project Navigation Interface"
    elif "7.3  [Output Screen 2]" in c1_text:
        r.cells[1].text = "7.3  Research Workspace & Federated Paper Search Interface\""""

new_toc = """    elif "[Module 1] Implementation" in c1_text:
        r.cells[1].text = "6.1  React SPA Frontend & State Management Implementation"
    elif "[Module 2] Implementation" in c1_text:
        r.cells[1].text = "6.2  FastAPI Asynchronous Backend Controller Implementation"
    elif "[Module 3] Implementation" in c1_text:
        r.cells[1].text = "6.3  Multi-Agent Orchestration & LLM Prompt Engine Implementation"
    elif "[Module 4 / Final] Implementation" in c1_text or "[Module 4" in c1_text:
        r.cells[1].text = "6.4  Document Generation (Word/PDF) & Fast Fallback Implementation"
    elif "[Output Screen 1]" in c1_text:
        r.cells[1].text = "7.2  Landing Page & Project Navigation Interface"
    elif "[Output Screen 2]" in c1_text:
        r.cells[1].text = "7.3  Research Workspace & Federated Paper Search Interface\""""

code = code.replace(old_toc, new_toc)

# Replace NFR matching
old_nfr = """    elif "[Describe each quality requirement in 2 to 3 lines" in p.text:
        p.text = nfr_text
        set_font(p)"""

new_nfr = """    elif "[Describe each quality requirement in 2 to 3 lines" in p.text:
        p.text = "The non-functional requirements define the software quality attributes, behavioral constraints, and operational benchmarks governing system deployment:"
        set_font(p)
    elif "•  Performance – [response time" in p.text:
        p.text = "•  Performance: The system shall achieve a federated search latency under 1.5 seconds (0.06s via curated fallback cache) and execute paper summarization in under 2.5 seconds per document."
        set_font(p)
    elif "•  Security – [authentication" in p.text:
        p.text = "•  Security: API credentials and LLM keys shall be secured in backend environment configurations; all database transactions shall use parameterized SQL queries."
        set_font(p)
    elif "•  Usability – [ease of use" in p.text:
        p.text = "•  Usability: The frontend shall provide an intuitive, responsive React interface supporting dark and light themes with clear progress bars and status indicators."
        set_font(p)
    elif "•  Reliability and Availability – [expected" in p.text:
        p.text = "•  Reliability and Availability: The application shall maintain 99.5% uptime during local execution, utilizing fail-safe fallbacks to guarantee zero crash states."
        set_font(p)
    elif "•  Scalability – [handling more" in p.text:
        p.text = "•  Scalability: The asynchronous backend architecture shall support concurrent background agent pipelines without blocking main thread responsiveness."
        set_font(p)
    elif "•  Maintainability and Portability – [modular" in p.text:
        p.text = "•  Maintainability and Portability: Codebase shall adhere to modular OOP and service-oriented patterns, deployable on macOS, Windows, or Linux with minimal setup."
        set_font(p)"""

code = code.replace(old_nfr, new_nfr)

# Also fix "[Author, Year]" in test case table
code = code.replace("Provided factual answer with [Author, Year]", "Provided factual answer with (Author, Year) citations")

with open("/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent/build_final_filled_report.py", "w") as f:
    f.write(code)

print("Updated build_final_filled_report.py successfully.")
