# app/routers/admin.py
# Admin router for admin panel

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, models, schemas
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/users", response_model=list[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/subscriptions", response_model=list[schemas.Subscription])
def read_subscriptions(
    skip: int = 0,
    limit: int = 100,
    current_admin: models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all subscriptions (admin only)"""
    subscriptions = crud.get_subscriptions(db, skip=skip, limit=limit)
    return subscriptions