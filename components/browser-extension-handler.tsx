"use client";

import { useEffect } from 'react';

/**
 * Browser Extension Handler
 * Handles interference from browser extensions like Grammarly
 * that can cause hydration mismatches
 */
export default function BrowserExtensionHandler() {
  useEffect(() => {
    // Clean up browser extension artifacts after hydration
    const cleanupExtensionArtifacts = () => {
      try {
        // Remove Grammarly attributes that cause hydration issues
        const elementsWithGrammarly = document.querySelectorAll(
          '[data-new-gr-c-s-check-loaded], [data-gr-ext-installed]'
        );
        
        elementsWithGrammarly.forEach((element) => {
          element.removeAttribute('data-new-gr-c-s-check-loaded');
          element.removeAttribute('data-gr-ext-installed');
        });
      } catch (error) {
        // Silently handle any cleanup errors
        console.debug('Extension cleanup error:', error);
      }
    };

    // Run cleanup after initial hydration
    const timer = setTimeout(cleanupExtensionArtifacts, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
