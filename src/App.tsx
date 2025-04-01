import { useState, FormEvent, useRef, useEffect } from "react";
import { Message, TokenUsage } from "./types";
import {
  estimateTokens,
  saveConversationToStorage,
  loadConversationFromStorage,
  generateId,
} from "./utils/chatUtils";
import { generateAIResponse } from "./services/aiService";
import TokenUsageDisplay from "./components/TokenUsageDisplay";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "groq">(
    "google"
  );
  const [totalTokens, setTotalTokens] = useState<TokenUsage>({
    google: 0,
    groq: 0,
  });
  const [userId] = useState<string>(() => {
    // Try to get existing userId from localStorage
    const savedUserId = localStorage.getItem("chat_user_id");
    if (savedUserId) return savedUserId;

    // Create a new userId if none exists
    const newUserId = "user-" + generateId();
    localStorage.setItem("chat_user_id", newUserId);
    return newUserId;
  });
  const [conversationId] = useState<string>(() => {
    // Try to get existing conversationId from localStorage
    const savedConversationId = localStorage.getItem("chat_conversation_id");
    if (savedConversationId) return savedConversationId;

    // Create a new conversationId if none exists
    const newConversationId = "conversation-" + generateId();
    localStorage.setItem("chat_conversation_id", newConversationId);
    return newConversationId;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history on initial render
  useEffect(() => {
    const savedMessages = loadConversationFromStorage(conversationId);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, [conversationId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Save conversation to localStorage whenever messages change
    if (messages.length > 0) {
      saveConversationToStorage(conversationId, messages);
    }
  }, [messages, conversationId]);

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

    // Update messages with user input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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
      setMessages([...updatedMessages, assistantMessage]);

      // Generate AI response
      await generateAIResponse(
        updatedMessages,
        selectedProvider,
        (fullResponse) => {
          const responseTokens = estimateTokens(fullResponse);

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            const oldTokenCount = lastMessage.tokenCount || 0;

            // Update the last message
            const updatedMessages = [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: fullResponse,
                tokenCount: responseTokens,
              },
            ];

            // Also update the token count
            setTotalTokens((tokenState) => ({
              ...tokenState,
              [selectedProvider]:
                tokenState[selectedProvider] - oldTokenCount + responseTokens,
            }));

            return updatedMessages;
          });
        }
      );
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
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Token usage display */}
      <TokenUsageDisplay totalTokens={totalTokens} />

      {/* Messages container */}
      <div className="flex-1 overflow-auto py-4 px-4 md:px-8 lg:px-16 xl:px-32">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />
    </div>
  );
}
