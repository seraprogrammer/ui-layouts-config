import React, { FormEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  selectedProvider: "google" | "groq";
  setSelectedProvider: (provider: "google" | "groq") => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  selectedProvider,
  setSelectedProvider,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-gray-800 p-4 md:px-8 lg:px-16 xl:px-32">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`How can ${
                selectedProvider === "google" ? "Google AI" : "Groq"
              } help?`}
              className="flex-1 p-3 bg-transparent outline-none resize-none min-h-[56px] max-h-[200px] text-gray-200"
              disabled={isLoading}
              rows={1}
            />
            <div className="flex items-center pr-2">
              {/* Model selector */}
              <div className="relative mr-2">
                <select
                  value={selectedProvider}
                  onChange={(e) =>
                    setSelectedProvider(e.target.value as "google" | "groq")
                  }
                  className="appearance-none bg-gray-700 text-gray-200 px-3 py-1 pr-8 rounded-md text-sm cursor-pointer"
                >
                  <option value="google">Gemini</option>
                  <option value="groq">DeepSeek</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Send button */}
              <button
                type="submit"
                className={`p-2 rounded-md ${
                  isLoading || !input.trim()
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-gray-700"
                }`}
                disabled={isLoading || !input.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
