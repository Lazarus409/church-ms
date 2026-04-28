from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# --- Enums ---
class SubscriptionPlan(str, enum.Enum):
    free = "free"
    basic = "basic"
    pro = "pro"

class UserRole(str, enum.Enum):
    admin = "admin"
    pastor = "pastor"
    worker = "worker"

class MemberStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"

# --- Tables ---
class Church(Base):
    __tablename__ = "churches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.free)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="church")
    members = relationship("Member", back_populates="church")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    church_id = Column(Integer, ForeignKey("churches.id"), nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.worker)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    church = relationship("Church", back_populates="users")


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    church_id = Column(Integer, ForeignKey("churches.id"), nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    date_joined = Column(Date)
    status = Column(Enum(MemberStatus), default=MemberStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    church = relationship("Church", back_populates="members")
    attendance = relationship("Attendance", back_populates="member")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    church_id = Column(Integer, ForeignKey("churches.id"), nullable=False)
    name = Column(String, nullable=False)
    scheduled_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance = relationship("Attendance", back_populates="service")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    church_id = Column(Integer, ForeignKey("churches.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.present)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    member = relationship("Member", back_populates="attendance")
    service = relationship("Service", back_populates="attendance")