from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health

app = FastAPI(
    title="FYP FastAPI Service",
    description="Python FastAPI backend for high-performance APIs and data/ML processing.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health router
app.include_router(health.router)

# Mount your custom routers here:
# app.include_router(your_router)

@app.get("/")
def root():
    return {
        "message": "FastAPI Server is Running",
        "docs": "/docs",
        "health": "/health"
    }
