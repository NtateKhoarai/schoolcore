from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    student_id: str
    date: str
    status: str
    remarks: str | None = None