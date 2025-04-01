import { Message, Conversation } from "../types";

// Simple token estimation function
export const estimateTokens = (text: string): number => {
  // A very rough estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
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

// Get all conversations from localStorage
export function getAllConversations(): Conversation[] {
  // Get all keys from localStorage that start with "conversation-"
  const allKeys = Object.keys(localStorage);
  const conversationIds = allKeys.filter(
    (key) => key.startsWith("conversation-") && !key.includes("messages")
  );

  // Get conversation metadata for each ID
  const conversations: Conversation[] = [];

  for (const id of conversationIds) {
    const messagesKey = `${id}-messages`;
    const messages = JSON.parse(localStorage.getItem(messagesKey) || "[]");

    // Try to get saved conversation metadata
    let conversation: Conversation;
    try {
      conversation = JSON.parse(localStorage.getItem(id) || "");
    } catch {
      // If no metadata exists, create it from the messages
      const firstUserMessage = messages.find((m: Message) => m.role === "user");
      const title = firstUserMessage
        ? firstUserMessage.content.split(" ").slice(0, 4).join(" ") + "..."
        : "New conversation";

      conversation = {
        id,
        title,
        createdAt: new Date().toISOString(),
      };

      // Save the metadata
      localStorage.setItem(id, JSON.stringify(conversation));
    }

    conversations.push(conversation);
  }

  // Sort by creation date (newest first)
  return conversations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Function to save conversation history to localStorage
export const saveConversationToStorage = (
  conversationId: string,
  messages: Message[]
): void => {
  localStorage.setItem(`${conversationId}-messages`, JSON.stringify(messages));

  // Check if conversation metadata exists, create if not
  try {
    JSON.parse(localStorage.getItem(conversationId) || "");
  } catch {
    const firstUserMessage = messages.find((m) => m.role === "user");
    const title = firstUserMessage
      ? firstUserMessage.content.split(" ").slice(0, 4).join(" ") + "..."
      : "New conversation";

    const conversation = {
      id: conversationId,
      title,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(conversationId, JSON.stringify(conversation));
  }
};

// Function to load conversation history from localStorage
export const loadConversationFromStorage = (
  conversationId: string
): Message[] => {
  const messagesKey = `${conversationId}-messages`;
  const savedMessages = localStorage.getItem(messagesKey);
  return savedMessages ? JSON.parse(savedMessages) : [];
};

// Function to delete a conversation from localStorage
export const deleteConversationFromStorage = (conversationId: string): void => {
  // Remove conversation metadata
  localStorage.removeItem(conversationId);

  // Remove conversation messages
  localStorage.removeItem(`${conversationId}-messages`);
};
