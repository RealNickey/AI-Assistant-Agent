"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const friendlyMessages = [
  "Well, this is awkward...",
  "Lost in the digital void",
  "Page not found in this dimension",
  "Reality seems to have glitched",
  "Exploring uncharted territories",
  "Connection to destination lost",
  "Wandering through digital space",
  "This path doesn&apos;t exist... yet",
];

const matrixRainChars = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z", "ア", "イ", "ウ", "エ",
  "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ",
  "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ",
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

// Matrix rain component
const MatrixRain = () => {
  const [drops, setDrops] = useState<Array<{ id: number; x: number; chars: string[]; speed: number }>>([]);

  useEffect(() => {
    const generateDrops = () => {
      const newDrops = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        chars: Array.from({ length: 20 }, () => 
          matrixRainChars[Math.floor(Math.random() * matrixRainChars.length)]
        ),
        speed: Math.random() * 0.5 + 0.3,
      }));
      setDrops(newDrops);
    };

    generateDrops();
    const interval = setInterval(generateDrops, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute text-cool-blue/60 text-xs font-mono whitespace-pre-line"
          style={{ left: `${drop.x}%` }}
          animate={{
            y: ["-100vh", "100vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 / drop.speed,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          {drop.chars.map((char, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [1, 0.3, 1],
                color: ["#6d8ec5", "#f0c845", "#6d8ec5"],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [glitchText, setGlitchText] = useState("");
  const [showGlitch, setShowGlitch] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % friendlyMessages.length);
    }, 4000);

    const glitchInterval = setInterval(() => {
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
    }, 2000);

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

  // Enhanced floating elements with more variety
  const floatingElements = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute rounded-full blur-sm ${
        i % 3 === 0 ? 'w-3 h-3 bg-cool-blue/30' : 
        i % 3 === 1 ? 'w-2 h-2 bg-vibrant-yellow/40' : 
        'w-1 h-1 bg-bold-orange/50'
      }`}
      animate={{
        x: [0, 150, -100, 0],
        y: [0, -120, 80, 0],
        opacity: [0.2, 0.9, 0.4, 0.2],
        scale: [1, 1.5, 0.8, 1],
      }}
      transition={{
        duration: 8 + i * 0.7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.5,
      }}
      style={{
        left: `${5 + i * 8}%`,
        top: `${10 + i * 7}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-dark via-deep-dark/90 to-cool-blue/5 overflow-hidden relative">
      {/* Matrix rain background */}
      <MatrixRain />
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>
      
      {/* Interactive mouse trail with multiple layers */}
      <div
        className="fixed w-96 h-96 bg-cool-blue/3 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      <div
        className="fixed w-64 h-64 bg-vibrant-yellow/5 rounded-full blur-2xl pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      {/* Main content container with multiple glass layers */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        {/* Background glass layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 max-w-4xl mx-auto my-auto h-full rounded-[2rem] bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/5 shadow-[0_0_50px_rgba(109,142,197,0.1)]"
        />

        {/* Middle glass layer with fine lines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative max-w-3xl w-full mx-auto mb-8"
        >
          {/* Top decorative line */}
          <div className="h-px bg-gradient-to-r from-transparent via-cool-blue/40 to-transparent mb-8" />
          
          {/* Side decorative lines */}
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cool-blue/30 to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-vibrant-yellow/30 to-transparent" />
        </motion.div>

        {/* Main glassmorphism container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="relative max-w-2xl w-full p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_80px_rgba(109,142,197,0.2),inset_0_0_80px_rgba(255,255,255,0.05)]"
          role="main"
          aria-label="404 Error Page"
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cool-blue/10 to-vibrant-yellow/5 opacity-50" />
          
          {/* Glitch overlay */}
          <AnimatePresence>
            {showGlitch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bold-orange/15 rounded-3xl animate-glitch z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Top decorative separator */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-cool-blue/50 to-transparent flex-1" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border border-cool-blue/50 rounded-full"
              />
              <div className="h-px bg-gradient-to-r from-transparent via-vibrant-yellow/50 to-transparent flex-1" />
            </div>
          </div>

          {/* Central void symbol with enhanced design */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto mb-8 border-2 border-cool-blue/40 rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(109,142,197,0.3)]"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-br from-cool-blue/20 via-vibrant-yellow/10 to-cool-blue/20 rounded-full backdrop-blur-sm border border-white/30 shadow-inner"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-16 h-16 bg-gradient-to-br from-vibrant-yellow/30 to-cool-blue/30 rounded-full blur-sm"
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
                  className="absolute inset-0 flex items-center justify-center text-9xl font-bold text-bold-orange animate-glitch z-10"
                >
                  {glitchText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced main message */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-cool-blue mb-6 tracking-tight"
            >
              404
            </motion.h1>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-light text-cool-blue/90 tracking-wide mb-6"
              >
                {friendlyMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>

            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-base text-vibrant-yellow/70 uppercase tracking-[0.2em] font-mono"
            >
              The page you&apos;re looking for doesn&apos;t exist
            </motion.div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-cool-blue/40 to-transparent flex-1" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-4 h-4 bg-gradient-to-br from-cool-blue/50 to-vibrant-yellow/50 rounded-full"
            />
            <div className="h-px bg-gradient-to-r from-transparent via-vibrant-yellow/40 to-transparent flex-1" />
          </div>

          {/* Enhanced abstract fragments */}
          <div className="flex justify-center space-x-12 mb-12">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.9, 0.3],
                  scaleY: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className={`w-1 h-16 rounded-full blur-sm ${
                  i % 2 === 0 
                    ? 'bg-gradient-to-t from-cool-blue/50 to-vibrant-yellow/50' 
                    : 'bg-gradient-to-t from-vibrant-yellow/50 to-cool-blue/50'
                }`}
              />
            ))}
          </div>

          {/* Enhanced navigation */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block group"
            >
              <Link href="/" aria-label="Return to homepage">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="px-12 py-5 rounded-full bg-gradient-to-r from-cool-blue/15 to-vibrant-yellow/15 backdrop-blur-sm border border-white/30 hover:border-cool-blue/50 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(109,142,197,0.3)] group-hover:bg-gradient-to-r group-hover:from-cool-blue/20 group-hover:to-vibrant-yellow/20"
                >
                  <span className="text-cool-blue/80 group-hover:text-cool-blue text-lg uppercase tracking-wider font-mono transition-all duration-300">
                    Return to Homepage
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Bottom decorative separator */}
          <div className="relative mt-12">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-vibrant-yellow/50 to-transparent flex-1" />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border border-vibrant-yellow/50 rounded-full"
              />
              <div className="h-px bg-gradient-to-r from-transparent via-cool-blue/50 to-transparent flex-1" />
            </div>
          </div>
        </motion.div>

        {/* Enhanced floating text fragments */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 120, -80, 0],
                y: [0, -100, 60, 0],
                opacity: [0, 0.6, 0.3, 0],
                rotate: [0, 360, -180, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
              className="absolute text-sm text-cool-blue/40 font-mono"
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