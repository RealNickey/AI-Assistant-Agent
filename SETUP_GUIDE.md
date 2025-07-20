# 🤖 Gemini SDK Integration Guide

## Overview
Your AI Assistant Agent now supports multiple AI providers with intelligent fallback and provider selection. This integration includes both **OpenAI GPT-4** and **Google Gemini** with seamless switching capabilities.

## 🚀 Quick Setup

### 1. Install Dependencies
The required packages have already been installed:
```bash
npm install @ai-sdk/google @ai-sdk/openai
```

### 2. Configure Environment Variables
Add your API keys to your `.env` file:

```env
# Required: Database connection
DATABASE_URL=your_postgres_connection_string

# Optional: OpenAI API Key (recommended)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Google AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here

# Optional: Authentication (if using Clerk)
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

### 3. Get Your API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

#### Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated key

## 🧪 Testing Your Setup

### Method 1: Command Line Test
Run the comprehensive test suite:
```bash
node test-integration.js
```

### Method 2: Web Interface
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/test`

3. Use the Provider Test Suite to verify your setup

### Method 3: API Endpoint Testing
Test providers directly via API:

```bash
# Test all providers
curl "http://localhost:3000/api/test-providers?test=simple"

# Test specific provider
curl "http://localhost:3000/api/test-providers?test=simple&provider=google"

# Get provider information
curl "http://localhost:3000/api/test-providers?test=info"
```

## 🎯 Features

### Multi-Provider Support
- **Primary Provider**: Automatically selected based on availability
- **Fallback System**: Seamless switching if primary provider fails
- **Task-Specific Routing**: Different providers for different tasks
  - Chat: Best available provider
  - Analysis: Prefers Gemini (larger context window)
  - Embeddings: Best available embedding model

### Smart Provider Selection
- **Auto Mode**: System selects the best provider automatically
- **Manual Selection**: Users can choose their preferred provider
- **Health Monitoring**: Real-time provider availability checking
- **Error Recovery**: Automatic failover on provider errors

### Enhanced Error Handling
- Graceful degradation when providers are unavailable
- Detailed error messages for troubleshooting
- Rate limit aware with intelligent retry logic
- Connection pooling and timeout management

## 🎮 Using the Integration

### Basic Chat Usage
The chat interface now includes a provider selector:
1. Choose "Auto" for automatic provider selection
2. Choose "OpenAI" to force OpenAI GPT-4
3. Choose "Google" to force Google Gemini

### Provider Information Tool
Ask the AI about provider status:
```
"What providers are available?"
"Which AI model are you using?"
"Show me provider details"
```

### Programmatic Usage
```typescript
import { getTextModel, getProviderForTask } from "@/lib/ai/providers";

// Get the best model for chat
const chatModel = getTextModel();

// Get the best model for analysis
const analysisProvider = getProviderForTask('analysis');

// Get embedding model
const embeddingProvider = getProviderForTask('embedding');
```

## 🔧 Configuration Options

### Provider Priority
Providers are prioritized as follows:
1. **OpenAI GPT-4** (Priority 1) - Primary choice
2. **Google Gemini** (Priority 2) - Fallback with larger context

### Model Configuration
- **OpenAI**: GPT-4 Turbo (4K tokens, high quality)
- **Google**: Gemini 1.5 Pro (8K tokens, large context)
- **Embeddings**: text-embedding-ada-002 (OpenAI) or text-embedding-004 (Google)

### Task-Specific Routing
- **Chat Tasks**: Use primary provider
- **Analysis Tasks**: Prefer Gemini for larger context
- **Embedding Tasks**: Use best available embedding model

## 🚨 Troubleshooting

### Common Issues

#### "No providers available"
- **Cause**: No API keys configured
- **Solution**: Add at least one API key to your `.env` file

#### "Provider not available - check API key"
- **Cause**: Invalid or expired API key
- **Solution**: Verify your API key is correct and has credit

#### "Quota exceeded or rate limited"
- **Cause**: API usage limits reached
- **Solution**: Check your API account usage and upgrade if needed

#### "Network connectivity issue"
- **Cause**: Network or firewall blocking API requests
- **Solution**: Check internet connection and firewall settings

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and provider selection logs.

### Health Monitoring
Use the `/api/test-providers` endpoint to monitor provider health in production.

## 🎯 Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables for all keys
- Rotate keys regularly
- Monitor usage and set spending limits

### Provider Selection
- Use "Auto" mode for best performance
- Use specific providers for testing
- Monitor provider response times
- Set up alerts for provider failures

### Performance Optimization
- Enable connection pooling
- Use appropriate timeouts
- Implement caching for embeddings
- Monitor token usage

## 🔄 Migration Notes

### From Single Provider
If upgrading from a single-provider setup:
1. Your existing OpenAI integration will continue working
2. Add Google AI key to enable multi-provider features
3. No code changes required - everything is backward compatible

### Environment Variables
- `OPENAI_API_KEY` - Still required for OpenAI access
- `GOOGLE_GENERATIVE_AI_API_KEY` - New variable for Google AI

## 📊 Monitoring

### Provider Health
- Use the test suite regularly
- Monitor API usage in provider dashboards
- Set up alerts for high error rates
- Track response times and performance

### Usage Analytics
- Monitor token consumption
- Track provider selection patterns
- Analyze error rates by provider
- Review cost optimization opportunities

---

## 🎉 You're All Set!

Your AI Assistant Agent now has enterprise-grade multi-provider support with:
- ✅ Automatic provider selection and fallback
- ✅ Real-time provider health monitoring  
- ✅ Comprehensive error handling and recovery
- ✅ User-friendly provider selection interface
- ✅ Detailed testing and debugging tools

Start by configuring your API keys and running the test suite to ensure everything is working correctly!
