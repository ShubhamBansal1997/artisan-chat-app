import React from "react";
import Avatar from "./Avatar";
import classNames from "classnames";
import Button from "./Button";
import * as constants from "../constants";

interface MessageProps {
  messageId: number;
  text: string;
  isUser?: boolean;
  showButtons?: boolean;
  onMessageButtonClick: (messageText: string) => void;
  handleMessageClick: (
    messageId: number,
    messageText: string,
    isUser: boolean
  ) => void;
}

const Message: React.FC<MessageProps> = ({
  messageId,
  text,
  isUser = false,
  onMessageButtonClick,
  handleMessageClick,
}) => {
  const [points, remainingText] = [
    text
      .match(/\d+\.\s[^.]+/g)
      ?.map((point) => point.replace(/^\d+\.\s*/, "")) || [],
    text
      .replace(/\d+\.\s[^.]+/g, "")
      .trim()
      .replace(/\s*\.\s*$/, ""),
  ];
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } items-start mb-2`}
    >
      {!isUser && (
        <Avatar
          src={`https://eu.ui-avatars.com/api/?name=${constants.DEFAULT_USER}&size=250`}
          alt="Ava"
        />
      )}
      <div
        className={classNames("p-2.5 max-w-[70%]", {
          "bg-[#6b4eff] text-white rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] ml-0 mr-2":
            isUser,
          "bg-[#F9FAFB] text-black rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] ml-2 mr-0":
            !isUser,
        })}
        onClick={() => handleMessageClick(messageId, text, isUser)}
      >
        {remainingText}
        {points && (
          <div className="mt-2 flex flex-col">
            {points.map((point, index) => (
              <Button key={index} onClick={() => onMessageButtonClick(point)}>
                {point}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
