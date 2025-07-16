"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface AudioVisualizationProps {
  isActive?: boolean;
  size?: number;
  color?: string;
  className?: string;
}

const AudioVisualization = ({
  isActive = false,
  size = 200,
  color = "#3b82f6",
  className = "",
}: AudioVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [animationTimeline, setAnimationTimeline] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!circleRef.current) return;

    // Create GSAP timeline for the audio visualization
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Main circle pulsing animation
    tl.to(circleRef.current, {
      scale: 1.2,
      duration: 0.6,
      ease: "sine.inOut",
    })
    .to(circleRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "sine.inOut",
    });

    // Create additional circles for ripple effect
    const ripples = Array.from({ length: 3 }, (_, i) => {
      const ripple = document.createElement("div");
      ripple.className = "absolute inset-0 rounded-full border-2 opacity-30";
      ripple.style.borderColor = color;
      ripple.style.animationDelay = `${i * 0.2}s`;
      containerRef.current?.appendChild(ripple);
      
      // Animate ripples
      gsap.to(ripple, {
        scale: 1.5 + i * 0.3,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power2.out",
        delay: i * 0.2,
      });
      
      return ripple;
    });

    setAnimationTimeline(tl);

    // Cleanup function
    return () => {
      tl.kill();
      ripples.forEach(ripple => ripple.remove());
    };
  }, [color]);

  useEffect(() => {
    if (animationTimeline) {
      if (isActive) {
        animationTimeline.play();
      } else {
        animationTimeline.pause();
      }
    }
  }, [isActive, animationTimeline]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Main circle */}
        <motion.div
          ref={circleRef}
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.6,
          }}
          initial={{ scale: 1 }}
          animate={{
            boxShadow: isActive
              ? [
                  `0 0 0 0 ${color}40`,
                  `0 0 0 10px ${color}20`,
                  `0 0 0 20px ${color}10`,
                  `0 0 0 30px ${color}00`,
                ]
              : `0 0 0 0 ${color}40`,
          }}
          transition={{
            duration: 1.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeOut",
          }}
        />

        {/* Inner circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            backgroundColor: color,
            opacity: 0.8,
          }}
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Core circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            backgroundColor: color,
          }}
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {isActive ? "Listening..." : "Voice Chat Ready"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualization;