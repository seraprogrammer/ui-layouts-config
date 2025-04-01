import { useState, FormEvent, useRef, useEffect } from "react";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

// Initialize AI providers
const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY || "", // Use environment variable
});

const groq = createGroq({
  apiKey: import.meta.env.VITE_REACT_APP_GROQ_API_KEY || "", // Use environment variable
});

// Define message type
interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: "google" | "groq";
  tokenCount?: number;
}

// Simple token estimation function
const estimateTokens = (text: string): number => {
  // A very rough estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "groq">(
    "google"
  );
  const [totalTokens, setTotalTokens] = useState<{
    google: number;
    groq: number;
  }>({ google: 0, groq: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Estimate tokens for user input
    const inputTokens = estimateTokens(input);

    // Add user message with token count
    const userMessage: Message = {
      role: "user",
      content: input,
      tokenCount: inputTokens,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Update total tokens for the selected provider
    setTotalTokens((prev) => ({
      ...prev,
      [selectedProvider]: prev[selectedProvider] + inputTokens,
    }));

    try {
      // Add placeholder for assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        provider: selectedProvider,
        tokenCount: 0,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (selectedProvider === "google") {
        // Stream text using Google
        const { textStream } = await streamText({
          model: google("gemini-2.0-flash"),
          prompt: input,
        });

        // Update message content as chunks arrive
        let fullResponse = "";
        for await (const chunk of textStream) {
          fullResponse += chunk;
          const responseTokens = estimateTokens(fullResponse);

          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              content: fullResponse,
              tokenCount: responseTokens,
            },
          ]);

          // Update total tokens for Google
          setTotalTokens((prev) => ({
            ...prev,
            google:
              prev.google -
              (prev[prev.length - 1]?.tokenCount || 0) +
              responseTokens,
          }));
        }
      } else {
        // Stream text using Groq
        const { textStream } = await streamText({
          model: groq("deepseek-r1-distill-llama-70b"),
          prompt: input,
        });

        // Update message content as chunks arrive
        let fullResponse = "";
        for await (const chunk of textStream) {
          fullResponse += chunk;
          const responseTokens = estimateTokens(fullResponse);

          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              content: fullResponse,
              tokenCount: responseTokens,
            },
          ]);

          // Update total tokens for Groq
          setTotalTokens((prev) => ({
            ...prev,
            groq:
              prev.groq -
              (prev[prev.length - 1]?.tokenCount || 0) +
              responseTokens,
          }));
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Update the last message to show the error
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
          provider: selectedProvider,
          tokenCount: 0,
        },
      ]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  // Message action buttons
  const MessageActions = () => (
    <div className="flex space-x-2 mt-2">
      <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
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
          className="text-gray-400"
        >
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
          <path d="M17 12H7"></path>
          <path d="m13 8-4 4 4 4"></path>
        </svg>
      </button>
      <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
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
          className="text-gray-400"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
      </button>
      <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
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
          className="text-gray-400"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
      <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
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
          className="text-gray-400"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </button>
      <button className="p-1 rounded-full hover:bg-gray-700 transition-colors">
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
          className="text-gray-400"
        >
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3"></path>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Token usage display - small floating panel */}
      <div className="fixed top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg text-xs z-10">
        <div className="font-medium mb-1">Token Usage (estimated):</div>
        <div>Google: {totalTokens.google} tokens</div>
        <div>Groq: {totalTokens.groq} tokens</div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-auto py-4 px-4 md:px-8 lg:px-16 xl:px-32">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <h2 className="text-2xl font-bold mb-4">Welcome to AI Chat</h2>
              <p>Start a conversation with your AI assistant</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
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
    </div>
  );
}
