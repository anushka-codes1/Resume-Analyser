from pypdf import PdfReader
import io

def extract_text_from_pdf(file):
    pdf = PdfReader(io.BytesIO(file))

    text = ""

    for page in pdf.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted

    return text