from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String)
    subject = Column(String)
    term = Column(String)

    score = Column(Integer)
    grade = Column(String)
    teacher = Column(String)

    assessment_type = Column(String, default="Test")
    assessment_name = Column(String, nullable=True)

    total_marks = Column(Float, default=100)
    percentage = Column(Float, nullable=True)

    feedback = Column(String, nullable=True)