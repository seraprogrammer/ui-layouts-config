import React from "react";
import { Message } from "../types";
import FormattedMessage from "./FormattedMessage";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-8">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <h2 className="text-3xl font-bold mb-4">Welcome to AI Chat</h2>
          <p className="text-lg">Ask me anything to start a conversation</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className="w-full">
            <div
              className={`flex items-start gap-4 ${
                message.role === "assistant"
                  ? "bg-gray-800/20 -mx-4 px-4 py-6 border-b border-t border-gray-800"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {message.role === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Message content */}
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className="font-medium text-gray-200">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  {message.provider && (
                    <div className="ml-2 text-xs text-gray-400">
                      via {message.provider}
                    </div>
                  )}
                </div>

                <div>
                  <FormattedMessage
                    content={message.content}
                    isAssistant={message.role === "assistant"}
                  />
                </div>

                {message.tokenCount && (
                  <div className="mt-2 text-xs text-gray-400 text-right">
                    {message.tokenCount} tokens
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="w-full">
          <div className="flex items-start gap-4 bg-gray-800/20 -mx-4 px-4 py-6 border-b border-t border-gray-800">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center mb-1">
                <div className="font-medium text-gray-200">AI Assistant</div>
              </div>

              <div className="min-h-[40px] flex items-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
