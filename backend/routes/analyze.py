from fastapi import APIRouter, UploadFile, File
from utils.pdf_parser import extract_text_from_pdf

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):

    contents = await file.read()

    extracted_text = extract_text_from_pdf(contents)

    return {
        "filename": file.filename,
        "resume_text": extracted_text[:3000]
    }