from pydantic import BaseModel, Field
from typing import Optional


class MessageCreateSchema(BaseModel):
    chat_id: str = Field(example=1)
    sender: str = Field(example="John")
    message: str = Field(example="Hello World")
    content: str = Field(example="Human")


class MessageUpdateSchema(BaseModel):
    message: str = Field(example="Hello World")
