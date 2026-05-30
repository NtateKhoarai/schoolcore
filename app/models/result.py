from sqlalchemy import Column, Integer, String
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