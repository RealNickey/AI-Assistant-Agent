import { getAvailableProviders, getProviderInfo } from "@/lib/ai/providers";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * Provider Test API Endpoint
 * Tests actual functionality of AI providers
 */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const provider = searchParams.get('provider'); // 'openai', 'google', or 'all'
    const testType = searchParams.get('test') || 'simple'; // 'simple', 'embedding', 'detailed'

    if (testType === 'simple') {
      return await testSimpleGeneration(provider);
    } else if (testType === 'info') {
      return await testProviderInfo();
    }

    return NextResponse.json({
      error: "Invalid test type",
      supportedTypes: ["simple", "info"],
    }, { status: 400 });

  } catch (error) {
    console.error("Provider test error:", error);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      message: (error as Error).message,
    }, { status: 500 });
  }
}

async function testProviderInfo() {
  try {
    const info = getProviderInfo();
    const providers = getAvailableProviders();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      providerInfo: info,
      availableCount: providers.length,
      providers: providers.map(p => ({
        name: p.name,
        isAvailable: p.isAvailable,
        maxTokens: p.maxTokens,
        hasEmbedding: !!p.embeddingModel,
        priority: p.priority
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to get provider info",
      message: (error as Error).message,
    }, { status: 500 });
  }
}

async function testSimpleGeneration(providerName?: string | null) {
  const testPrompt = "What is 2+2? Reply with just the number.";
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: []
  };

  try {
    const providers = getAvailableProviders();
    
    if (providers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No providers available",
        message: "No API keys configured"
      }, { status: 503 });
    }

    const providersToTest = providerName 
      ? providers.filter(p => p.name === providerName)
      : providers.filter(p => p.isAvailable);

    if (providersToTest.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No matching providers found",
        requested: providerName,
        available: providers.map(p => p.name)
      }, { status: 404 });
    }

    // Test each provider
    for (const provider of providersToTest) {
      const startTime = Date.now();
      const testResult: any = {
        provider: provider.name,
        status: 'pending',
        responseTime: 0,
        error: null,
        response: null
      };

      try {
        if (!provider.isAvailable) {
          throw new Error("Provider not available - check API key");
        }

        const response = await generateText({
          model: provider.model,
          prompt: testPrompt,
          maxTokens: 10
        });

        testResult.status = 'success';
        testResult.responseTime = Date.now() - startTime;
        testResult.response = response.text.trim();

      } catch (error) {
        testResult.status = 'failed';
        testResult.responseTime = Date.now() - startTime;
        testResult.error = (error as Error).message;
        
        if (testResult.error.includes('API key')) {
          testResult.error = "Invalid or missing API key";
        } else if (testResult.error.includes('quota')) {
          testResult.error = "Quota exceeded or rate limited";
        } else if (testResult.error.includes('network')) {
          testResult.error = "Network connectivity issue";
        }
      }

      results.tests.push(testResult);
    }

    // Summary
    const successfulTests = results.tests.filter((t: any) => t.status === 'success');
    results.summary = {
      total: results.tests.length,
      successful: successfulTests.length,
      failed: results.tests.length - successfulTests.length,
      averageResponseTime: successfulTests.length > 0 
        ? Math.round(successfulTests.reduce((sum: number, t: any) => sum + t.responseTime, 0) / successfulTests.length)
        : 0
    };

    return NextResponse.json(results);

  } catch (error) {
    results.success = false;
    results.error = (error as Error).message;
    return NextResponse.json(results, { status: 500 });
  }
}
