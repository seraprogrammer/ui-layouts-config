import React from "react";
import { Message } from "../types";
import MessageActions from "./MessageActions";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-bold mb-4">Welcome to AI Chat</h2>
          <p>Start a conversation with your AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <div key={index} className="mb-8 max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              {message.role === "user" ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-bold">You</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {message.provider === "google" ? "G" : "Gr"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1 flex justify-between">
                <span>
                  {message.role === "user"
                    ? "You"
                    : message.provider === "google"
                    ? "Google AI"
                    : "Groq AI"}
                </span>
                {message.tokenCount !== undefined && (
                  <span className="text-xs text-gray-500">
                    ~{message.tokenCount} tokens
                  </span>
                )}
              </div>
              <div className="text-gray-200 whitespace-pre-wrap">
                {message.content ||
                  (isLoading && message.role === "assistant"
                    ? "Thinking..."
                    : "")}
              </div>
              {message.role === "assistant" && message.content && (
                <MessageActions />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageList;
