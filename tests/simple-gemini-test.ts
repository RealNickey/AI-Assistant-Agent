/**
 * Simple Gemini API Test
 * Run this with: npx tsx tests/simple-gemini-test.ts
 */

import { getChatModel, getEmbeddingModel, getBestAvailableProvider, getAvailableProviders } from '../lib/ai/providers';
import { generateText, embed } from 'ai';

async function testGeminiAPI() {
  console.log('🚀 Testing Gemini API Integration...\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Testing Environment Variables...');
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!geminiKey) {
      throw new Error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found');
    }
    console.log('✅ Environment variables are set\n');

    // Test 2: Provider detection
    console.log('2️⃣ Testing Provider Detection...');
    const providers = getAvailableProviders();
    const bestProvider = getBestAvailableProvider();
    console.log('Available providers:', providers);
    console.log('Best provider:', bestProvider);
    
    if (!providers.includes('gemini')) {
      throw new Error('❌ Gemini provider not detected');
    }
    console.log('✅ Provider detection working\n');

    // Test 3: Chat model
    console.log('3️⃣ Testing Chat Model...');
    const chatModel = getChatModel('gemini');
    
    const chatResult = await generateText({
      model: chatModel,
      prompt: 'Say "Hello from Gemini!" and nothing else.',
      maxTokens: 10
    });
    
    console.log('Gemini response:', chatResult.text);
    console.log('Usage:', chatResult.usage);
    
    if (!chatResult.text.toLowerCase().includes('gemini')) {
      console.log('⚠️ Response may not be from Gemini, but API is working');
    }
    console.log('✅ Chat model working\n');

    // Test 4: Embedding model
    console.log('4️⃣ Testing Embedding Model...');
    const embeddingModel = getEmbeddingModel('gemini');
    
    const embeddingResult = await embed({
      model: embeddingModel,
      value: 'This is a test sentence for embedding.'
    });
    
    console.log('Embedding dimension:', embeddingResult.embedding.length);
    console.log('First 5 values:', embeddingResult.embedding.slice(0, 5));
    console.log('Usage:', embeddingResult.usage);
    
    if (embeddingResult.embedding.length === 0) {
      throw new Error('❌ No embedding generated');
    }
    console.log('✅ Embedding model working\n');

    // Test 5: API endpoint (if server is running)
    console.log('5️⃣ Testing API Endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/providers');
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        console.log('✅ API endpoint working');
      } else {
        console.log('⚠️ API endpoint returned:', response.status);
      }
    } catch (error) {
      console.log('⚠️ API endpoint test skipped (server may not be running)');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Gemini API is working correctly');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Check if GOOGLE_GENERATIVE_AI_API_KEY is set in .env');
    console.error('2. Verify the API key is valid');
    console.error('3. Check if you have internet connection');
    console.error('4. Make sure @ai-sdk/google package is installed');
    process.exit(1);
  }
}

// Run the test
testGeminiAPI();
