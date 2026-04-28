from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import Church, User
from schemas import RegisterInput, LoginInput, TokenResponse, UserOut
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(data: RegisterInput, db: Session = Depends(get_db)):
    existing_church = db.query(Church).filter(Church.email == data.church_email).first()
    if existing_church:
        raise HTTPException(status_code=400, detail="Church email already registered")

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User email already registered")

    church = Church(name=data.church_name, email=data.church_email)
    db.add(church)
    db.commit()
    db.refresh(church)

    user = User(
        church_id=church.id,
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="admin"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"user_id": user.id, "church_id": church.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenResponse)
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": user.id, "church_id": user.church_id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login/swagger", response_model=TokenResponse)
def login_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": user.id, "church_id": user.church_id})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user