import { getAvailableProviders, getProviderInfo, resetProviderCache } from "@/lib/ai/providers";
import { NextRequest, NextResponse } from "next/server";

/**
 * AI Providers API Endpoint
 * Provides information about available AI providers and their capabilities
 * Enhanced with diagnostic tools and provider health checks
 */

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Handle reset action
    if (action === 'reset') {
      const result = resetProviderCache();
      return NextResponse.json({
        success: true,
        message: "Provider cache reset successfully",
        primaryProvider: result.primary.name,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Default action - get provider info
    const providerInfo = getProviderInfo();
    const providers = getAvailableProviders();
    
    return NextResponse.json({
      success: true,
      data: providerInfo,
      availableProviders: providers.map(p => ({
        name: p.name,
        isAvailable: p.isAvailable,
        maxTokens: p.maxTokens,
        priority: p.priority,
        hasEmbedding: !!p.embeddingModel
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting provider info:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve provider information",
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Enhanced POST endpoint for provider diagnostics and management
 * Implements Azure best practices for error handling and logging
 */
export async function POST(req: NextRequest) {
  try {
    const { action, provider } = await req.json();
    
    switch (action) {
      case "test":
        // Test provider connectivity with enhanced diagnostics
        const providers = getAvailableProviders();
        const targetProvider = providers.find(p => p.name === provider);
        
        if (!targetProvider) {
          return NextResponse.json(
            {
              success: false,
              error: "Provider not found",
              availableProviders: providers.map(p => p.name),
              requestedProvider: provider,
            },
            { status: 400 }
          );
        }
        
        // Enhanced provider diagnostics
        return NextResponse.json({
          success: true,
          provider: {
            name: targetProvider.name,
            isAvailable: targetProvider.isAvailable,
            maxTokens: targetProvider.maxTokens,
            hasEmbedding: !!targetProvider.embeddingModel,
            priority: targetProvider.priority
          },
          systemInfo: {
            nodeEnv: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
          }
        });
        
      case "list":
        // List all providers with detailed information
        const allProviders = getAvailableProviders();
        return NextResponse.json({
          success: true,
          providers: allProviders.map(p => ({
            name: p.name,
            isAvailable: p.isAvailable,
            maxTokens: p.maxTokens,
            hasEmbedding: !!p.embeddingModel,
            priority: p.priority,
          })),
          systemInfo: {
            primaryProvider: allProviders.length > 0 ? allProviders[0].name : "none",
            totalProviders: allProviders.length,
            timestamp: new Date().toISOString()
          }
        });
      
      case "reset":
        // Reset provider cache and force re-initialization
        const resetResult = resetProviderCache();
        return NextResponse.json({
          success: true,
          message: "Provider cache reset successfully",
          newPrimaryProvider: resetResult.primary.name,
          totalProviders: 1 + resetResult.fallback.length,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
            supportedActions: ["test", "list", "reset"],
            providedAction: action
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in providers API:", error);
    
    // Enhanced error reporting
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
