import google.generativeai as genai
import os

from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(os.getenv("MODEL_NAME"))

def analyze_resume_with_ai(resume_text):

    prompt = f"""
    You are an expert ATS (Applicant Tracking System) resume analyzer.

    Analyze the following resume carefully.

    Provide:

    1. ATS Score out of 100
    2. Technical strengths
    3. Missing skills
    4. Weaknesses in the resume
    5. Suggestions to improve
    6. Best suitable roles for this candidate

    Format the response clearly with headings.

    Resume:
    {resume_text}
    """

    response = model.generate_content(prompt)

    return response.text