"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProviderSelectorProps {
  onProviderChange: (provider: "openai" | "gemini") => void;
  selectedProvider: "openai" | "gemini";
}

export default function ProviderSelector({ 
  onProviderChange, 
  selectedProvider 
}: ProviderSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        const data = await response.json();
        setAvailableProviders(data.providers);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Label className="text-sm">Loading providers...</Label>
      </div>
    );
  }

  if (availableProviders.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Label className="text-sm text-red-600">No AI providers available</Label>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm">AI Provider:</Label>
      <div className="flex gap-1">
        {availableProviders.includes("gemini") && (
          <Button
            variant={selectedProvider === "gemini" ? "default" : "outline"}
            size="sm"
            onClick={() => onProviderChange("gemini")}
          >
            🤖 Gemini
          </Button>
        )}
        {availableProviders.includes("openai") && (
          <Button
            variant={selectedProvider === "openai" ? "default" : "outline"}
            size="sm"
            onClick={() => onProviderChange("openai")}
          >
            🧠 OpenAI
          </Button>
        )}
      </div>
    </div>
  );
}
