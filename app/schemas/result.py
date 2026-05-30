from pydantic import BaseModel


class ResultCreate(BaseModel):
    student_id: str
    subject: str
    term: str
    score: int
    grade: str
    teacher: str