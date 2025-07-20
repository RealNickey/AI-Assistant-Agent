// Comprehensive Test Cases for AI Provider Integration
// Run with: node test-integration.js

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

console.log("🧪 Starting AI Provider Integration Tests...\n");

// Test configuration
const TEST_PROMPT = "What is 2+2? Respond with just the number.";
const TIMEOUT_MS = 10000; // 10 seconds

// Mock environment for testing (replace with real keys to test)
const TEST_CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "test-key-placeholder",
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "test-key-placeholder"
};

// Test Results Tracker
const testResults = {
  openai: { status: 'pending', time: 0, error: null, response: null },
  google: { status: 'pending', time: 0, error: null, response: null }
};

/**
 * Test OpenAI Provider
 */
async function testOpenAI() {
  console.log("🔵 Testing OpenAI GPT-4...");
  const startTime = Date.now();
  
  try {
    if (!TEST_CONFIG.OPENAI_API_KEY || TEST_CONFIG.OPENAI_API_KEY === "test-key-placeholder") {
      throw new Error("OpenAI API key not configured");
    }

    const response = await generateText({
      model: openai("gpt-4o"),
      prompt: TEST_PROMPT,
      maxTokens: 50
    });

    testResults.openai = {
      status: 'success',
      time: Date.now() - startTime,
      error: null,
      response: response.text.trim()
    };
    
    console.log(`✅ OpenAI Success (${testResults.openai.time}ms): ${testResults.openai.response}`);
    
  } catch (error) {
    testResults.openai = {
      status: 'failed',
      time: Date.now() - startTime,
      error: error.message,
      response: null
    };
    
    console.log(`❌ OpenAI Failed (${testResults.openai.time}ms): ${error.message}`);
  }
}

/**
 * Test Google Gemini Provider
 */
async function testGoogleGemini() {
  console.log("🟢 Testing Google Gemini...");
  const startTime = Date.now();
  
  try {
    if (!TEST_CONFIG.GOOGLE_GENERATIVE_AI_API_KEY || TEST_CONFIG.GOOGLE_GENERATIVE_AI_API_KEY === "test-key-placeholder") {
      throw new Error("Google AI API key not configured");
    }

    const response = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: TEST_PROMPT,
      maxTokens: 50
    });

    testResults.google = {
      status: 'success',
      time: Date.now() - startTime,
      error: null,
      response: response.text.trim()
    };
    
    console.log(`✅ Google Success (${testResults.google.time}ms): ${testResults.google.response}`);
    
  } catch (error) {
    testResults.google = {
      status: 'failed',
      time: Date.now() - startTime,
      error: error.message,
      response: null
    };
    
    console.log(`❌ Google Failed (${testResults.google.time}ms): ${error.message}`);
  }
}

/**
 * Test Provider Availability
 */
function testProviderAvailability() {
  console.log("\n📋 Provider Availability Check:");
  
  const openaiAvailable = TEST_CONFIG.OPENAI_API_KEY && TEST_CONFIG.OPENAI_API_KEY !== "test-key-placeholder";
  const googleAvailable = TEST_CONFIG.GOOGLE_GENERATIVE_AI_API_KEY && TEST_CONFIG.GOOGLE_GENERATIVE_AI_API_KEY !== "test-key-placeholder";
  
  console.log(`OpenAI: ${openaiAvailable ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`Google: ${googleAvailable ? '✅ Configured' : '❌ Not configured'}`);
  
  return { openaiAvailable, googleAvailable };
}

/**
 * Generate Test Report
 */
function generateReport() {
  console.log("\n📊 Test Report:");
  console.log("================");
  
  const openaiResult = testResults.openai;
  const googleResult = testResults.google;
  
  console.log(`\n🔵 OpenAI GPT-4:`);
  console.log(`   Status: ${openaiResult.status}`);
  console.log(`   Time: ${openaiResult.time}ms`);
  console.log(`   Response: ${openaiResult.response || 'N/A'}`);
  if (openaiResult.error) console.log(`   Error: ${openaiResult.error}`);
  
  console.log(`\n🟢 Google Gemini:`);
  console.log(`   Status: ${googleResult.status}`);
  console.log(`   Time: ${googleResult.time}ms`);
  console.log(`   Response: ${googleResult.response || 'N/A'}`);
  if (googleResult.error) console.log(`   Error: ${googleResult.error}`);
  
  // Summary
  const successCount = [openaiResult.status, googleResult.status].filter(s => s === 'success').length;
  const totalTests = 2;
  
  console.log(`\n🎯 Summary: ${successCount}/${totalTests} tests passed`);
  
  if (successCount === 0) {
    console.log("\n⚠️  No providers are working. Please check your API keys:");
    console.log("   - Set OPENAI_API_KEY environment variable");
    console.log("   - Set GOOGLE_GENERATIVE_AI_API_KEY environment variable");
  } else if (successCount === 1) {
    console.log("\n✅ At least one provider is working! The system will use the working provider.");
  } else {
    console.log("\n🚀 All providers are working! You have full multi-provider support.");
  }
}

/**
 * Run All Tests
 */
async function runTests() {
  try {
    // Check availability
    const availability = testProviderAvailability();
    
    // Run tests in parallel for speed
    const testPromises = [];
    
    if (availability.openaiAvailable) {
      testPromises.push(testOpenAI());
    } else {
      console.log("⏭️  Skipping OpenAI test - API key not configured");
    }
    
    if (availability.googleAvailable) {
      testPromises.push(testGoogleGemini());
    } else {
      console.log("⏭️  Skipping Google test - API key not configured");
    }
    
    if (testPromises.length === 0) {
      console.log("\n❌ No tests to run - no API keys configured");
      return;
    }
    
    console.log("\n🏃‍♂️ Running tests...\n");
    
    // Wait for all tests to complete
    await Promise.all(testPromises);
    
    // Generate final report
    generateReport();
    
  } catch (error) {
    console.error("\n� Test runner error:", error.message);
  }
}

// Quick Integration Test
console.log("✅ SDK imports successful");
console.log("✅ Test configuration loaded");

// Run the tests
runTests().then(() => {
  console.log("\n🏁 Test suite completed!\n");
}).catch((error) => {
  console.error("💥 Test suite failed:", error.message);
});
