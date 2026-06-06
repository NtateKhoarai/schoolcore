from pydantic import BaseModel
from app.database import Base

class RegisterSchoolRequest(BaseModel):
    school_name: str
    school_email: str
    school_phone: str
    school_address: str

    admin_username: str
    admin_password: str