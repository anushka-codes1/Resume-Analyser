from fastapi import APIRouter, UploadFile, File

from utils.pdf_parser import extract_text_from_pdf
from services.gemini_service import analyze_resume_with_ai

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        extracted_text = extract_text_from_pdf(contents)

        if not extracted_text:
            return {
                "error": "Could not extract text from PDF"
            }

        ai_analysis = analyze_resume_with_ai(extracted_text)

        return {
            "filename": file.filename,
            "analysis": ai_analysis
        }

    except Exception as e:
        return {
            "error": str(e)
        }