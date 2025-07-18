const { google } = require('@ai-sdk/google');
require('dotenv').config();

function testGeminiSetup() {
  console.log('🔍 Testing Gemini Setup (No API Calls)...\n');

  try {
    // Check API key existence
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found in .env file');
      return false;
    }
    
    console.log('✅ API key found:', apiKey.substring(0, 10) + '...');
    
    // Check API key format
    if (!apiKey.startsWith('AIza')) {
      console.error('❌ API key format looks incorrect (should start with "AIza")');
      return false;
    }
    
    console.log('✅ API key format looks correct');
    
    // Test model initialization (doesn't make API calls)
    try {
      const chatModel = google('gemini-1.5-pro-latest');
      console.log('✅ Chat model initialized successfully');
      
      const embeddingModel = google.textEmbedding('text-embedding-004');
      console.log('✅ Embedding model initialized successfully');
      
    } catch (error) {
      console.error('❌ Model initialization failed:', error.message);
      return false;
    }

    console.log('\n🎉 SETUP VALIDATION PASSED!');
    console.log('✅ Environment variables: OK');
    console.log('✅ API key format: OK');
    console.log('✅ Model initialization: OK');
    console.log('✅ Package installation: OK');
    
    console.log('\n📝 Note: To test actual API calls, you need sufficient quota.');
    console.log('💡 Check your quota at: https://makersuite.google.com/app/apikey');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Setup validation failed:', error.message);
    return false;
  }
}

// Run the test
const success = testGeminiSetup();
process.exit(success ? 0 : 1);
