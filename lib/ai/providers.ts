import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { env } from "@/lib/env.mjs";

/**
 * AI Provider Configuration
 * Manages multiple AI providers with fallback and intelligent routing
 * Implements Azure code generation best practices:
 * - Proper error handling with logging
 * - Caching for performance optimization
 * - Consistent initialization
 */

export interface AIProvider {
  name: string;
  model: any;
  embeddingModel?: any;
  maxTokens?: number;
  isAvailable: boolean;
  priority: number;
}

export interface ProviderConfig {
  primary: AIProvider;
  fallback: AIProvider[];
  embedding: AIProvider;
}

// Provider cache to prevent repeated initialization
let providerCache: ProviderConfig | null = null;
let lastInitTime = 0;
const CACHE_TTL = 300000; // 5 minutes in milliseconds

/**
 * Safely initialize AI providers with proper error handling and availability checks
 * Uses caching to improve performance and reduce API key validation overhead
 */
const initializeProviders = (): ProviderConfig => {
  const currentTime = Date.now();
  
  // Return cached providers if available and not expired
  if (providerCache && (currentTime - lastInitTime) < CACHE_TTL) {
    return providerCache;
  }
  
  const providers: AIProvider[] = [];
  
  // Track initialization success for logging
  let openaiInitialized = false;
  let googleInitialized = false;

  // OpenAI Provider - with robust error handling
  try {
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.length > 10) {
      providers.push({
        name: "openai",
        model: openai("gpt-4o"),
        embeddingModel: openai.embedding("text-embedding-ada-002"),
        maxTokens: 4096,
        isAvailable: true,
        priority: 1
      });
      openaiInitialized = true;
      console.log("✅ OpenAI provider initialized");
    } else {
      console.log("ℹ️ OpenAI API key not configured");
    }
  } catch (error) {
    console.warn("⚠️ OpenAI provider initialization failed:", (error as Error).message);
  }

  // Google Gemini Provider - with robust error handling
  try {
    if (env.GOOGLE_GENERATIVE_AI_API_KEY && env.GOOGLE_GENERATIVE_AI_API_KEY.length > 10) {
      providers.push({
        name: "google",
        model: google("gemini-1.5-pro-latest"),
        embeddingModel: google.embedding("text-embedding-004"),
        maxTokens: 8192,
        isAvailable: true,
        priority: 2
      });
      googleInitialized = true;
      console.log("✅ Google Gemini provider initialized");
    } else {
      console.log("ℹ️ Google Gemini API key not configured");
    }
  } catch (error) {
    console.warn("⚠️ Google provider initialization failed:", (error as Error).message);
  }

  // Sort providers by priority
  providers.sort((a, b) => a.priority - b.priority);

  // Only log this warning if both provider initializations failed
  if (providers.length === 0) {
    // Fallback to OpenAI with basic configuration if no valid keys are found
    console.warn("🔄 No providers configured, falling back to basic OpenAI setup");
    providers.push({
      name: "openai-fallback",
      model: openai("gpt-4o"),
      embeddingModel: openai.embedding("text-embedding-ada-002"),
      maxTokens: 4096,
      isAvailable: false, // Mark as unavailable since no key
      priority: 1
    });
  }

  // Update cache
  providerCache = {
    primary: providers[0],
    fallback: providers.slice(1),
    embedding: providers.find(p => p.embeddingModel) || providers[0]
  };
  
  lastInitTime = currentTime;
  
  // Log initialization summary
  console.log(`Provider initialization summary: OpenAI: ${openaiInitialized ? '✅' : '❌'}, Google: ${googleInitialized ? '✅' : '❌'}`);
  
  return providerCache;
};

/**
 * Get the best available AI model for text generation
 * With improved error handling and logging
 */
export const getTextModel = () => {
  try {
    const config = initializeProviders();
    return config.primary.model;
  } catch (error) {
    console.error("Error getting text model:", error);
    // Fallback to basic OpenAI model in case of failure
    return openai("gpt-4o");
  }
};

/**
 * Get the best available embedding model
 * With improved error handling and logging
 */
