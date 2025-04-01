import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { formatConversationForAI } from "../utils/chatUtils";
import { Message } from "../types";

// Initialize AI providers
export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY || "", // Use environment variable
});

export const groq = createGroq({
  apiKey: import.meta.env.VITE_REACT_APP_GROQ_API_KEY || "", // Use environment variable
});

export const generateAIResponse = async (
  messages: Message[],
  provider: "google" | "groq",
  onChunk: (chunk: string) => void
) => {
  const conversationPrompt = formatConversationForAI(messages);

  if (provider === "google") {
    // Stream text using Google with conversation history
    const { textStream } = await streamText({
      model: google("gemini-2.0-flash"),
      prompt: conversationPrompt,
    });

    // Process stream
    let fullResponse = "";
    for await (const chunk of textStream) {
      fullResponse += chunk;
      onChunk(fullResponse);
    }

    return fullResponse;
  } else {
    // Stream text using Groq with conversation history
    const { textStream } = await streamText({
      model: groq("deepseek-r1-distill-llama-70b"),
      prompt: conversationPrompt,
    });

    // Process stream
    let fullResponse = "";
    for await (const chunk of textStream) {
      fullResponse += chunk;
      onChunk(fullResponse);
    }

    return fullResponse;
  }
};
