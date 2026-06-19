from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
import os
import auth_routes
import request_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Service Request API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(request_routes.router, prefix="/api/requests", tags=["requests"])

@app.get("/")
def root():
    return {"message": "Service Request API is running!"}
