import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { env } from "../env.mjs";

// Model configurations
export const models = {
  openai: {
    chat: openai("gpt-4o"),
    embedding: openai.embedding("text-embedding-ada-002"),
  },
  gemini: {
    chat: google("gemini-1.5-pro-latest"),
    embedding: google.textEmbedding("text-embedding-004"),
  },
} as const;

// Default model configuration
export const defaultModel = "gemini"; // Change this to switch default provider

// Get the current chat model
export const getChatModel = (provider: "openai" | "gemini" = defaultModel) => {
  return models[provider].chat;
};

// Get the current embedding model
export const getEmbeddingModel = (provider: "openai" | "gemini" = defaultModel) => {
  return models[provider].embedding;
};

// Check if API keys are available
export const getAvailableProviders = () => {
  const providers: Array<"openai" | "gemini"> = [];
  
  if (env.OPENAI_API_KEY) {
    providers.push("openai");
  }
  
  if (env.GOOGLE_GENERATIVE_AI_API_KEY) {
    providers.push("gemini");
  }
  
  return providers;
};

// Get the best available provider
export const getBestAvailableProvider = (): "openai" | "gemini" => {
  const available = getAvailableProviders();
  
  if (available.length === 0) {
    throw new Error("No AI providers available. Please check your API keys in environment variables.");
  }
  
  // Prefer Gemini if available, otherwise use OpenAI
  return available.includes("gemini") ? "gemini" : "openai";
};
