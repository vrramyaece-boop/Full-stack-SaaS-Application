# app/crud.py
# CRUD operations for database models

from sqlalchemy.orm import Session
from sqlalchemy import and_
from app import models, schemas
from app.auth import get_password_hash, verify_password

# User CRUD
def get_user(db: Session, user_id: int):
    """Get a user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """Get a user by email"""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_stripe_customer_id(db: Session, stripe_customer_id: str):
    """Get a user by Stripe customer ID"""
    return db.query(models.User).filter(models.User.stripe_customer_id == stripe_customer_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users with pagination"""
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    """Update a user"""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

# Project CRUD
def get_project(db: Session, project_id: int):
    """Get a project by ID"""
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects_by_owner(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    """Get projects by owner with pagination"""
    return db.query(models.Project).filter(models.Project.owner_id == owner_id).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate, owner_id: int):
    """Create a new project"""
    db_project = models.Project(**project.dict(), owner_id=owner_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    """Update a project"""
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        for key, value in project_update.dict(exclude_unset=True).items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    """Delete a project"""
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project

def get_project_count_by_owner(db: Session, owner_id: int):
    """Get the count of projects for an owner"""
    return db.query(models.Project).filter(models.Project.owner_id == owner_id).count()

# Subscription CRUD
def get_subscription(db: Session, subscription_id: int):
    """Get a subscription by ID"""
    return db.query(models.Subscription).filter(models.Subscription.id == subscription_id).first()

def get_subscription_by_user(db: Session, user_id: int):
    """Get the active subscription for a user"""
    return db.query(models.Subscription).filter(
        and_(models.Subscription.user_id == user_id, models.Subscription.status == "active")
    ).first()

def get_subscription_by_stripe_subscription_id(db: Session, stripe_subscription_id: str):
    """Get a subscription by Stripe subscription ID"""
    return db.query(models.Subscription).filter(models.Subscription.stripe_subscription_id == stripe_subscription_id).first()

def get_subscriptions(db: Session, skip: int = 0, limit: int = 100):
    """Get all subscriptions with pagination"""
    return db.query(models.Subscription).offset(skip).limit(limit).all()

def create_subscription(db: Session, subscription: schemas.SubscriptionCreate):
    """Create a new subscription"""
    db_subscription = models.Subscription(**subscription.dict())
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

def update_subscription(db: Session, subscription_id: int, subscription_update: schemas.SubscriptionUpdate):
    """Update a subscription"""
    db_subscription = db.query(models.Subscription).filter(models.Subscription.id == subscription_id).first()
    if db_subscription:
        for key, value in subscription_update.dict(exclude_unset=True).items():
            setattr(db_subscription, key, value)
        db.commit()
        db.refresh(db_subscription)
    return db_subscription