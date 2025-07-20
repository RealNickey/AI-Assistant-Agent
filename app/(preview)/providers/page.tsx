'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Define provider type for TypeScript
interface Provider {
  name: string;
  isAvailable: boolean;
  maxTokens?: number;
  hasEmbedding: boolean;
  priority: number;
}

interface ProviderInfo {
  status: string;
  primary: any;
  fallback: any[];
  embedding: any;
  lastInitTime: number;
  cacheStatus: string;
}

/**
 * AI Provider Diagnostics Tool
 * Use this page to test AI providers, diagnose issues, and reset provider caches
 */
export default function ProvidersTestPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Load provider info on page load
  useEffect(() => {
    fetchProviderInfo();
  }, []);

  // Fetch provider info from API
  const fetchProviderInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/providers');
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.availableProviders || []);
        setProviderInfo(data.data);
      } else {
        setError(data.error || 'Failed to load provider information');
      }
    } catch (err: any) {
      setError(`Error fetching provider info: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test a specific provider
  const testProvider = async (providerName: string) => {
    try {
      setLoading(true);
      setTestResult(null);
      setError(null);
      
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          provider: providerName,
        }),
      });
      
      const data = await response.json();
      setTestResult(data);
      setSelectedProvider(providerName);
    } catch (err: any) {
      setError(`Error testing provider: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset provider cache
  const resetProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      setResetMessage(null);
      
      const response = await fetch('/api/providers?action=reset');
      const data = await response.json();
      
      if (data.success) {
        setResetMessage(`Provider cache reset. Primary provider: ${data.primaryProvider}`);
        // Refresh provider info after reset
        await fetchProviderInfo();
      } else {
        setError(data.error || 'Failed to reset provider cache');
      }
    } catch (err: any) {
      setError(`Error resetting providers: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Provider Diagnostics</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {resetMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{resetMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Available Providers</h2>
          
          {loading && <p className="text-gray-500">Loading...</p>}
          
          {!loading && providers.length === 0 && (
            <p className="text-red-500">No providers available</p>
          )}
          
          {!loading && providers.length > 0 && (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div 
                  key={provider.name}
                  className={`p-3 rounded border ${
                    provider.isAvailable 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-yellow-300 bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{provider.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      provider.isAvailable 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {provider.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    Max Tokens: {provider.maxTokens || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Embedding: {provider.hasEmbedding ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Priority: {provider.priority}
                  </p>
                  
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    onClick={() => testProvider(provider.name)}
                    disabled={loading}
                  >
                    Test Provider
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <Button 
              onClick={fetchProviderInfo} 
              className="mr-2"
              disabled={loading}
            >
              Refresh
            </Button>
            <Button 
              onClick={resetProviders} 
              variant="destructive"
              disabled={loading}
            >
              Reset Providers
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Provider Details</h2>
          
          {loading && <p className="text-gray-500">Loading...</p>}
          
          {!loading && testResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Test Results for {selectedProvider}
              </h3>
              
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
          
          {!loading && !testResult && providerInfo && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">System Info</h3>
              
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(providerInfo, null, 2)}
              </pre>
            </div>
          )}
          
          {!loading && !testResult && !providerInfo && (
            <p className="text-gray-500">Select a provider to test</p>
          )}
        </div>
      </div>
    </div>
  );
}
