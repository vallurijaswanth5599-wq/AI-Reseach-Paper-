"""
Document export utilities: DOCX and PDF generation for literature reviews.
"""
from __future__ import annotations

import io
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# DOCX Export
# ---------------------------------------------------------------------------

def generate_docx(review_data: Dict[str, Any], papers: List[Dict[str, Any]]) -> bytes:
    """Generate a DOCX bytes object from review_data."""
    try:
        from docx import Document
        from docx.shared import Inches, Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH

        doc = Document()

        # Title
        title_para = doc.add_heading(review_data.get("title", "Literature Review"), level=0)
        title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

        doc.add_paragraph()

        # Meta info
        meta = doc.add_paragraph()
        meta.add_run(f"Papers reviewed: {len(papers)} | Citation style: {review_data.get('citation_style', 'APA')}")
        meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

        doc.add_page_break()

        # Sections
        sections = [
            ("Introduction", "introduction"),
            ("Background", "background"),
            ("Literature Analysis", "literature_analysis"),
            ("Methodology Comparison", "methodology_comparison"),
            ("Key Findings", "findings"),
            ("Limitations", "limitations"),
            ("Research Gaps", "gaps"),
            ("Conclusion", "conclusion"),
        ]

        for heading, key in sections:
            content = review_data.get(key, "")
            if content:
                doc.add_heading(heading, level=1)
                # Handle multiline content
                for paragraph in content.split("\n"):
                    paragraph = paragraph.strip()
                    if paragraph:
                        doc.add_paragraph(paragraph)
                doc.add_paragraph()

        # Themes
        themes = review_data.get("themes", [])
        if themes:
            doc.add_heading("Main Themes", level=1)
            for theme in themes:
                doc.add_paragraph(str(theme), style="List Bullet")
            doc.add_paragraph()

        # References
        references = review_data.get("references", [])
        if references:
            doc.add_heading("References", level=1)
            for ref in references:
                p = doc.add_paragraph(str(ref))
                p.paragraph_format.left_indent = Inches(0.5)
                p.paragraph_format.first_line_indent = Inches(-0.5)

        buf = io.BytesIO()
        doc.save(buf)
        return buf.getvalue()

    except Exception as exc:
        logger.error("DOCX generation error: %s", exc)
        return b""


# ---------------------------------------------------------------------------
# PDF Export
# ---------------------------------------------------------------------------

def generate_pdf(review_data: Dict[str, Any], papers: List[Dict[str, Any]]) -> bytes:
    """Generate a PDF bytes object from review_data using ReportLab."""
    try:
        from reportlab.lib.pagesizes import LETTER
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, PageBreak,
            HRFlowable, ListFlowable, ListItem,
        )
        from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

        buf = io.BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=LETTER,
            rightMargin=inch,
            leftMargin=inch,
            topMargin=inch,
            bottomMargin=inch,
        )

        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            "ReviewTitle",
            parent=styles["Title"],
            fontSize=20,
            spaceAfter=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1a237e"),
        )
        h1_style = ParagraphStyle(
            "H1",
            parent=styles["Heading1"],
            fontSize=14,
            spaceBefore=16,
            spaceAfter=8,
            textColor=colors.HexColor("#283593"),
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontSize=11,
            leading=16,
            spaceAfter=8,
            alignment=TA_JUSTIFY,
        )
        meta_style = ParagraphStyle(
            "Meta",
            parent=styles["Normal"],
            fontSize=10,
            textColor=colors.grey,
            alignment=TA_CENTER,
            spaceAfter=20,
        )
        ref_style = ParagraphStyle(
            "Reference",
            parent=styles["Normal"],
            fontSize=9,
            leftIndent=20,
            firstLineIndent=-20,
            spaceAfter=4,
        )

        story = []

        # Title
        story.append(Paragraph(review_data.get("title", "Literature Review"), title_style))
        story.append(Paragraph(
            f"Papers reviewed: {len(papers)} | Citation: {review_data.get('citation_style', 'APA')}",
            meta_style,
        ))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#3949ab")))
        story.append(Spacer(1, 20))

        # Sections
        sections = [
            ("Introduction", "introduction"),
            ("Background", "background"),
            ("Literature Analysis", "literature_analysis"),
            ("Methodology Comparison", "methodology_comparison"),
            ("Key Findings", "findings"),
            ("Limitations", "limitations"),
            ("Research Gaps", "gaps"),
            ("Conclusion", "conclusion"),
        ]

        for heading, key in sections:
            content = review_data.get(key, "")
            if content:
                story.append(Paragraph(heading, h1_style))
                for para in content.split("\n"):
                    para = para.strip()
                    if para:
                        try:
                            story.append(Paragraph(para, body_style))
                        except Exception:
                            story.append(Paragraph(para.encode("ascii", "replace").decode(), body_style))
                story.append(Spacer(1, 8))

        # Themes
        themes = review_data.get("themes", [])
        if themes:
            story.append(Paragraph("Main Themes", h1_style))
            items = [ListItem(Paragraph(str(t), body_style)) for t in themes]
            story.append(ListFlowable(items, bulletType="bullet"))
            story.append(Spacer(1, 8))

        # References
        references = review_data.get("references", [])
        if references:
            story.append(PageBreak())
            story.append(Paragraph("References", h1_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
            story.append(Spacer(1, 8))
            for ref in references:
                try:
                    story.append(Paragraph(str(ref), ref_style))
                except Exception:
                    story.append(Paragraph(str(ref).encode("ascii", "replace").decode(), ref_style))

        doc.build(story)
        return buf.getvalue()

    except Exception as exc:
        logger.error("PDF generation error: %s", exc)
        return b""
