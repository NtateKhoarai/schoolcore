from pydantic import BaseModel
from app.database import Base

class StudentCreate(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    gender: str
    class_name: str
    parent_name: str
    parent_phone: str