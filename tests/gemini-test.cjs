const { google } = require('@ai-sdk/google');
const { generateText, embed } = require('ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...\n');

  try {
    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found in .env file');
    }
    
    console.log('✅ API key found:', apiKey.substring(0, 10) + '...');

    // Test 1: Simple text generation
    console.log('\n1️⃣ Testing Text Generation...');
    const chatModel = google('gemini-1.5-pro-latest');
    
    const result = await generateText({
      model: chatModel,
      prompt: 'Say exactly: "Gemini API is working!"',
      maxTokens: 20
    });
    
    console.log('✅ Response:', result.text);
    console.log('✅ Usage:', result.usage);
    
    if (!result.text) {
      throw new Error('❌ No response generated');
    }

    // Test 2: Embedding generation
    console.log('\n2️⃣ Testing Embedding Generation...');
    const embeddingModel = google.textEmbedding('text-embedding-004');
    
    const embeddingResult = await embed({
      model: embeddingModel,
      value: 'Test embedding with Gemini API'
    });
    
    console.log('✅ Embedding dimension:', embeddingResult.embedding.length);
    console.log('✅ First 3 values:', embeddingResult.embedding.slice(0, 3));
    
    if (embeddingResult.embedding.length === 0) {
      throw new Error('❌ No embedding generated');
    }

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Gemini API is working correctly');
    console.log('✅ Text generation: OK');
    console.log('✅ Embedding generation: OK');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if GOOGLE_GENERATIVE_AI_API_KEY is set in .env');
    console.error('2. Verify API key is valid');
    console.error('3. Check internet connection');
    console.error('4. Ensure @ai-sdk/google package is installed');
    return false;
  }
}

// Run the test
testGeminiAPI().then(success => {
  process.exit(success ? 0 : 1);
});
