#!/usr/bin/env node

/**
 * Comprehensive Gemini API Test Suite
 * This script tests all aspects of the Gemini integration
 */

import { getChatModel, getEmbeddingModel, getBestAvailableProvider, getAvailableProviders } from '../lib/ai/providers.js';
import { generateText, generateObject, embed, embedMany } from 'ai';
import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

class GeminiTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, status = 'info') {
    const timestamp = new Date().toISOString();
    const statusEmoji = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      start: '🚀'
    };
    
    console.log(`${statusEmoji[status]} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFunction) {
    this.log(`Running test: ${testName}`, 'start');
    
    try {
      const result = await testFunction();
      this.log(`✅ ${testName} - PASSED`, 'success');
      this.results.push({ name: testName, status: 'PASSED', result });
      this.passed++;
    } catch (error) {
      this.log(`❌ ${testName} - FAILED: ${error.message}`, 'error');
      this.results.push({ name: testName, status: 'FAILED', error: error.message });
      this.failed++;
    }
  }

  async testEnvironmentVariables() {
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!geminiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables');
    }
    
    if (geminiKey.length < 10) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY appears to be invalid (too short)');
    }
    
    return {
      geminiKey: geminiKey ? `${geminiKey.substring(0, 10)}...` : 'Not set',
      openaiKey: openaiKey ? `${openaiKey.substring(0, 10)}...` : 'Not set'
    };
  }

  async testProviderDetection() {
    const providers = getAvailableProviders();
    const bestProvider = getBestAvailableProvider();
    
    if (!providers.includes('gemini')) {
      throw new Error('Gemini provider not detected');
    }
    
    return {
      availableProviders: providers,
      bestProvider: bestProvider
    };
  }

  async testChatModel() {
    const model = getChatModel('gemini');
    
    const result = await generateText({
      model: model,
      prompt: 'Hello! Please respond with exactly: "Gemini API is working correctly"',
      maxTokens: 20
    });
    
    if (!result.text.includes('Gemini')) {
      throw new Error(`Unexpected response: ${result.text}`);
    }
    
    return {
      response: result.text,
      finishReason: result.finishReason,
      usage: result.usage
    };
  }

  async testEmbeddingModel() {
    const model = getEmbeddingModel('gemini');
    
    const result = await embed({
      model: model,
      value: 'This is a test sentence for embedding generation.'
    });
    
    if (!result.embedding || result.embedding.length === 0) {
      throw new Error('No embedding generated');
    }
    
    if (result.embedding.length < 100) {
      throw new Error('Embedding dimension seems too small');
    }
    
    return {
      embeddingDimension: result.embedding.length,
      firstFewValues: result.embedding.slice(0, 5),
      usage: result.usage
    };
  }

  async testMultipleEmbeddings() {
    const model = getEmbeddingModel('gemini');
    
    const testTexts = [
      'Hello world',
      'Artificial intelligence is fascinating',
      'The weather is nice today'
    ];
    
    const result = await embedMany({
      model: model,
      values: testTexts
    });
    
    if (!result.embeddings || result.embeddings.length !== testTexts.length) {
      throw new Error('Incorrect number of embeddings generated');
    }
    
    return {
      inputCount: testTexts.length,
      outputCount: result.embeddings.length,
      dimensions: result.embeddings[0].length,
      usage: result.usage
    };
  }

  async testStructuredOutput() {
    const model = getChatModel('gemini');
    
    const result = await generateObject({
      model: model,
      schema: z.object({
        status: z.string(),
        timestamp: z.string(),
        features: z.array(z.string())
      }),
      prompt: 'Generate a JSON object with status="working", current timestamp, and a list of 3 AI features'
    });
    
    if (!result.object || !result.object.status) {
      throw new Error('Failed to generate structured output');
    }
    
    return {
      generatedObject: result.object,
      usage: result.usage
    };
  }

  async testErrorHandling() {
    const model = getChatModel('gemini');
    
    try {
      // Test with invalid parameters
      await generateText({
        model: model,
        prompt: 'Test',
        maxTokens: -1 // Invalid parameter
      });
      
      throw new Error('Should have thrown an error with invalid parameters');
    } catch (error) {
      if (error.message.includes('Should have thrown')) {
        throw error;
      }
      
      // Expected error - this is good
      return {
        errorHandled: true,
        errorMessage: error.message
      };
    }
  }

  async testApiEndpoint() {
    try {
      const response = await fetch('http://localhost:3000/api/providers');
      
      if (!response.ok) {
        throw new Error(`API endpoint returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.providers || !Array.isArray(data.providers)) {
        throw new Error('Invalid response format from providers endpoint');
      }
      
      return {
        statusCode: response.status,
        providers: data.providers
      };
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Could not connect to localhost:3000. Make sure the dev server is running.');
      }
      throw error;
    }
  }

  async runAllTests() {
    this.log('🧪 Starting Gemini API Test Suite', 'start');
    this.log('=' * 50, 'info');
    
    await this.runTest('Environment Variables', () => this.testEnvironmentVariables());
    await this.runTest('Provider Detection', () => this.testProviderDetection());
    await this.runTest('Chat Model', () => this.testChatModel());
    await this.runTest('Embedding Model', () => this.testEmbeddingModel());
    await this.runTest('Multiple Embeddings', () => this.testMultipleEmbeddings());
    await this.runTest('Structured Output', () => this.testStructuredOutput());
    await this.runTest('Error Handling', () => this.testErrorHandling());
    await this.runTest('API Endpoint', () => this.testApiEndpoint());
    
    this.printSummary();
  }

  printSummary() {
    this.log('=' * 50, 'info');
    this.log('🎯 Test Results Summary', 'start');
    this.log('=' * 50, 'info');
    
    this.results.forEach(result => {
      const status = result.status === 'PASSED' ? 'success' : 'error';
      this.log(`${result.name}: ${result.status}`, status);
      
      if (result.status === 'FAILED') {
        this.log(`  Error: ${result.error}`, 'error');
      }
    });
    
    this.log('=' * 50, 'info');
    this.log(`📊 Total Tests: ${this.results.length}`, 'info');
    this.log(`✅ Passed: ${this.passed}`, 'success');
    this.log(`❌ Failed: ${this.failed}`, 'error');
    this.log(`📈 Success Rate: ${((this.passed / this.results.length) * 100).toFixed(1)}%`, 'info');
    
    if (this.failed === 0) {
      this.log('🎉 All tests passed! Gemini API is working correctly.', 'success');
    } else {
      this.log('⚠️ Some tests failed. Please check the configuration.', 'warning');
    }
  }
}

// Run the tests
const tester = new GeminiTester();
tester.runAllTests().catch(console.error);
