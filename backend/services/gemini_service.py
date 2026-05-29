import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    os.getenv("MODEL_NAME", "gemini-2.5-flash")
)

def analyze_resume_with_ai(resume_text):

    prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze this resume and return ONLY valid JSON.

Resume:
{resume_text}

Return this exact JSON structure:

{{
  "ats_score": number,
  "summary": "short summary",
  "strengths": [
    "point 1",
    "point 2"
  ],
  "weaknesses": [
    "point 1",
    "point 2"
  ],
  "missing_keywords": [
    "keyword1",
    "keyword2"
  ],
  "suggestions": [
    "suggestion1",
    "suggestion2"
  ],
  "suitable_roles": [
    "role1",
    "role2"
  ],
  "final_verdict": "final verdict"
}}

Do not return markdown.
Do not return explanations outside JSON.
"""

    # call the configured model to generate a response for the prompt
    response = model.generate_content(prompt)
    response_text = response.text.strip()

    cleaned = response_text.replace("```json", "").replace("```", "")

    result = json.loads(cleaned)

    return result