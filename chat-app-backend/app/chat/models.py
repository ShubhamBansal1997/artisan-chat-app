from app.core.db.session import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, func, Boolean


class Message(Base):
    __tablename__ = "message"
    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(String, index=True, nullable=False)
    message = Column(Text, nullable=False)
    content = Column(String, nullable=False)
    sender = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    is_deleted = Column(Boolean, default=False, index=True)

    class Config:
        orm_mode = True