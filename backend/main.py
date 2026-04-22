from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import workouts, metrics, progress, adaptive

app = FastAPI(title="Golf Trainer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
app.include_router(adaptive.router, prefix="/adaptive", tags=["adaptive"])

@app.get("/")
def root():
    return {"status": "Golf Trainer API running"}
