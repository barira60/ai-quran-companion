import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createGeminiProvider(apiKey: string) {
  // Use OpenAI-compatible endpoint — works with both AIzaSy and AQ. key formats
  return createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey,
  });
}

export function createOpenAIProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "openai",
    baseURL: "https://api.openai.com/v1",
    apiKey,
  });
}
