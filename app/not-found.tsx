import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      background: '#282b2b',
      color: '#6d8ec5',
      fontFamily: 'monospace',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <style jsx>{`
        .glitch:before, .glitch:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #282b2b;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch:before {
          left: 2px;
          text-shadow: -1px 0 #d3622c;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch:after {
          left: -2px;
          text-shadow: -1px 0 #f0c845;
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip: rect(42px, 9999px, 44px, 0); }
          5% { clip: rect(12px, 9999px, 60px, 0); }
          10% { clip: rect(40px, 9999px, 18px, 0); }
          15% { clip: rect(82px, 9999px, 98px, 0); }
          20% { clip: rect(25px, 9999px, 75px, 0); }
          25% { clip: rect(50px, 9999px, 22px, 0); }
          30% { clip: rect(72px, 9999px, 50px, 0); }
          35% { clip: rect(10px, 9999px, 88px, 0); }
          40% { clip: rect(60px, 9999px, 45px, 0); }
          45% { clip: rect(20px, 9999px, 70px, 0); }
          50% { clip: rect(90px, 9999px, 5px, 0); }
          55% { clip: rect(35px, 9999px, 80px, 0); }
          60% { clip: rect(15px, 9999px, 65px, 0); }
          65% { clip: rect(75px, 9999px, 30px, 0); }
          70% { clip: rect(28px, 9999px, 92px, 0); }
          75% { clip: rect(55px, 9999px, 12px, 0); }
          80% { clip: rect(80px, 9999px, 40px, 0); }
          85% { clip: rect(5px, 9999px, 78px, 0); }
          90% { clip: rect(48px, 9999px, 32px, 0); }
          95% { clip: rect(68px, 9999px, 15px, 0); }
          100% { clip: rect(22px, 9999px, 85px, 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(85px, 9999px, 100px, 0); }
          5% { clip: rect(30px, 9999px, 70px, 0); }
          10% { clip: rect(5px, 9999px, 80px, 0); }
          15% { clip: rect(60px, 9999px, 20px, 0); }
          20% { clip: rect(95px, 9999px, 40px, 0); }
          25% { clip: rect(10px, 9999px, 55px, 0); }
          30% { clip: rect(70px, 9999px, 25px, 0); }
          35% { clip: rect(45px, 9999px, 90px, 0); }
          40% { clip: rect(82px, 9999px, 12px, 0); }
          45% { clip: rect(38px, 9999px, 78px, 0); }
          50% { clip: rect(18px, 9999px, 62px, 0); }
          55% { clip: rect(88px, 9999px, 35px, 0); }
          60% { clip: rect(42px, 9999px, 8px, 0); }
          65% { clip: rect(78px, 9999px, 48px, 0); }
          70% { clip: rect(20px, 9999px, 95px, 0); }
          75% { clip: rect(50px, 9999px, 10px, 0); }
          80% { clip: rect(80px, 9999px, 30px, 0); }
          85% { clip: rect(58px, 9999px, 88px, 0); }
          90% { clip: rect(25px, 9999px, 72px, 0); }
          95% { clip: rect(65px, 9999px, 18px, 0); }
          100% { clip: rect(92px, 9999px, 42px, 0); }
        }
        .glow {
          text-shadow: 0 0 5px #6d8ec5, 0 0 10px #6d8ec5, 0 0 15px #6d8ec5, 0 0 20px #6d8ec5;
        }
      `}</style>
      <h1 className="glitch" data-text="404" style={{
        fontSize: '10rem',
        fontWeight: 'bold',
        position: 'relative',
        textShadow: '0 0 5px #6d8ec5, 0 0 10px #6d8ec5',
      }}>404</h1>
      <p className="glow" style={{
        fontSize: '2rem',
        marginTop: '0',
        marginBottom: '2rem',
      }}>Page Not Found</p>
      <Link href="/" style={{
        padding: '1rem 2rem',
        border: '2px solid #6d8ec5',
        borderRadius: '5px',
        color: '#6d8ec5',
        textDecoration: 'none',
        fontSize: '1.5rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 5px #6d8ec5, 0 0 10px #6d8ec5 inset',
      }} onMouseOver={(e) => {
        e.currentTarget.style.background = '#6d8ec5';
        e.currentTarget.style.color = '#282b2b';
        e.currentTarget.style.boxShadow = '0 0 10px #f0c845, 0 0 15px #f0c845 inset';
      }} onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#6d8ec5';
        e.currentTarget.style.boxShadow = '0 0 5px #6d8ec5, 0 0 10px #6d8ec5 inset';
      }}>
        Go back home
      </Link>
    </div>
  );
}