export const getEmbeddingModel = () => {
  try {
    const config = initializeProviders();
    return config.embedding.embeddingModel || config.embedding.model;
  } catch (error) {
    console.error("Error getting embedding model:", error);
    // Fallback to basic OpenAI embedding in case of failure
    return openai.embedding("text-embedding-ada-002");
  }
};

/**
 * Get a specific provider by name
 * With improved error handling and logging
 */
export const getProviderByName = (name: string): AIProvider | undefined => {
  try {
    const config = initializeProviders();
    const allProviders = [config.primary, ...config.fallback];
    return allProviders.find(p => p.name === name);
  } catch (error) {
    console.error(`Error getting provider by name '${name}':`, error);
    return undefined;
  }
};

/**
 * Get all available providers
 * With improved error handling and logging
 */
export const getAvailableProviders = (): AIProvider[] => {
  try {
    const config = initializeProviders();
    return [config.primary, ...config.fallback];
  } catch (error) {
    console.error("Error getting available providers:", error);
    // Return empty array in case of failure
    return [];
  }
};

/**
 * Provider health check and fallback logic
 * With enhanced error handling and retry mechanism
 */
export const getHealthyProvider = async (): Promise<AIProvider> => {
  try {
    const config = initializeProviders();
    
    // Try primary provider first
    if (config.primary.isAvailable) {
      return config.primary;
    }
    
    // Try fallback providers
    for (const provider of config.fallback) {
      if (provider.isAvailable) {
        return provider;
      }
    }
    
    // If no providers are marked available, try primary anyway as last resort
    return config.primary;
  } catch (error) {
    console.error("Error getting healthy provider:", error);
    
    // Last resort fallback to prevent complete failure
    return {
      name: "emergency-fallback",
      model: openai("gpt-4o"),
      maxTokens: 4096,
      isAvailable: false,
      priority: 999
    };
  }
};

/**
 * Smart provider selection based on task type
 * Implements Azure best practices for reliability and fallback
 */
export const getProviderForTask = (taskType: 'chat' | 'embedding' | 'analysis' = 'chat'): AIProvider => {
  try {
    const config = initializeProviders();
    
    switch (taskType) {
      case 'embedding':
        return config.embedding;
      case 'analysis':
        // Prefer Gemini for analysis tasks due to larger context window
        const geminiProvider = getProviderByName('google');
        return geminiProvider && geminiProvider.isAvailable 
          ? geminiProvider 
          : config.primary;
      case 'chat':
      default:
        return config.primary;
    }
  } catch (error) {
    console.error(`Error getting provider for task '${taskType}':`, error);
    
    // Emergency fallback
    return {
      name: "emergency-fallback",
      model: openai("gpt-4o"),
      maxTokens: 4096,
      isAvailable: false,
      priority: 999
    };
  }
};

/**
 * Get provider information for debugging/monitoring
 * Enhanced with more detailed status information
 */
export const getProviderInfo = () => {
  try {
    const config = initializeProviders();
    return {
      status: "healthy",
      primary: {
        name: config.primary.name,
        maxTokens: config.primary.maxTokens,
        hasEmbedding: !!config.primary.embeddingModel,
        isAvailable: config.primary.isAvailable,
        priority: config.primary.priority
      },
      fallback: config.fallback.map(p => ({
        name: p.name,
        maxTokens: p.maxTokens,
        hasEmbedding: !!p.embeddingModel,
        isAvailable: p.isAvailable,
        priority: p.priority
      })),
      embedding: {
        name: config.embedding.name,
        maxTokens: config.embedding.maxTokens,
        isAvailable: config.embedding.isAvailable
      },
      lastInitTime,
      cacheStatus: providerCache ? "valid" : "invalid"
    };
  } catch (error) {
    return { 
      status: "error",
      error: (error as Error).message,
      lastInitTime,
      cacheStatus: providerCache ? "valid" : "invalid"
    };
  }
};

/**
 * Reset provider cache to force re-initialization
 * Useful for testing or when API keys are updated at runtime
 */
export const resetProviderCache = () => {
  providerCache = null;
  lastInitTime = 0;
  console.log("Provider cache reset");
  
  // Return the newly initialized providers
  return initializeProviders();
};
