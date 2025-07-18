"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
  background: "#0a1833",
  color: "#6d8ec5",
        fontFamily:
          '"Orbitron", "Montserrat", "Arial Black", Arial, sans-serif',
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap");
        .crt-scanlines {
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 100;
          background: repeating-linear-gradient(
            to bottom,
            rgba(109, 142, 197, 0.08) 0px,
            rgba(109, 142, 197, 0.08) 1px,
            transparent 2px,
            transparent 4px
          );
        }
        .crt-flicker {
          animation: crt-flicker 0.18s infinite alternate;
        }
        @keyframes crt-flicker {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.92;
          }
          100% {
            opacity: 1;
          }
        }
        .glitch {
          position: relative;
          display: inline-block;
          font-family: "Orbitron", "Montserrat", "Arial Black", Arial,
            sans-serif;
        }
        .glitch:before,
        .glitch:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .glitch:before {
          left: 6px;
          text-shadow: -6px 0 #6d8ec5;
          color: #6d8ec5;
          animation: glitch-anim-1 1.2s infinite linear alternate-reverse;
        }
        .glitch:after {
          left: -6px;
          text-shadow: 6px 0 #2c3e7a;
          color: #6d8ec5;
          animation: glitch-anim-2 1.2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% {
            clip: rect(0, 9999px, 100px, 0);
          }
          20% {
            clip: rect(20px, 9999px, 120px, 0);
          }
          40% {
            clip: rect(40px, 9999px, 140px, 0);
          }
          60% {
            clip: rect(60px, 9999px, 160px, 0);
          }
          80% {
            clip: rect(80px, 9999px, 180px, 0);
          }
          100% {
            clip: rect(100px, 9999px, 200px, 0);
          }
        }
        @keyframes glitch-anim-2 {
          0% {
            clip: rect(100px, 9999px, 0, 0);
          }
          20% {
            clip: rect(120px, 9999px, 20px, 0);
          }
          40% {
            clip: rect(140px, 9999px, 40px, 0);
          }
          60% {
            clip: rect(160px, 9999px, 60px, 0);
          }
          80% {
            clip: rect(180px, 9999px, 80px, 0);
          }
          100% {
            clip: rect(200px, 9999px, 100px, 0);
          }
        }
        .glitch .main {
          position: relative;
          z-index: 2;
          color: #6d8ec5;
          background: none;
          text-shadow: 0 2px 0 #2c3e7a, 0 4px 0 #2c3e7a, 0 6px 0 #2c3e7a, 0 8px 0 #2c3e7a;
        }
        .glow {
          text-shadow: 0 0 10px #6d8ec5, 0 0 20px #2c3e7a;
        }
      `}</style>
      <h1
        className="glitch crt-flicker"
        data-text="404"
        style={{
          fontSize: "12rem",
          fontWeight: 900,
          position: "relative",
          letterSpacing: "0.5rem",
          margin: 0,
          lineHeight: 1,
        }}
      >
        <span className="main">404</span>
      </h1>
      <div className="crt-scanlines" />
      <p
        className="glow"
        style={{
          fontSize: "2rem",
          marginTop: "0",
          marginBottom: "2rem",
        }}
      >
        Page Not Found
      </p>
      <Link
        href="/"
        style={{
          padding: "1rem 2rem",
          border: "2px solid #6d8ec5",
          borderRadius: "5px",
          color: "#6d8ec5",
          textDecoration: "none",
          fontSize: "1.5rem",
          transition: "all 0.3s ease",
          boxShadow: "0 0 5px #6d8ec5, 0 0 10px #6d8ec5 inset",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#6d8ec5";
          e.currentTarget.style.color = "#282b2b";
          e.currentTarget.style.boxShadow =
            "0 0 10px #f0c845, 0 0 15px #f0c845 inset";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#6d8ec5";
          e.currentTarget.style.boxShadow =
            "0 0 5px #6d8ec5, 0 0 10px #6d8ec5 inset";
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
