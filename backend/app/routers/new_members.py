from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import NewMember, Member, User
from auth import get_current_user
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/new-members", tags=["New Members"])


class NewMemberCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    reason: str


class NewMemberOut(BaseModel):
    id: int
    full_name: str
    phone: Optional[str]
    email: Optional[str]
    reason: str
    added_to_members: bool
    church_id: int
    created_at: str

    class Config:
        from_attributes = True


@router.post("/register/{church_id}")
def register_new_member(
    church_id: int,
    data: NewMemberCreate,
    db: Session = Depends(get_db)
):
    new_member = NewMember(
        church_id=church_id,
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        reason=data.reason,
        added_to_members=False
    )
    db.add(new_member)

    if data.reason == "worship":
        member = Member(
            church_id=church_id,
            full_name=data.full_name,
            phone=data.phone,
            email=data.email,
            status="active",
            date_joined=date.today()
        )
        db.add(member)
        new_member.added_to_members = True

    db.commit()
    db.refresh(new_member)
    return {
        "message": "Thank you for visiting!",
        "added_to_members": new_member.added_to_members
    }


@router.get("/", response_model=list[NewMemberOut])
def get_new_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(NewMember).filter(
        NewMember.church_id == current_user.church_id
    ).order_by(NewMember.created_at.desc()).all()


@router.delete("/{member_id}")
def delete_new_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(NewMember).filter(
        NewMember.id == member_id,
        NewMember.church_id == current_user.church_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(member)
    db.commit()
    return {"message": "Deleted"}