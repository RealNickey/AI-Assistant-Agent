import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { getTextModel, getProviderForTask, getAvailableProviders } from "@/lib/ai/providers";
import { generateObject, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * Enhanced Chat API Route with Multi-Provider Support
 * Supports both OpenAI and Google Gemini with intelligent fallback
 */
export async function POST(req: Request) {
  try {
    const { messages, provider } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing messages" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the appropriate model with error handling
    let model;
    let modelInfo = "Unknown";
    
    try {
      if (provider) {
        const selectedProvider = getAvailableProviders().find(p => p.name === provider);
        if (selectedProvider && selectedProvider.isAvailable) {
          model = selectedProvider.model;
          modelInfo = selectedProvider.name;
        } else {
          console.warn(`Requested provider '${provider}' not available, using default`);
          const defaultProvider = getTextModel();
          model = defaultProvider;
          modelInfo = "default";
        }
      } else {
        // Use smart provider selection for chat tasks
        const chatProvider = getProviderForTask('chat');
        model = chatProvider.model;
        modelInfo = chatProvider.name;
      }
    } catch (error) {
      console.error("Error selecting provider:", error);
      // Fallback to basic OpenAI model
      const { openai } = await import("@ai-sdk/openai");
      model = openai("gpt-4o");
      modelInfo = "fallback-openai";
    }

    const result = streamText({
      model,
      messages,
      system: `You are a helpful assistant acting as the users' second brain.
      Use tools on every request.
      Be sure to getInformation from your knowledge base before answering any questions.
      If the user presents information about themselves, use the addResource tool to store it.
      If a response requires multiple tools, call one tool after another without responding to the user.
      If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
      ONLY respond to questions using information from tool calls.
      if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
      Be sure to adhere to any instructions in tool calls ie. if they say to respond like "...", do exactly that.
      If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
      Keep responses short and concise. Answer in a single sentence where possible.
      If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
      Use your abilities as a reasoning machine to answer questions based on the information you do have.
      
      Current AI Provider: ${modelInfo}
      Available features: Multi-provider support with OpenAI and Google Gemini integration.
      `,
      tools: {
        addResource: tool({
          description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
          parameters: z.object({
            content: z
              .string()
              .describe("the content or resource to add to the knowledge base"),
          }),
          execute: async ({ content }) => {
            try {
              return await createResource({ content });
            } catch (error) {
              console.error("Error adding resource:", error);
              return "Failed to add resource. Please try again.";
            }
          },
        }),
        getInformation: tool({
          description: `get information from your knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe("the users question"),
            similarQuestions: z.array(z.string()).describe("keywords to search"),
          }),
          execute: async ({ similarQuestions }) => {
            try {
              const results = await Promise.all(
                similarQuestions.map(
                  async (question) => await findRelevantContent(question),
                ),
              );
              // Flatten the array of arrays and remove duplicates based on 'name'
              const uniqueResults = Array.from(
                new Map(results.flat().map((item) => [item?.name, item])).values(),
              );
              return uniqueResults;
            } catch (error) {
              console.error("Error retrieving information:", error);
              return [];
            }
          },
        }),
        understandQuery: tool({
          description: `understand the users query. use this tool on every prompt.`,
          parameters: z.object({
            query: z.string().describe("the users query"),
            toolsToCallInOrder: z
              .array(z.string())
              .describe(
                "these are the tools you need to call in the order necessary to respond to the users query",
              ),
          }),
          execute: async ({ query }) => {
            try {
              // Simple fallback for query understanding
              return [query, ...query.split(' ').slice(0, 2)];
            } catch (error) {
              console.error("Error understanding query:", error);
              return [query];
            }
          },
        }),
        getProviderInfo: tool({
          description: `get information about available AI providers and their capabilities.`,
          parameters: z.object({
            detailed: z.boolean().optional().describe("whether to return detailed provider information"),
          }),
          execute: async ({ detailed = false }) => {
            try {
              const providers = getAvailableProviders();
              if (detailed) {
                return {
                  currentModel: modelInfo,
                  availableProviders: providers.map(p => ({
                    name: p.name,
                    maxTokens: p.maxTokens,
                    hasEmbedding: !!p.embeddingModel,
                    priority: p.priority,
                    isAvailable: p.isAvailable
                  }))
                };
              } else {
                return `Currently using: ${modelInfo}. Available providers: ${providers.map(p => p.name).join(', ')}`;
              }
            } catch (error) {
              return "Error retrieving provider information.";
            }
          },
        }),
      },
      // Enhanced configuration for better performance
      maxSteps: 5,
      temperature: 0.1, // Lower temperature for more consistent responses
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Determine if it's a provider-specific error
    const errorMessage = (error as Error).message || "Unknown error";
    const isProviderError = errorMessage.includes("API key") || 
                           errorMessage.includes("authentication") || 
                           errorMessage.includes("quota") ||
                           errorMessage.includes("rate limit");
    
    // More informative error message based on error type
    const userFacingMessage = isProviderError 
      ? "AI provider error: Please check API keys and quotas."
      : "An error occurred while processing your request. Please try again.";
    
    // Enhanced debugging information for development
    const details = process.env.NODE_ENV === 'development' 
      ? {
          message: (error as Error).message,
          stack: (error as Error).stack?.split('\n').slice(0, 3).join('\n'),
          // Use getAvailableProviders to check provider status instead of relying on modelInfo
          providers: getAvailableProviders().map(p => ({ name: p.name, available: p.isAvailable }))
        } 
      : undefined;
    
    // Return error response in expected format with better debugging
    return new Response(
      JSON.stringify({ 
        error: userFacingMessage,
        details
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
      }
    );
  }
}
