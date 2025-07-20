# AI SDK Multi-Provider RAG Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicoalbanese%2Fai-sdk-rag-template&env=OPENAI_API_KEY&envDescription=You%20will%20need%20an%20OPENAI%20API%20Key.&project-name=ai-sdk-rag&repository-name=ai-sdk-rag&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D&skippable-integrations=1)

A [Next.js](https://nextjs.org/) application, powered by the Vercel AI SDK, that uses retrieval-augmented generation (RAG) with **multi-provider AI support**. Seamlessly switch between OpenAI GPT-4 and Google Gemini with intelligent fallback and provider management.

## 🚀 Features

### Multi-Provider AI Support
- **OpenAI GPT-4** - Industry-leading language model with excellent reasoning capabilities
- **Google Gemini 1.5 Pro** - Advanced model with large context window (8k+ tokens)
- **Intelligent Provider Selection** - Automatic selection based on task type and availability
- **Seamless Fallback** - Automatic failover between providers for maximum reliability
- **Provider Management API** - Real-time provider status and health monitoring

### Advanced RAG Capabilities
- Information retrieval and addition through tool calls using the [`streamText`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text) function
- Real-time streaming of model responses to the frontend using the [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) hook
- Vector embedding storage with [DrizzleORM](https://orm.drizzle.team/) and [PostgreSQL](https://www.postgresql.org/)
- Smart embedding provider selection for optimal performance

### Enhanced User Experience
- **Provider Selector UI** - Choose your preferred AI provider in real-time
- Animated UI with [Framer Motion](https://www.framer.com/motion/)
- **Error Handling & Recovery** - Robust error handling with informative user feedback
- **Performance Optimizations** - Connection pooling, caching, and efficient resource management

## 🛠 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- At least one of the following API keys:
  - OpenAI API Key (recommended)
  - Google AI API Key (for Gemini)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Add your API keys and PostgreSQL connection string to the `.env` file:
   ```env
   DATABASE_URL=your_postgres_connection_string_here
   OPENAI_API_KEY=your_openai_api_key_here          # Optional but recommended
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key  # Optional
   ```

4. Migrate the database schema:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Your project should now be running on [http://localhost:3000](http://localhost:3000).

## 🔧 Configuration

### Provider Priority
The system automatically selects providers based on:
1. **Availability** - Only configured providers with valid API keys
2. **Task Type** - Different providers for different tasks:
   - `chat` - Primary provider (OpenAI → Gemini)
   - `analysis` - Prefer Gemini for larger context window
   - `embedding` - Best available embedding model

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 access
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI API key for Gemini access
- `DATABASE_URL` - PostgreSQL connection string for vector storage
- `CLERK_SECRET_KEY` - Optional Clerk authentication (if enabled)

## 🧪 Testing Providers

Use the provider management API to test connectivity:

```bash
# List all available providers
curl -X POST http://localhost:3000/api/providers \
  -H "Content-Type: application/json" \
  -d '{"action": "list"}'

# Test a specific provider
curl -X POST http://localhost:3000/api/providers \
  -H "Content-Type: application/json" \
  -d '{"action": "test", "provider": "google"}'
```

## 📚 Architecture

### Provider System
- **Smart Routing** - Automatic provider selection based on task requirements
- **Health Monitoring** - Real-time provider availability checking
- **Graceful Degradation** - Fallback to alternative providers on failure
- **Configuration Management** - Centralized provider configuration with priority handling

### Security Features
- **Environment-based Configuration** - No hardcoded API keys
- **Error Masking** - Sensitive information is never exposed in error messages
- **Rate Limiting Awareness** - Intelligent handling of API rate limits

## 🎯 Use Cases

This template is perfect for:
- **AI-powered knowledge bases** with multiple provider support
- **Research assistants** that need reliable AI access
- **Customer support systems** with high availability requirements
- **Content generation platforms** with diverse AI model needs
- **Educational tools** requiring consistent AI responses

## 🔍 Monitoring & Debugging

The application includes built-in monitoring features:
- Provider health status in the UI
- Detailed error logging for troubleshooting
- Performance metrics for provider selection
- Real-time provider switching capability

Start building your next AI application with confidence, knowing you have multiple providers backing your system!
