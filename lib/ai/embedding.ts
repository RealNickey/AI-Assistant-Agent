import { embed, embedMany } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { db } from "../db";
import { getEmbeddingModel, getProviderForTask } from "./providers";

/**
 * Smart embedding generation using the best available provider
 * Includes error handling and provider fallback
 */

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

/**
 * Generate embeddings for a text with multiple chunks
 * Implements Azure best practices for error handling and retry logic
 */
export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  try {
    const chunks = generateChunks(value);
    const embeddingModel = getEmbeddingModel();
    
    // Don't process if there are no chunks
    if (chunks.length === 0) {
      console.warn("No valid chunks to embed");
      return [];
    }
    
    // Implement retry logic for API resilience
    let attempt = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;
    
    while (attempt < maxAttempts) {
      try {
        const { embeddings } = await embedMany({
          model: embeddingModel,
          values: chunks,
        });
        
        return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
      } catch (error) {
        lastError = error as Error;
        attempt++;
        
        // Only log and retry for transient errors
        const isTransientError = 
          lastError.message.includes("timeout") || 
          lastError.message.includes("rate") || 
          lastError.message.includes("503") || 
          lastError.message.includes("429");
          
        if (isTransientError && attempt < maxAttempts) {
          console.warn(`Embedding attempt ${attempt} failed, retrying...`, lastError.message);
          // Exponential backoff
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        } else {
          break;
        }
      }
    }
    
    // After all retries failed
    console.error(`Failed to generate embeddings after ${maxAttempts} attempts:`, lastError);
    throw new Error(`Failed to generate embeddings: ${lastError?.message}`);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(`Failed to generate embeddings: ${(error as Error).message}`);
  }
};

/**
 * Generate a single embedding for a text
 * Implements Azure best practices for error handling and retry logic
 */
export const generateEmbedding = async (value: string): Promise<number[]> => {
  try {
    const input = value.replaceAll("\n", " ").trim();
    
    // Don't process empty input
    if (!input) {
      console.warn("Empty input for embedding, returning zero vector");
      return Array(1536).fill(0); // Default OpenAI embedding size
    }
    
    const embeddingModel = getEmbeddingModel();
    
    // Implement retry logic for API resilience
    let attempt = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;
    
    while (attempt < maxAttempts) {
      try {
        const { embedding } = await embed({
          model: embeddingModel,
          value: input,
        });
        
        return embedding;
      } catch (error) {
        lastError = error as Error;
        attempt++;
        
        // Only log and retry for transient errors
        const isTransientError = 
          lastError.message.includes("timeout") || 
          lastError.message.includes("rate") || 
          lastError.message.includes("503") || 
          lastError.message.includes("429");
          
        if (isTransientError && attempt < maxAttempts) {
          console.warn(`Embedding attempt ${attempt} failed, retrying...`, lastError.message);
          // Exponential backoff
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        } else {
          break;
        }
      }
    }
    
    // After all retries failed
    console.error(`Failed to generate embedding after ${maxAttempts} attempts:`, lastError);
    throw new Error(`Failed to generate embedding: ${lastError?.message}`);
  } catch (error) {
    console.error("Error generating single embedding:", error);
    throw new Error(`Failed to generate embedding: ${(error as Error).message}`);
  }
};

export const findRelevantContent = async (userQuery: string) => {
  try {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
    
    const similarGuides = await db
      .select({ name: embeddings.content, similarity })
      .from(embeddings)
      .where(gt(similarity, 0.3))
      .orderBy((t) => desc(t.similarity))
      .limit(4);
      
    return similarGuides;
  } catch (error) {
    console.error("Error finding relevant content:", error);
    // Return empty array instead of throwing to gracefully handle embedding failures
    return [];
  }
};
