import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import Avatar from "./Avatar";
import {
  FaRegTrashAlt,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import * as constants from "../constants.tsx";

interface Message {
  message: string;
  id: number;
  sender: string;
  updated_at: string;
  is_deleted: boolean;
  content: string;
  chat_id: string;
  created_at: string;
}

const ChatBox: React.FC = () => {
  const [messageId, setMessageId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatId, setChatId] = useLocalStorage<string>(
    constants.CHAT_ID_KEY,
    uuidv4()
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("Onboarding");
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${constants.API_URL}/${chatId}?offset=0&limit=10`
      );
      const data = await response.json();
      setMessages(data.messages);
      setInputValue("");
      setMessageId(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchMessages();
      } else {
        console.error("Failed to delete message");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting message:", error);
      setLoading(false);
    }
  };

  const handleEditMessage = async (messageId: number, messageText: string) => {
    try {
      setLoading(true);
      const payload = {
        message: messageText,
      };

      const response = await fetch(`${constants.API_URL}/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchMessages();
      } else {
        console.error("Failed to edit message");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error editing message:", error);
      setLoading(false);
    }
  };

  const handleMessageClick = (
    messageId: number,
    messageText: string,
    isUser: boolean
  ) => {
    if (!isUser) {
      return;
    }
    setMessageId(messageId);
    setInputValue(messageText);
  };

  const handleSendMessage = async (inputValue: string) => {
    setLoading(true);
    if (!inputValue) {
      alert("Please enter a message");
      return;
    }
    const payload = {
      chat_id: chatId,
      sender: constants.DEFAULT_USER,
      message: inputValue,
      content: selectedOption,
    };

    try {
      const response = await fetch(`${constants.API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear the input value after sending the message
        setInputValue("");
        // Re-fetch messages after successful POST
        setMessages((messages) => [...messages, ...data.messages]);
      } else {
        console.error("Failed to send message");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  const handleButtonClick = (messageText: string) => {
    // Update the inputText state
    setInputValue(messageText);

    // Call the send function after updating the inputText
    handleSendMessage(messageText);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, []); // Empty dependency array means this useEffect runs once after the component mounts.
  return (
    <div className="w-[400px] mx-auto p-5 border border-[#ccc] rounded-lg shadow-md font-roboto flex flex-col h-screen box-border">
      <div className="flex justify-center items-center mb-5 flex-col">
        <Avatar
          src="https://eu.ui-avatars.com/api/?name=Ava&size=250"
          alt="Ava"
        />
        <div className="text-lg font-bold ml-2.5">Hey👋, I'm Ava</div>
        <div className="text-sm text-gray-500">
          Ask me Anything or pick a place to start
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pb-5">
        {messages.map((message) => {
          return (
            <Message
              messageId={message.id}
              text={message.message}
              isUser={message.sender !== constants.AI_USER}
              key={message.id}
              onMessageButtonClick={handleButtonClick}
              handleMessageClick={handleMessageClick}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col border-t border-gray-300 p-2.5 bg-white sticky bottom-0 z-10">
        <div className="flex items-center">
          <Avatar
            src={`https://eu.ui-avatars.com/api/?name=${constants.DEFAULT_USER}&size=250`}
            alt="User"
          />
          <input
            disabled={loading}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow border-transparent rounded-5 p-2.5 font-roboto focus:outline-none"
            type="text"
            placeholder="Your Question"
          />
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center">
            <div className="mr-1.5 font-roboto text-md">Context:</div>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-md p-1.5 text-md font-roboto"
            >
              <option>Onboarding</option>
              <option>Support</option>
              <option>Feedback</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "left" }}>
            {messageId && (
              <>
                <div
                  className="text-gray-500 text-lg flex items-center ml-1.5 cursor-pointer rounded-full px-2.5 py-1 font-roboto hover:text-black"
                  onClick={() => handleDeleteMessage(messageId)}
                >
                  <FaRegTrashAlt />
                </div>
                <div
                  className="text-gray-500 text-lg flex items-center ml-1.5 cursor-pointer rounded-full px-2.5 py-1 font-roboto hover:text-black"
                  onClick={() => handleEditMessage(messageId, inputValue)}
                >
                  <FaEdit />
                </div>
              </>
            )}
            {!messageId && (
              <div
                className="text-gray-500 text-lg flex items-center ml-1.5 cursor-pointer rounded-full px-2.5 py-1 font-roboto hover:text-black"
                onClick={() => handleSendMessage(inputValue)}
              >
                <FaPaperPlane />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
