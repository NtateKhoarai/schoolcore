from pydantic import BaseModel


class TeacherCreate(BaseModel):
    teacher_id: str
    first_name: str
    last_name: str
    gender: str
    subject: str
    phone: str
    email: str
    class_assigned: str