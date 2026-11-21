from pathlib import Path
import csv

from pypdf import PdfReader
from docx import Document
from openpyxl import load_workbook
import xlrd
from pptx import Presentation


SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".xlsx", ".xls",
    ".pptx", ".txt", ".md", ".csv"
}


def extract_text_from_file(file_path: str) -> str:
    """Extract text from supported study document formats."""

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError("File not found.")

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    extracted = []

    # PDF
    if extension == ".pdf":
        reader = PdfReader(str(path))

        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted.append(text)

    # Word
    elif extension == ".docx":
        document = Document(str(path))

        for paragraph in document.paragraphs:
            if paragraph.text.strip():
                extracted.append(paragraph.text)

        for table in document.tables:
            for row in table.rows:
                extracted.append(
                    " | ".join(cell.text for cell in row.cells)
                )

    # Excel XLSX
    elif extension == ".xlsx":
        workbook = load_workbook(
            str(path),
            read_only=True,
            data_only=True
        )

        for sheet in workbook.worksheets:
            extracted.append(f"Sheet: {sheet.title}")

            for row in sheet.iter_rows(values_only=True):
                values = [
                    str(value) for value in row
                    if value is not None
                ]

                if values:
                    extracted.append(" | ".join(values))

        workbook.close()

    # Excel XLS
    elif extension == ".xls":
        workbook = xlrd.open_workbook(str(path))

        for sheet in workbook.sheets():
            extracted.append(f"Sheet: {sheet.name}")

            for row_index in range(sheet.nrows):
                values = [
                    str(value)
                    for value in sheet.row_values(row_index)
                    if value != ""
                ]

                if values:
                    extracted.append(" | ".join(values))

    # PowerPoint
    elif extension == ".pptx":
        presentation = Presentation(str(path))

        for slide_number, slide in enumerate(
            presentation.slides, start=1
        ):
            extracted.append(f"Slide {slide_number}")

            for shape in slide.shapes:
                if shape.has_text_frame:
                    if shape.text.strip():
                        extracted.append(shape.text)

                if shape.has_table:
                    for row in shape.table.rows:
                        extracted.append(
                            " | ".join(
                                cell.text for cell in row.cells
                            )
                        )

    # CSV
    elif extension == ".csv":
        with open(
            path,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as file:
            reader = csv.reader(file)

            for row in reader:
                if row:
                    extracted.append(" | ".join(row))

    # TXT and Markdown
    elif extension in {".txt", ".md"}:
        extracted.append(
            path.read_text(encoding="utf-8-sig")
        )

    result = "\n".join(extracted).strip()

    if not result:
        raise ValueError(
            "No readable text found in this file."
        )

    return result