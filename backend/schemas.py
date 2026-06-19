from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ServiceRequestCreate(BaseModel):
    title: str
    description: str
    category: str
    address: str
    preferred_time: str

class ServiceRequestOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    address: str
    preferred_time: str
    status: str
    image_path: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str
