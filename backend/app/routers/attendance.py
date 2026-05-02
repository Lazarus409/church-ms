from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Attendance, Member, Service, User
from auth import get_current_user
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/attendance", tags=["Attendance"])


# --- Schemas ---
class ServiceCreate(BaseModel):
    name: str
    scheduled_date: date

class ServiceOut(BaseModel):
    id: int
    name: str
    scheduled_date: date
    church_id: int

    class Config:
        from_attributes = True

class AttendanceRecord(BaseModel):
    member_id: int
    status: str = "present"

class BulkAttendanceIn(BaseModel):
    service_id: int
    records: List[AttendanceRecord]

class AttendanceOut(BaseModel):
    id: int
    member_id: int
    service_id: int
    status: str
    church_id: int

    class Config:
        from_attributes = True

class NameCheckinIn(BaseModel):
    church_id: int
    service_id: int
    full_name: str


# --- Service routes ---
@router.post("/services", response_model=ServiceOut)
def create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = Service(**data.model_dump(), church_id=current_user.church_id)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get("/services", response_model=List[ServiceOut])
def get_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Service).filter(
        Service.church_id == current_user.church_id
    ).all()


@router.get("/services/public/{church_id}", response_model=List[ServiceOut])
def get_public_services(
    church_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Service).filter(
        Service.church_id == church_id
    ).order_by(Service.scheduled_date.desc()).limit(10).all()


# --- Attendance routes ---
@router.post("/mark", response_model=List[AttendanceOut])
def mark_attendance(
    data: BulkAttendanceIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(
        Service.id == data.service_id,
        Service.church_id == current_user.church_id
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    results = []
    for record in data.records:
        existing = db.query(Attendance).filter(
            Attendance.member_id == record.member_id,
            Attendance.service_id == data.service_id
        ).first()
        if existing:
            existing.status = record.status
            db.commit()
            db.refresh(existing)
            results.append(existing)
        else:
            attendance = Attendance(
                church_id=current_user.church_id,
                member_id=record.member_id,
                service_id=data.service_id,
                status=record.status
            )
            db.add(attendance)
            db.commit()
            db.refresh(attendance)
            results.append(attendance)
    return results


@router.post("/checkin-by-name")
def checkin_by_name(
    data: NameCheckinIn,
    db: Session = Depends(get_db)
):
    member = db.query(Member).filter(
        Member.church_id == data.church_id,
        Member.full_name.ilike(f"%{data.full_name}%")
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail=f"No member found with name '{data.full_name}'. Please check your name or contact the church admin."
        )

    service = db.query(Service).filter(
        Service.id == data.service_id,
        Service.church_id == data.church_id
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    existing = db.query(Attendance).filter(
        Attendance.member_id == member.id,
        Attendance.service_id == data.service_id
    ).first()
    if existing:
        return {
            "message": f"Welcome back {member.full_name}! You're already checked in.",
            "status": "already_checked_in"
        }

    attendance = Attendance(
        church_id=data.church_id,
        member_id=member.id,
        service_id=data.service_id,
        status="present"
    )
    db.add(attendance)
    db.commit()

    return {
        "message": f"Welcome {member.full_name}! Attendance marked successfully. 🙏",
        "status": "checked_in"
    }


@router.get("/service/{service_id}", response_model=List[AttendanceOut])
def get_service_attendance(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Attendance).filter(
        Attendance.service_id == service_id,
        Attendance.church_id == current_user.church_id
    ).all()


@router.get("/member/{member_id}", response_model=List[AttendanceOut])
def get_member_attendance(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Attendance).filter(
        Attendance.member_id == member_id,
        Attendance.church_id == current_user.church_id
    ).all()