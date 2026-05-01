import pandas as pd
import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Member, Attendance, Service, User
from auth import get_current_user
import csv

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


@router.post("/members/import")
async def import_members(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file format")

    if "full_name" not in [c.lower().strip() for c in df.columns]:
        raise HTTPException(status_code=400, detail="File must have a 'full_name' column")

    df.columns = df.columns.str.lower().str.strip()

    added = 0
    skipped = 0

    for _, row in df.iterrows():
        full_name = str(row.get("full_name", "")).strip()
        if not full_name:
            skipped += 1
            continue

        date_joined = None
        if "date_joined" in row and pd.notna(row["date_joined"]):
            try:
                date_joined = pd.to_datetime(row["date_joined"]).date()
            except Exception:
                date_joined = None

        member = Member(
            church_id=current_user.church_id,
            full_name=full_name,
            phone=str(row.get("phone", "") or "").strip() or None,
            email=str(row.get("email", "") or "").strip() or None,
            address=str(row.get("address", "") or "").strip() or None,
            date_joined=date_joined,
            status="active"
        )
        db.add(member)
        added += 1

    db.commit()
    return {"added": added, "skipped": skipped}