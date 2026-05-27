from sqlalchemy import Column, Integer, String
from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String, nullable=False)

    date = Column(String, nullable=False)

    status = Column(String, nullable=False)

    remarks = Column(String, nullable=True)