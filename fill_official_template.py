import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

TEMPLATE_PATH = "/Users/vallurijashwanth/.gemini/antigravity/brain/4fd1a384-4d94-4b43-958c-5e7b0f928996/.user_uploaded/media_1793554165949_d5e2d20b.docx"
PROJECT_DIR = "/Users/vallurijashwanth/.gemini/antigravity/scratch/ai-research-literature-agent"
DIAGRAM_DIR = os.path.join(PROJECT_DIR, "reports", "diagrams")
SCREENSHOT_DIR = os.path.join(PROJECT_DIR, "screenshots")
OUTPUT_DOCX = os.path.join(PROJECT_DIR, "VALLURI_JASWANTH_23ME1A54D1_MiniProject_Report.docx")
OUTPUT_COPY = os.path.join(PROJECT_DIR, "Mini_Project_Report_AIDS_FILLED.docx")

doc = docx.Document(TEMPLATE_PATH)
print("Loaded official template successfully.")
