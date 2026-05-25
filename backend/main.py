from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analyze import router as analyze_router

app = FastAPI()
# CORS middleware is the standard FastAPI approach for frontend-backend communication.
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)

@app.get("/")
def home():
    return {
        "message": "AI Resume Analyzer Backend Running"
    }