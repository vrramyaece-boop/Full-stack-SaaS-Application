# app/routers/projects.py
# Projects router for project management

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, models, schemas
from app.auth import get_current_active_user

router = APIRouter()

def check_project_limit(current_user: models.User, db: Session):
    """Check if user has reached project limit based on subscription"""
    subscription = crud.get_subscription_by_user(db, current_user.id)
    plan = subscription.plan if subscription else "free"
    project_count = crud.get_project_count_by_owner(db, current_user.id)
    if plan == "free" and project_count >= 3:
        raise HTTPException(status_code=403, detail="Free plan limited to 3 projects")

@router.get("/", response_model=list[schemas.Project])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all projects for the current user"""
    projects = crud.get_projects_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)
    return projects

@router.post("/", response_model=schemas.Project)
def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    check_project_limit(current_user, db)
    return crud.create_project(db=db, project=project, owner_id=current_user.id)

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    project_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific project by ID"""
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a project"""
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    updated_project = crud.update_project(db, project_id=project_id, project_update=project_update)
    return updated_project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    crud.delete_project(db, project_id=project_id)
    return {"message": "Project deleted successfully"}