import { getChatModel, getEmbeddingModel, getBestAvailableProvider, getAvailableProviders } from '@/lib/ai/providers';
import { generateText } from 'ai';

// Test script to verify Gemini integration
async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini Integration...\n');

  try {
    // Check available providers
    console.log('📋 Available providers:', getAvailableProviders());
    
    // Get best available provider
    const bestProvider = getBestAvailableProvider();
    console.log('🏆 Best available provider:', bestProvider);
    
    // Test chat model
    const chatModel = getChatModel('gemini');
    console.log('💬 Chat model:', chatModel);
    
    // Test embedding model
    const embeddingModel = getEmbeddingModel('gemini');
    console.log('🔍 Embedding model:', embeddingModel);
    
    // Test simple text generation
    console.log('\n🤖 Testing text generation...');
    const result = await generateText({
      model: chatModel,
      prompt: 'Hello! Please respond with a simple greeting.',
    });
    
    console.log('✅ Gemini response:', result.text);
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in other files
export { testGeminiIntegration };

// Run test if this file is executed directly
if (require.main === module) {
  testGeminiIntegration();
}
