from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    name = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    description = Column(Text)
    category = Column(String(100))
    address = Column(String(255))
    preferred_time = Column(String(100))
    status = Column(Enum("Pending", "In Progress", "Completed", "Cancelled"), default="Pending")
    image_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
