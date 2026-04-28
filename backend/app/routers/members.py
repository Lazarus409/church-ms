from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Member, User
from auth import get_current_user
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/members", tags=["Members"])

# --- Schemas ---
class MemberCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    date_joined: Optional[date] = None

class MemberUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None

class MemberOut(BaseModel):
    id: int
    full_name: str
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    date_joined: Optional[date]
    status: str
    church_id: int

    class Config:
        from_attributes = True


# --- Routes ---
@router.post("/", response_model=MemberOut)
def add_member(
    data: MemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = Member(**data.model_dump(), church_id=current_user.church_id)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("/", response_model=List[MemberOut])
def get_members(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Member).filter(Member.church_id == current_user.church_id)
    if search:
        query = query.filter(Member.full_name.ilike(f"%{search}%"))
    return query.all()


@router.get("/{member_id}", response_model=MemberOut)
def get_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(Member).filter(
        Member.id == member_id,
        Member.church_id == current_user.church_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.put("/{member_id}", response_model=MemberOut)
def update_member(
    member_id: int,
    data: MemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(Member).filter(
        Member.id == member_id,
        Member.church_id == current_user.church_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(member, key, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}")
def delete_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(Member).filter(
        Member.id == member_id,
        Member.church_id == current_user.church_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"message": "Member deleted"}