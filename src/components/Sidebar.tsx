import React from "react";
import { Conversation } from "../types";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  createNewConversation: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  createNewConversation,
  switchConversation,
  deleteConversation,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static top-0 bottom-0 left-0 z-20
        w-64 bg-[#121212] flex flex-col h-full transition-transform duration-300 ease-in-out
        shadow-[1px_0_3px_0_rgba(0,0,0,0.3)] border-r border-gray-800
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Close button (mobile only) */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* New chat button */}
        <div className="p-4">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-3 rounded-md border border-white/20 p-3 text-white hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            New chat
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs text-gray-400 uppercase">
            Recent conversations
          </div>
          <ul className="space-y-1 px-2">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="group relative">
                <button
                  onClick={() => switchConversation(conversation.id)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-colors ${
                    currentConversationId === conversation.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{conversation.title}</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  title="Delete conversation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
