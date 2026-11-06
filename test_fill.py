import docx
import os

TEMPLATE_PATH = "/Users/vallurijashwanth/.gemini/antigravity/brain/4fd1a384-4d94-4b43-958c-5e7b0f928996/.user_uploaded/media_1793554165949_d5e2d20b.docx"
doc = docx.Document(TEMPLATE_PATH)

print("Testing simple replacements...")
for p in doc.paragraphs:
    if "[PROJECT TITLE IN CAPITAL LETTERS]" in p.text:
        p.text = p.text.replace("[PROJECT TITLE IN CAPITAL LETTERS]", "A MULTI-AGENT RESEARCH ASSISTANT-BASED APPROACH TO AI RESEARCH-PAPER LITERATURE AGENT")
    if "[STUDENT NAME]" in p.text:
        p.text = p.text.replace("[STUDENT NAME]", "VALLURI JASWANTH")
    if "[ROLL NUMBER]" in p.text:
        p.text = p.text.replace("[ROLL NUMBER]", "23ME1A54D1")
    if "[GUIDE NAME]" in p.text:
        p.text = p.text.replace("[GUIDE NAME]", "Mr. K. Naresh Babu")

for t in doc.tables:
    for row in t.rows:
        for c in row.cells:
            for p in c.paragraphs:
                if "[STUDENT NAME]" in p.text:
                    p.text = p.text.replace("[Ms./Mr.] [STUDENT NAME]", "Mr. VALLURI JASWANTH").replace("[STUDENT NAME]", "VALLURI JASWANTH")
                if "[ROLL NUMBER]" in p.text:
                    p.text = p.text.replace("[ROLL NUMBER]", "23ME1A54D1")
                if "[GUIDE NAME]" in p.text:
                    p.text = p.text.replace("[GUIDE NAME]", "Mr. K. Naresh Babu")

print("Simple replacement completed.")
