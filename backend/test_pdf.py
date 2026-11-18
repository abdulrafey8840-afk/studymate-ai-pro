from app.services.pdf_extractor import extract_text_from_pdf

text = extract_text_from_pdf("uploads/text.pdf")

print("\n----- EXTRACTED PDF TEXT -----\n")
print(text)