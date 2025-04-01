// Define message type
export interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: "google" | "groq";
  tokenCount?: number;
}

// Define conversation history type
export interface ConversationHistory {
  [conversationId: string]: Message[];
}

export interface TokenUsage {
  google: number;
  groq: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}
