from fastapi import FastAPI
from app.database import engine, Base
from app.routes.student import router as student_router
from app.routes.auth import router as auth_router
from app.models.user import User
from app.routes.attendance import router as attendance_router
from app.models.attendance import Attendance

app = FastAPI(
    title="SchoolCore Lite",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
Base.metadata.create_all(bind=engine)

app.include_router(student_router)
app.include_router(auth_router)
app.include_router(attendance_router)
@app.get("/")
def home():
    return {"message": "SchoolCore Lite Running"}
