from sqlalchemy import Column, Integer, String
from app.database import Base

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, index=True)
    email = Column(String)
    phone = Column(String)
    address = Column(String)