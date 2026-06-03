from pydantic import BaseModel
from typing import Optional


class ResultCreate(BaseModel):
    student_id: str
    subject: str
    term: str

    score: int
    grade: str
    teacher: str

    # =========================
    # ASSESSMENT SYSTEM (FULLY INTEGRATED)
    # =========================
    assessment_type: str = "Test"   # Test | Quiz | Assignment | Exam
    assessment_name: Optional[str] = None

    total_marks: float = 100
    percentage: Optional[float] = None
    feedback: Optional[str] = None