from pydantic import BaseModel
from app.database import Base


class TeacherCreate(BaseModel):
    teacher_id: str
    first_name: str
    last_name: str
    gender: str
    subject: str
    phone: str
    email: str
    class_assigned: str