from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# =========================
# CONFIG
# =========================

SECRET_KEY = "schoolcore-secret-key"
ALGORITHM = "HS256"

security = HTTPBearer()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# =========================
# TOKEN FUNCTIONS (FIXED)
# =========================

def create_token(data: dict, expire_minutes: int = 60):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expire_minutes
    )

    # FIX: MUST be UNIX timestamp
    to_encode.update({
        "exp": int(expire.timestamp())
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("TOKEN OK:", payload)
        return payload

    except JWTError as e:
        print("TOKEN ERROR:", str(e))
        return None

# =========================
# AUTH DEPENDENCIES
# =========================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    user = verify_token(token)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return user


def require_role(required_role: str):

    def role_checker(
        user=Depends(get_current_user)
    ):

        if user.get("role") != required_role:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to perform this action"
            )

        return user

    return role_checker