# app/main.py
# Main FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.database import engine, Base
from app.routers import users, auth, projects, subscriptions, admin

# Initialize FastAPI app
app = FastAPI(
    title="Project Management SaaS",
    description="A subscription-based SaaS application with user and admin panels",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    """Create database tables on startup if the database is available"""
    try:
        Base.metadata.create_all(bind=engine)
    except OperationalError:
        pass

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(subscriptions.router, prefix="/subscriptions", tags=["Subscriptions"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def read_root():
    """Root endpoint to check if the API is running"""
    return {"message": "Project Management SaaS API is running"}