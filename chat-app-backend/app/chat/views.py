from typing import Optional
from app.chat.constants import AI_SENDER_NAME
from app.chat.service import generate_ai_response
from loguru import logger
from app.chat.schema import MessageCreateSchema, MessageUpdateSchema
from fastapi import Depends, APIRouter, status
from sqlalchemy.orm import Session
from app.core.db.session import get_db
from app.chat.models import Message


router = APIRouter()


@router.post("/messages/", status_code=status.HTTP_201_CREATED)
async def add_message(message: MessageCreateSchema, db: Session = Depends(get_db)):
    """
    Add a message to the database

    Args:
        message (MessageCreateSchema): message object
    Returns:
        Object: AI response with 201 status code
    """
    db_message = Message(sender=message.sender, message=message.message, chat_id=message.chat_id, content=message.content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    user_message = {**db_message.__dict__}
    print(db_message)
    logger.success("Added a message.")
    ai_response = await generate_ai_response(message.message, message.content)
    ai_message = Message(sender=AI_SENDER_NAME, message=ai_response, chat_id=message.chat_id, content=message.content)
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    print(ai_message)
    logger.success("AI response added.")
    return {"messages": [user_message, ai_message]}


@router.get("/messages/{chat_id}", status_code=status.HTTP_200_OK)
async def get_messages(chat_id: str, offset: Optional[int] = 0, limit: Optional[int] = 10, db: Session = Depends(get_db)):
    query = db.query(Message).filter(Message.chat_id == chat_id, Message.is_deleted == False).order_by(Message.id.desc())
    messages = query.all()
    logger.success("Messages fetched.")
    return {
        "messages": messages[::-1]
    }


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: int, db: Session = Depends(get_db)):
    """
    Delete a message by message_id

    Args:
        message_id (int): message_id
    Returns:
        Object: Deleted true with 204 status code
    """
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        logger.error("Message not found.")
        return {"detail": "Message not found."}
    db.delete(db_message)
    db.commit()
    logger.success("Message deleted.")
    return {"Deleted": True}

@router.put("/messages/{message_id}", status_code=status.HTTP_201_CREATED)
async def update_message(message_id: int, message: MessageUpdateSchema, db: Session = Depends(get_db)):
    """
    Update a message by message_id

    Args:
        message_id (int): message_id
        message (MessageUpdateSchema): message object
    Returns:
        Object: Updated message with 201 status code
    """
    db_message = db.query(Message).filter(Message.id == message_id, Message.is_deleted == False).first()
    if not db_message:
        logger.error("Message not found.")
        return {"detail": "Message not found."}
    elif db_message.sender == AI_SENDER_NAME:
        logger.error("Cannot update AI message.")
        return {"detail": "Cannot update AI message."}
    db_message.message = message.message
    db.commit()
    db.refresh(db_message)
    logger.success("Message updated.")
    return db_message
