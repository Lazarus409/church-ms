from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Member, Attendance, Service, User
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    church_id = current_user.church_id

    total_members = db.query(Member).filter(
        Member.church_id == church_id
    ).count()

    active_members = db.query(Member).filter(
        Member.church_id == church_id,
        Member.status == "active"
    ).count()

    inactive_members = total_members - active_members

    total_services = db.query(Service).filter(
        Service.church_id == church_id
    ).count()

    total_attendance = db.query(Attendance).filter(
        Attendance.church_id == church_id,
        Attendance.status == "present"
    ).count()

    # Attendance per service (last 6 services)
    recent_services = db.query(Service).filter(
        Service.church_id == church_id
    ).order_by(Service.scheduled_date.desc()).limit(6).all()

    attendance_trend = []
    for service in recent_services:
        count = db.query(Attendance).filter(
            Attendance.service_id == service.id,
            Attendance.status == "present"
        ).count()
        attendance_trend.append({
            "service": service.name,
            "date": str(service.scheduled_date),
            "present": count
        })

    return {
        "total_members": total_members,
        "active_members": active_members,
        "inactive_members": inactive_members,
        "total_services": total_services,
        "total_attendance": total_attendance,
        "attendance_trend": attendance_trend
    }