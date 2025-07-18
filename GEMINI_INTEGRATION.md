# Gemini API Integration

This project now supports both Google's Gemini AI and OpenAI's GPT models through the Vercel AI SDK.

## Features

- **Dual Provider Support**: Switch between Gemini and OpenAI models
- **Automatic Provider Detection**: The system automatically detects which AI providers are available based on environment variables
- **Seamless Integration**: All existing functionality works with both providers
- **Provider Selector UI**: Users can switch between providers in the chat interface

## Setup

### Required Environment Variables

```env
# Google Gemini API Key (required)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (optional - for dual provider support)
OPENAI_API_KEY=your_openai_api_key_here
```

### Models Used

- **Gemini**: 
  - Chat: `gemini-1.5-pro-latest`
  - Embeddings: `text-embedding-004`
- **OpenAI**:
  - Chat: `gpt-4o`
  - Embeddings: `text-embedding-ada-002`

## Architecture

### Provider System (`lib/ai/providers.ts`)

The provider system manages model selection and availability:

- `getChatModel(provider)`: Returns the appropriate chat model
- `getEmbeddingModel(provider)`: Returns the appropriate embedding model
- `getBestAvailableProvider()`: Automatically selects the best available provider
- `getAvailableProviders()`: Returns list of available providers

### Chat Integration (`app/(preview)/api/chat/route.ts`)

The chat API now:
- Accepts a `provider` parameter in the request body
- Uses the selected provider for both chat and query understanding
- Automatically falls back to the best available provider if none specified

### Embedding Integration (`lib/ai/embedding.ts`)

The embedding system:
- Automatically uses the best available provider
- Maintains compatibility with existing vector database
- Works seamlessly with both Gemini and OpenAI embeddings

## Usage

### Frontend

The chat interface includes a provider selector that allows users to switch between available AI providers in real-time.

### API

Send requests to the chat API with an optional `provider` parameter:

```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    provider: 'gemini' // or 'openai'
  })
})
```

### Programmatic Usage

```typescript
import { getChatModel, getBestAvailableProvider } from '@/lib/ai/providers';

// Get a specific provider
const geminiModel = getChatModel('gemini');

// Get the best available provider
const bestProvider = getBestAvailableProvider();
const model = getChatModel(bestProvider);
```

## Configuration

### Default Provider

The default provider is set to Gemini in `lib/ai/providers.ts`. You can change this by modifying the `defaultModel` constant:

```typescript
export const defaultModel = "gemini"; // Change to "openai" for OpenAI default
```

### Provider Priority

The system prefers Gemini over OpenAI when both are available. This can be customized in the `getBestAvailableProvider()` function.

## Benefits

1. **Cost Optimization**: Use Gemini for better cost-effectiveness
2. **Flexibility**: Switch between providers based on specific needs
3. **Redundancy**: Fallback to alternative provider if one is unavailable
4. **Performance**: Choose the best model for different use cases

## API Endpoints

- `GET /api/providers` - Returns available AI providers
- `POST /api/chat` - Chat endpoint with provider selection support

## Future Enhancements

- Model-specific parameter tuning
- Usage analytics and cost tracking
- Custom model configurations
- A/B testing between providers
- Provider performance monitoring
