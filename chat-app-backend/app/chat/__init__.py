from fastapi import APIRouter
from app.chat.views import router

API_STR = "/api"

messages_router = APIRouter(prefix=API_STR)
messages_router.include_router(router)