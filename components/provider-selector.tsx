"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Provider {
  name: string;
  isAvailable: boolean;
  maxTokens: number;
  hasEmbedding: boolean;
  priority: number;
}

interface ProviderSelectorProps {
  onProviderChange?: (provider: string | null) => void;
  selectedProvider?: string | null;
}

export const ProviderSelector = ({ 
  onProviderChange, 
  selectedProvider 
}: ProviderSelectorProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch providers");
      }

      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (providerName: string) => {
    const newProvider = selectedProvider === providerName ? null : providerName;
    onProviderChange?.(newProvider);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="animate-spin h-4 w-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full"></div>
        <span>Loading providers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        No providers available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
        AI Provider:
      </span>
      <Button
        variant={selectedProvider === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleProviderSelect("")}
        className="h-8 px-3 text-xs"
      >
        Auto
      </Button>
      {providers.map((provider) => (
        <Button
          key={provider.name}
          variant={selectedProvider === provider.name ? "default" : "outline"}
          size="sm"
          onClick={() => handleProviderSelect(provider.name)}
          disabled={!provider.isAvailable}
          className="h-8 px-3 text-xs capitalize relative"
          title={`${provider.name} - Max tokens: ${provider.maxTokens}${provider.hasEmbedding ? ' (with embeddings)' : ''}`}
        >
          {provider.name}
          {provider.name === "google" && (
            <span className="ml-1 text-xs text-blue-500">⭐</span>
          )}
          {!provider.isAvailable && (
            <span className="ml-1 text-xs text-red-500">⚠</span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default ProviderSelector;
