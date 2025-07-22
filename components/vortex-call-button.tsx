export default function VortexCallButton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Vortex Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="vortex w-96 h-96 rounded-full opacity-70"></div>
      </div>
      
      {/* Centered Button */}
      <div className="relative z-10">
        <button className="pulse-btn bg-gradient-to-r from-blue-600 to-blue-400 text-white border-0 rounded-full px-10 py-5 text-xl font-semibold cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105 focus:scale-105 outline-none">
          Start a call
        </button>
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
        
        .pulse-btn {
          box-shadow: 0 4px 32px rgba(59, 130, 246, 0.3);
        }
        
        .pulse-btn:hover,
        .pulse-btn:focus {
          box-shadow: 0 8px 48px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
