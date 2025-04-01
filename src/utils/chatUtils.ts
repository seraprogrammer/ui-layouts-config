import { Message } from "../types";

// Simple token estimation function
export const estimateTokens = (text: string): number => {
  // A very rough estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
};

// Function to save conversation history to localStorage
export const saveConversationToStorage = (
  conversationId: string,
  messages: Message[]
) => {
  try {
    // Get existing conversations or initialize empty object
    const existingConversations = JSON.parse(
      localStorage.getItem("conversations") || "{}"
    );

    // Update with current conversation
    existingConversations[conversationId] = messages;

    // Save back to localStorage
    localStorage.setItem(
      "conversations",
      JSON.stringify(existingConversations)
    );
  } catch (error) {
    console.error("Error saving conversation to localStorage:", error);
  }
};

// Function to load conversation history from localStorage
export const loadConversationFromStorage = (
  conversationId: string
): Message[] => {
  try {
    const conversations = JSON.parse(
      localStorage.getItem("conversations") || "{}"
    );
    return conversations[conversationId] || [];
  } catch (error) {
    console.error("Error loading conversation from localStorage:", error);
    return [];
  }
};

// Function to format messages for AI prompt
export const formatConversationForAI = (messages: Message[]): string => {
  return (
    messages
      .map((msg) => {
        const role = msg.role === "user" ? "User" : "Assistant";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n") + "\n\nAssistant:"
  );
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
