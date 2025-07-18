/**
 * Direct Gemini API Test
 * This tests the Gemini API directly without depending on the project structure
 */

import { google } from '@ai-sdk/google';
import { generateText, embed } from 'ai';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

async function testGeminiDirect() {
  console.log('🧪 Direct Gemini API Test\n');

  try {
    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not found in environment');
    }
    
    console.log('✅ API key found:', apiKey.substring(0, 10) + '...');

    // Test 1: Simple text generation
    console.log('\n1️⃣ Testing Text Generation...');
    const chatModel = google('gemini-1.5-pro-latest');
    
    const result = await generateText({
      model: chatModel,
      prompt: 'Respond with exactly: "Gemini API test successful"',
      maxTokens: 20
    });
    
    console.log('Response:', result.text);
    console.log('Finish reason:', result.finishReason);
    console.log('Usage:', result.usage);
    
    if (!result.text) {
      throw new Error('No response generated');
    }
    
    console.log('✅ Text generation successful');

    // Test 2: Embedding generation
    console.log('\n2️⃣ Testing Embedding Generation...');
    const embeddingModel = google.textEmbedding('text-embedding-004');
    
    const embeddingResult = await embed({
      model: embeddingModel,
      value: 'Test embedding with Gemini'
    });
    
    console.log('Embedding dimension:', embeddingResult.embedding.length);
    console.log('First 3 values:', embeddingResult.embedding.slice(0, 3));
    console.log('Usage:', embeddingResult.usage);
    
    if (embeddingResult.embedding.length === 0) {
      throw new Error('No embedding generated');
    }
    
    console.log('✅ Embedding generation successful');

    // Test 3: Test with longer prompt
    console.log('\n3️⃣ Testing Complex Prompt...');
    const complexResult = await generateText({
      model: chatModel,
      prompt: `You are a helpful AI assistant. Please analyze this scenario:
      A user wants to integrate Gemini API into their Next.js application.
      What are the key steps they should follow?
      Keep your response concise (2-3 sentences).`,
      maxTokens: 100
    });
    
    console.log('Complex response:', complexResult.text);
    console.log('✅ Complex prompt successful');

    console.log('\n🎉 All Gemini API tests passed!');
    console.log('✅ Your Gemini integration is working correctly');
    
    return {
      success: true,
      chatModel: 'gemini-1.5-pro-latest',
      embeddingModel: 'text-embedding-004',
      textResponse: result.text,
      embeddingDimension: embeddingResult.embedding.length
    };
    
  } catch (error) {
    console.error('\n❌ Gemini API test failed:');
    console.error(error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('\n💡 Solution: Check your GOOGLE_GENERATIVE_AI_API_KEY');
      } else if (error.message.includes('quota')) {
        console.error('\n💡 Solution: Check your API quota limits');
      } else if (error.message.includes('permission')) {
        console.error('\n💡 Solution: Verify API key permissions');
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Export for use in other files
export { testGeminiDirect };

// Run if executed directly (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
  testGeminiDirect().then(result => {
    console.log('\n📊 Test Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
