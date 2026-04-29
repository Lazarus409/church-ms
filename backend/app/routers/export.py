from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Member, Attendance, Service, User
from auth import get_current_user
import csv
import io

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/members")
def export_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    members = db.query(Member).filter(
        Member.church_id == current_user.church_id
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Full Name", "Phone", "Email", "Address", "Date Joined", "Status"])
    for m in members:
        writer.writerow([m.id, m.full_name, m.phone, m.email, m.address, m.date_joined, m.status])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=members.csv"}
    )


@router.get("/attendance")
def export_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(Attendance, Member, Service).join(
        Member, Attendance.member_id == Member.id
    ).join(
        Service, Attendance.service_id == Service.id
    ).filter(
        Attendance.church_id == current_user.church_id
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Member Name", "Service", "Date", "Status"])
    for attendance, member, service in records:
        writer.writerow([member.full_name, service.name, service.scheduled_date, attendance.status])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=attendance.csv"}
    )