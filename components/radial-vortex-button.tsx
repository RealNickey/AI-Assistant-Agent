export default function RadialVortexButton() {
  return (
    <div className="absolute inset-0 bg-slate-950 overflow-hidden">
      {/* Vortex Background */}
      <div className="absolute inset-0 items-center justify-center">
        <div className="vortex w-96 h-96 rounded-full opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <style jsx>{`
        .vortex {
          background: radial-gradient(circle, #3b82f6 0%, #60a5fa 40%, transparent 70%);
          animation: vortexPulse 3s infinite ease-in-out;
          filter: blur(6px);
        }
        
        @keyframes vortexPulse {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
