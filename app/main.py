from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.inquiry import router as inquiry_router

app = FastAPI(
    title="AX Decision Fabric",
    version="0.1.0",
    description="Policy-aware operational decision layer"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(incidents_router, prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(inquiry_router, prefix="/api/v1")