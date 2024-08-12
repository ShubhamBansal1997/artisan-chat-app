import os
from dotenv import load_dotenv
from unittest.mock import Mock, patch

from app.main import app
from app.core.db.session import Base
from app.core.db.mock_session import engine, test_client

load_dotenv(".env")

# It drops everything from the db and then recreate each time tests runs
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = test_client()
ENDPOINT = "/api/messages"
LAST_RECORD_ID = 1
PAYLOAD = {
    "chat_id": "chat-1",
    "sender": "John",
    "message": "Sample chat message",
    "content": "Onboarding"
}

def test_add_message():

    """
    Tests if the messages are being added to the database
    """

    response = client.post(ENDPOINT, json=PAYLOAD)
    data = response.json()

    # validates if the request was successfull
    assert response.status_code == 201

    data = data["messages"][0]

    # validates the saved record
    assert ("chat_id" in data) and ("sender" in data) and ("message" in data) and ("content" in data) and ("id" in data)


def test_get_messages():

    """
    Tests if the messages get request is successful
    """
    chat_id = PAYLOAD["chat_id"]

    response = client.get(f"{ENDPOINT}/{chat_id}")

    LAST_RECORD_ID = response.json()["messages"][-1]["id"]

    # validates if the request was successful
    assert response.status_code == 200


def test_add_invalid_message():

    """
    Tests if it validates the invalid payload
    """

    invalid_payload = PAYLOAD.copy()
    invalid_payload.pop("chat_id", None)

    response = client.post(ENDPOINT, json=invalid_payload)

    # validates if the request was invalid because of inappropriate data
    assert response.status_code == 422


def test_update_message():

    """
    Tests if the message is being updated
    """

    updated_payload = PAYLOAD.copy()
    updated_payload["message"] = "Update Message"
    response = client.put(
        f"{ENDPOINT}/{LAST_RECORD_ID}", json=updated_payload
    )

    # validates if the request was successful
    assert response.status_code == 201


def test_delete_message():

    """
    Tests if the message is being delete
    """

    response = client.delete(f"{ENDPOINT}/{LAST_RECORD_ID}")

    # validates if the request was successful
    assert response.status_code == 204