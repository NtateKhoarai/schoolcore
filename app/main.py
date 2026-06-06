from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from fastapi.middleware.cors import CORSMiddleware

from app.routes.student import router as student_router
from app.routes.auth import router as auth_router
from app.routes.attendance import router as attendance_router
from app.routes.teacher import router as teacher_router
from app.routes.result import router as result_router
from app.routes.report import router as report_router
from app.routes.analytics import router as analytics_router

from app.models.attendance import Attendance

app = FastAPI(
    title="SchoolCore Lite",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# TEMP CLEAN START (for debugging)

app.include_router(student_router)
app.include_router(auth_router)
app.include_router(attendance_router)
app.include_router(teacher_router)
app.include_router(result_router)
app.include_router(report_router)
app.include_router(analytics_router)

@app.get("/")
def home():
    return {"message": "SchoolCore Lite Running"}
