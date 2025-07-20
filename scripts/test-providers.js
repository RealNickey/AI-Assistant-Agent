/**
 * Provider Test CLI Script
 * 
 * This script helps test AI providers without running the full application
 * Usage: 
 *  npm run test:providers [provider] (openai, google, all)
 *  node scripts/test-providers.js [provider]
 */

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import * as dotenv from "dotenv";

// Initialize environment
dotenv.config();

// Configuration
const TARGET_PROVIDER = process.argv[2] || 'all';
const TEST_PROMPT = "Hello, can you respond with a single word: 'Working'";

// ANSI color codes for terminal
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

/**
 * Test OpenAI provider
 */
async function testOpenAI() {
  console.log(`\n${colors.bold}${colors.blue}Testing OpenAI Provider${colors.reset}`);
  
  try {
    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      console.log(`${colors.red}❌ Missing or invalid OPENAI_API_KEY${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.yellow}API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}${colors.reset}`);
    
    // Initialize model
    console.log(`${colors.cyan}Initializing OpenAI model...${colors.reset}`);
    const model = openai("gpt-4o");
    
    // Test chat completion
    console.log(`${colors.cyan}Testing chat completion...${colors.reset}`);
    const completion = await model.chat({
      messages: [{ role: "user", content: TEST_PROMPT }]
    });
    
    console.log(`${colors.green}✅ OpenAI Response: ${completion.content}${colors.reset}`);
    
    // Test embedding
    console.log(`${colors.cyan}Testing embedding...${colors.reset}`);
    const embeddingModel = openai.embedding("text-embedding-ada-002");
    const { embedding } = await embeddingModel.embed({
      value: "This is a test embedding"
    });
    
    console.log(`${colors.green}✅ OpenAI Embedding generated with length: ${embedding.length}${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ OpenAI Test Failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Test Google Gemini provider
 */
async function testGoogle() {
  console.log(`\n${colors.bold}${colors.blue}Testing Google Gemini Provider${colors.reset}`);
  
  try {
    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      console.log(`${colors.red}❌ Missing or invalid GOOGLE_GENERATIVE_AI_API_KEY${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.yellow}API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}${colors.reset}`);
    
    // Initialize model
    console.log(`${colors.cyan}Initializing Google model...${colors.reset}`);
    const model = google("gemini-1.5-pro-latest");
    
    // Test chat completion
    console.log(`${colors.cyan}Testing chat completion...${colors.reset}`);
    const completion = await model.chat({
      messages: [{ role: "user", content: TEST_PROMPT }]
    });
    
    console.log(`${colors.green}✅ Google Response: ${completion.content}${colors.reset}`);
    
    // Test embedding
    console.log(`${colors.cyan}Testing embedding...${colors.reset}`);
    const embeddingModel = google.embedding("text-embedding-004");
    const { embedding } = await embeddingModel.embed({
      value: "This is a test embedding"
    });
    
    console.log(`${colors.green}✅ Google Embedding generated with length: ${embedding.length}${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Google Test Failed: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Main function to run tests
 */
async function main() {
  console.log(`${colors.bold}${colors.white}AI Provider Test Script${colors.reset}`);
  console.log(`Target provider: ${TARGET_PROVIDER}`);
  
  let openaiSuccess = false;
  let googleSuccess = false;
  
  if (TARGET_PROVIDER === 'all' || TARGET_PROVIDER === 'openai') {
    openaiSuccess = await testOpenAI();
  }
  
  if (TARGET_PROVIDER === 'all' || TARGET_PROVIDER === 'google') {
    googleSuccess = await testGoogle();
  }
  
  // Print summary
  console.log(`\n${colors.bold}${colors.white}Test Results:${colors.reset}`);
  
  if (TARGET_PROVIDER === 'all' || TARGET_PROVIDER === 'openai') {
    console.log(`OpenAI: ${openaiSuccess ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  }
  
  if (TARGET_PROVIDER === 'all' || TARGET_PROVIDER === 'google') {
    console.log(`Google: ${googleSuccess ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  }
  
  // Provide recommendation
  if (TARGET_PROVIDER === 'all') {
    if (openaiSuccess && !googleSuccess) {
      console.log(`${colors.yellow}Recommendation: Use OpenAI as your provider${colors.reset}`);
    } else if (!openaiSuccess && googleSuccess) {
      console.log(`${colors.yellow}Recommendation: Use Google as your provider${colors.reset}`);
    } else if (openaiSuccess && googleSuccess) {
      console.log(`${colors.green}All providers working! Multi-provider setup is ready.${colors.reset}`);
    } else {
      console.log(`${colors.red}All providers failed. Check your API keys and network connection.${colors.reset}`);
    }
  }
}

// Run the script
main().catch(err => {
  console.error(`${colors.red}Fatal error: ${err.message}${colors.reset}`);
  process.exit(1);
});
