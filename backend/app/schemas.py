from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- Church ---
class ChurchCreate(BaseModel):
    name: str
    email: EmailStr

# --- Auth ---
class RegisterInput(BaseModel):
    church_name: str
    church_email: EmailStr
    full_name: str
    email: EmailStr
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- User ---
class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    church_id: int
    created_at: datetime

    class Config:
        from_attributes = True