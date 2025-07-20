"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TestResult {
  provider: string;
  status: string;
  responseTime: number;
  error?: string;
  response?: string;
}

interface TestResponse {
  success: boolean;
  timestamp: string;
  tests: TestResult[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  providerInfo?: any; // For provider info endpoint
  error?: string;
}

export default function ProviderTester() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResponse | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const runTest = async (testType: string = "simple") => {
    setTesting(true);
    setResults(null);
    
    try {
      const url = new URL("/api/test-providers", window.location.origin);
      url.searchParams.set("test", testType);
      if (selectedProvider !== "all") {
        url.searchParams.set("provider", selectedProvider);
      }
      
      const response = await fetch(url.toString());
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
        timestamp: new Date().toISOString(),
        tests: [],
        error: (error as Error).message
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border rounded-lg p-6 bg-white dark:bg-neutral-900 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
          🧪 AI Provider Test Suite
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Test your AI providers to ensure they are working correctly. This will verify API keys and connectivity.
        </p>
        
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Provider:
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              disabled={testing}
            >
              <option value="all">All Available</option>
              <option value="openai">OpenAI Only</option>
              <option value="google">Google Only</option>
            </select>
          </div>
          
          <Button 
            onClick={() => runTest("simple")} 
            disabled={testing}
            size="sm"
          >
            {testing ? "Testing..." : "🚀 Run Tests"}
          </Button>
          
          <Button 
            onClick={() => runTest("info")} 
            disabled={testing}
            variant="outline"
            size="sm"
          >
            📊 Provider Info
          </Button>
        </div>

        {testing && (
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
            <div className="animate-spin h-4 w-4 border-2 border-blue-300 border-t-blue-600 rounded-full"></div>
            <span className="text-sm">Running tests...</span>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Test Results
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(results.timestamp).toLocaleString()}
                </span>
              </div>

              {results.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    <strong>Error:</strong> {results.error}
                  </p>
                </div>
              )}

              {results.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white dark:bg-neutral-900 rounded border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {results.summary.total}
                    </div>
                    <div className="text-xs text-neutral-500">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {results.summary.successful}
                    </div>
                    <div className="text-xs text-neutral-500">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {results.summary.failed}
                    </div>
                    <div className="text-xs text-neutral-500">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.summary.averageResponseTime}ms
                    </div>
                    <div className="text-xs text-neutral-500">Avg Response</div>
                  </div>
                </div>
              )}

              {results.tests && results.tests.length > 0 && (
                <div className="space-y-3">
                  {results.tests.map((test, index) => (
                    <div key={index} className="border rounded p-3 bg-white dark:bg-neutral-900">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                            {test.provider}
                          </span>
                          <span className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                            {test.status === "success" ? "✅" : test.status === "failed" ? "❌" : "⏳"}
                            {test.status}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {test.responseTime}ms
                        </span>
                      </div>
                      
                      {test.response && (
                        <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                          <strong>Response:</strong> {test.response}
                        </div>
                      )}
                      
                      {test.error && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          <strong>Error:</strong> {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {results.providerInfo && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Provider Information
                  </h4>
                  <pre className="text-xs text-blue-800 dark:text-blue-200 overflow-x-auto">
                    {JSON.stringify(results.providerInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            💡 Troubleshooting Tips
          </h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• Ensure your API keys are set in the environment variables</li>
            <li>• Check if you have quota remaining on your API accounts</li>
            <li>• Verify your network connection if tests timeout</li>
            <li>• OpenAI: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">OPENAI_API_KEY</code></li>
            <li>• Google AI: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">GOOGLE_GENERATIVE_AI_API_KEY</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
