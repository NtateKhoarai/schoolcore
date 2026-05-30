from sqlalchemy import Column, Integer, String
from app.database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)

    teacher_id = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)

    gender = Column(String)

    subject = Column(String)

    phone = Column(String)

    email = Column(String)

    class_assigned = Column(String)