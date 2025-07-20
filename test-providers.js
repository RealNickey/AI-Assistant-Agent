#!/usr/bin/env node

// Quick AI Provider Test
// Usage: node test-providers.js

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

console.log("🧪 AI Provider Quick Test\n");

const TEST_PROMPT = "What is 2+2? Reply with just the number.";
const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;
const hasGoogle = process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.length > 10;

console.log(`OpenAI: ${hasOpenAI ? '✅ Configured' : '❌ Not configured'}`);
console.log(`Google: ${hasGoogle ? '✅ Configured' : '❌ Not configured'}\n`);

if (!hasOpenAI && !hasGoogle) {
  console.log("❌ No API keys configured. Please set:");
  console.log("   - OPENAI_API_KEY for OpenAI access");
  console.log("   - GOOGLE_GENERATIVE_AI_API_KEY for Google AI access\n");
  process.exit(1);
}

// Test OpenAI
if (hasOpenAI) {
  try {
    console.log("🔵 Testing OpenAI...");
    const start = Date.now();
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: TEST_PROMPT,
      maxTokens: 10
    });
    console.log(`✅ OpenAI Success (${Date.now() - start}ms): ${result.text.trim()}`);
  } catch (error) {
    console.log(`❌ OpenAI Failed: ${error.message}`);
  }
}

// Test Google
if (hasGoogle) {
  try {
    console.log("🟢 Testing Google Gemini...");
    const start = Date.now();
    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: TEST_PROMPT,
      maxTokens: 10
    });
    console.log(`✅ Google Success (${Date.now() - start}ms): ${result.text.trim()}`);
  } catch (error) {
    console.log(`❌ Google Failed: ${error.message}`);
  }
}

console.log("\n🎉 Test completed! Your working providers will be used in the application.");
