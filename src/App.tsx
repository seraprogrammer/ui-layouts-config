import { useState, FormEvent, useRef, useEffect } from "react";
import { Message, TokenUsage, Conversation } from "./types";
import {
  estimateTokens,
  saveConversationToStorage,
  loadConversationFromStorage,
  generateId,
  getAllConversations,
} from "./utils/chatUtils";
import { generateAIResponse } from "./services/aiService";
import TokenUsageDisplay from "./components/TokenUsageDisplay";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";

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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load all conversations and set current conversation on initial render
  useEffect(() => {
    const allConversations = getAllConversations();
    setConversations(allConversations);

    // If there are no conversations, create a new one
    if (allConversations.length === 0) {
      createNewConversation();
    } else {
      // Get the last used conversation ID from localStorage or use the first one
      const lastUsedId = localStorage.getItem("chat_current_conversation_id");
      const validConversationId =
        lastUsedId && allConversations.some((c) => c.id === lastUsedId)
          ? lastUsedId
          : allConversations[0].id;

      setCurrentConversationId(validConversationId);
      localStorage.setItem("chat_current_conversation_id", validConversationId);

      // Load messages for the current conversation
      const savedMessages = loadConversationFromStorage(validConversationId);
      setMessages(savedMessages);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Save conversation to localStorage whenever messages change
    if (messages.length > 0 && currentConversationId) {
      saveConversationToStorage(currentConversationId, messages);

      // Update conversation title if it's "New conversation" and we have messages
      if (messages.length > 0) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) => {
            if (
              conv.id === currentConversationId &&
              conv.title === "New conversation"
            ) {
              // Use first few words of first user message as title
              const firstUserMessage = messages.find((m) => m.role === "user");
              const newTitle = firstUserMessage
                ? firstUserMessage.content.split(" ").slice(0, 4).join(" ") +
                  "..."
                : "New conversation";
              return { ...conv, title: newTitle };
            }
            return conv;
          })
        );
      }
    }
  }, [messages, currentConversationId]);

  const createNewConversation = () => {
    const newConversationId = "conversation-" + generateId();
    const newConversation: Conversation = {
      id: newConversationId,
      title: "New conversation",
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversationId);
    setMessages([]);
    localStorage.setItem("chat_current_conversation_id", newConversationId);
  };

  const switchConversation = (conversationId: string) => {
    if (currentConversationId === conversationId) return;

    setCurrentConversationId(conversationId);
    localStorage.setItem("chat_current_conversation_id", conversationId);

    const savedMessages = loadConversationFromStorage(conversationId);
    setMessages(savedMessages);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const deleteConversation = (conversationId: string) => {
    // Remove conversation from state
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId)
    );

    // Remove conversation data from localStorage
    localStorage.removeItem(conversationId);
    localStorage.removeItem(`${conversationId}-messages`);

    // If we're deleting the current conversation, switch to another one
    if (currentConversationId === conversationId) {
      // Get remaining conversations
      const remainingConversations = conversations.filter(
        (conv) => conv.id !== conversationId
      );

      if (remainingConversations.length > 0) {
        // Switch to the first remaining conversation
        const newConversationId = remainingConversations[0].id;
        switchConversation(newConversationId);
      } else {
        // If no conversations left, create a new one
        createNewConversation();
      }
    }
  };

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
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        createNewConversation={createNewConversation}
        switchConversation={switchConversation}
        deleteConversation={deleteConversation}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Token usage display */}
        <TokenUsageDisplay totalTokens={totalTokens} />

        {/* Messages container */}
        <div className="flex-1 overflow-auto py-4 px-4 md:px-8 lg:px-16 xl:px-32">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden mb-4 p-2 bg-gray-800 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

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
    </div>
  );
}
