import os
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware
from dotenv import load_dotenv

from app.chat import messages_router
from app.core.main_router import router as main_router
from app.core.logger import init_logging

load_dotenv(".env")

root_router = APIRouter()

app = FastAPI(title="Chat Application")
app.add_middleware(DBSessionMiddleware, db_url=os.environ["DATABASE_URL"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. You can specify a list of allowed origins instead of ["*"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(main_router)
app.include_router(messages_router)
app.include_router(root_router)

init_logging()

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")