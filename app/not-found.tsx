"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const crypticMessages = [
  "reality.exe has stopped working",
  "connection to the matrix... lost",
  "temporal displacement detected",
  "accessing restricted dimensions",
  "quantum entanglement unstable",
  "neural pathway corruption found",
  "dimensional breach initiated",
  "system malfunction in paradise",
  "void space encountered",
  "reality buffer overflow",
];

const glitchTexts = [
  "er̸r̷o̴r̶",
  "v̴o̷i̸d̶",
  "n̵u̶l̸l̷",
  "404",
  "lost",
  "gone",
  "missing",
  "broken",
];

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [glitchText, setGlitchText] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % crypticMessages.length);
    }, 3000);

    const glitchInterval = setInterval(() => {
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 200);
    }, 1500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-cool-blue/20 rounded-full blur-sm"
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        opacity: [0.2, 0.8, 0.3, 0.2],
      }}
      transition={{
        duration: 6 + i * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${10 + i * 12}%`,
        top: `${20 + i * 8}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-dark via-deep-dark/95 to-cool-blue/10 overflow-hidden relative">
      {/* Floating particles */}
      {floatingElements}
      
      {/* Interactive mouse trail */}
      <div
        className="fixed w-96 h-96 bg-cool-blue/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        {/* Glassmorphism container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-2xl w-full p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          {/* Glitch overlay */}
          <AnimatePresence>
            {showGlitch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bold-orange/20 rounded-3xl animate-glitch z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Central void symbol */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6 border-2 border-cool-blue/30 rounded-full flex items-center justify-center relative"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-cool-blue/20 to-vibrant-yellow/20 rounded-full backdrop-blur-sm border border-white/20"
              />
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </motion.div>

            {/* Glitch text overlay */}
            <AnimatePresence>
              {showGlitch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center text-8xl font-bold text-bold-orange animate-glitch z-10"
                >
                  {glitchText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cryptic message */}
          <div className="text-center mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-light text-cool-blue/80 tracking-wider mb-4"
              >
                {crypticMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-sm text-vibrant-yellow/60 uppercase tracking-[0.3em] font-mono"
            >
              dimensional coordinates unknown
            </motion.div>
          </div>

          {/* Abstract fragments */}
          <div className="flex justify-center space-x-8 mb-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-3 h-12 bg-gradient-to-t from-cool-blue/40 to-vibrant-yellow/40 rounded-full blur-sm"
              />
            ))}
          </div>

          {/* Disguised navigation */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block group"
            >
              <Link href="/">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-cool-blue/10 to-vibrant-yellow/10 backdrop-blur-sm border border-white/20 hover:border-cool-blue/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cool-blue/20"
                >
                  <span className="text-cool-blue/70 group-hover:text-cool-blue text-sm uppercase tracking-wider font-mono">
                    return to reality
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating text fragments */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -80, 40, 0],
                opacity: [0, 0.4, 0.2, 0],
              }}
              transition={{
                duration: 8 + i * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
              className="absolute text-xs text-cool-blue/30 font-mono"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
            >
              {glitchTexts[i % glitchTexts.length]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}