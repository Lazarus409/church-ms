import pandas as pd
import io
import csv
import qrcode
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Member, Attendance, Service, User, Church
from auth import get_current_user

router = APIRouter(prefix="/export", tags=["Export"])


# --- Export Members ---
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


# --- Export Attendance ---
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


# --- Import Members ---
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

    df.columns = df.columns.str.lower().str.strip().str.replace(" ", "_").str.replace("-", "_")

    name_variants = ["full_name", "name", "member_name", "fullname", "full name", "member", "names"]
    phone_variants = ["phone", "phone_number", "mobile", "mobile_number", "tel", "telephone", "contact"]
    email_variants = ["email", "email_address", "mail", "e_mail"]
    address_variants = ["address", "location", "home_address", "residence", "area"]
    date_variants = ["date_joined", "join_date", "date", "joined", "joined_date", "membership_date", "date_of_joining"]

    def find_column(df, variants):
        for v in variants:
            normalized = v.lower().replace(" ", "_").replace("-", "_")
            if normalized in df.columns:
                return normalized
        return None

    name_col = find_column(df, name_variants)
    if not name_col:
        raise HTTPException(
            status_code=400,
            detail=f"Could not find a name column. Your columns are: {list(df.columns)}. Please include one of: full_name, name, member_name."
        )

    phone_col = find_column(df, phone_variants)
    email_col = find_column(df, email_variants)
    address_col = find_column(df, address_variants)
    date_col = find_column(df, date_variants)

    added = 0
    skipped = 0

    for _, row in df.iterrows():
        full_name = str(row.get(name_col, "")).strip()
        if not full_name or full_name.lower() == "nan":
            skipped += 1
            continue

        date_joined = None
        if date_col and pd.notna(row.get(date_col)):
            try:
                date_joined = pd.to_datetime(row[date_col]).date()
            except Exception:
                date_joined = None

        def safe_get(col):
            if col and pd.notna(row.get(col)):
                val = str(row[col]).strip()
                return val if val and val.lower() != "nan" else None
            return None

        member = Member(
            church_id=current_user.church_id,
            full_name=full_name,
            phone=safe_get(phone_col),
            email=safe_get(email_col),
            address=safe_get(address_col),
            date_joined=date_joined,
            status="active"
        )
        db.add(member)
        added += 1

    db.commit()
    return {"added": added, "skipped": skipped}


# --- QR Code (public, no auth needed) ---
@router.get("/qr/entrance/{church_id}")
def get_entrance_qr(
    church_id: int,
    db: Session = Depends(get_db)
):
    church = db.query(Church).filter(Church.id == church_id).first()
    if not church:
        raise HTTPException(status_code=404, detail="Church not found")

    url = f"https://church-ms-seven.vercel.app/checkin/{church_id}"

    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={"Content-Disposition": "inline; filename=entrance_qr.png"}
    )