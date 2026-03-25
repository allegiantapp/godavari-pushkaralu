"use client";

export function TempleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} fill="currentColor">
      {/* Main Gopuram/Temple Tower */}
      <path d="M100 10 L85 45 H115 Z" opacity="0.9" />
      <path d="M80 45 L70 80 H130 L120 45 Z" opacity="0.85" />
      <path d="M65 80 L55 120 H145 L135 80 Z" opacity="0.8" />
      {/* Temple Body */}
      <rect x="50" y="120" width="100" height="60" rx="2" opacity="0.75" />
      {/* Door */}
      <path d="M85 180 V150 Q85 140 100 140 Q115 140 115 150 V180 Z" opacity="0.5" />
      {/* Base/Steps */}
      <rect x="40" y="180" width="120" height="12" rx="2" opacity="0.7" />
      <rect x="30" y="192" width="140" height="12" rx="2" opacity="0.65" />
      <rect x="20" y="204" width="160" height="12" rx="2" opacity="0.6" />
      {/* Kalasam on top */}
      <circle cx="100" cy="8" r="5" opacity="0.9" />
      {/* Small towers on sides */}
      <path d="M55 90 L50 105 H60 Z" opacity="0.6" />
      <path d="M145 90 L140 105 H150 Z" opacity="0.6" />
    </svg>
  );
}

export function DiyaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className}>
      {/* Flame */}
      <path
        d="M30 8 Q25 18 22 22 Q18 28 22 32 Q26 36 30 34 Q34 36 38 32 Q42 28 38 22 Q35 18 30 8Z"
        fill="#ffd24a"
        opacity="0.9"
      />
      <path
        d="M30 14 Q27 20 26 24 Q24 28 27 30 Q29 32 30 30 Q31 32 33 30 Q36 28 34 24 Q33 20 30 14Z"
        fill="#ffbe20"
      />
      {/* Diya base */}
      <ellipse cx="30" cy="38" rx="14" ry="5" fill="#dd7302" />
      <path
        d="M16 38 Q16 46 22 48 L38 48 Q44 46 44 38"
        fill="#b74f06"
      />
      {/* Stand */}
      <rect x="27" y="48" width="6" height="4" fill="#943c0c" rx="1" />
      <ellipse cx="30" cy="54" rx="10" ry="3" fill="#943c0c" />
    </svg>
  );
}

export function WavePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M0,80 C240,40 480,100 720,80 C960,40 1200,100 1440,80 L1440,120 L0,120 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M0,95 C240,85 480,105 720,95 C960,85 1200,105 1440,95 L1440,120 L0,120 Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

export function OmSymbol({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontSize="70"
        fontFamily="serif"
        opacity="0.15"
      >
        ॐ
      </text>
    </svg>
  );
}

export function MandalaPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1">
      {/* Outer circles */}
      <circle cx="100" cy="100" r="95" />
      <circle cx="100" cy="100" r="85" />
      <circle cx="100" cy="100" r="70" />
      <circle cx="100" cy="100" r="55" />
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="25" />
      {/* Petal pattern */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + 25 * Math.cos(angle);
        const y1 = 100 + 25 * Math.sin(angle);
        const x2 = 100 + 90 * Math.cos(angle);
        const y2 = 100 + 90 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {/* Inner flower */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const cx = 100 + 45 * Math.cos(angle);
        const cy = 100 + 45 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="15" />;
      })}
    </svg>
  );
}

export function LotusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} fill="currentColor">
      {/* Center petal */}
      <path d="M40 5 Q35 20 30 30 Q35 35 40 32 Q45 35 50 30 Q45 20 40 5Z" opacity="0.9" />
      {/* Left petals */}
      <path d="M25 35 Q15 20 20 10 Q25 18 30 30 Q28 34 25 35Z" opacity="0.7" />
      <path d="M15 38 Q5 28 8 18 Q14 25 22 33 Q18 37 15 38Z" opacity="0.5" />
      {/* Right petals */}
      <path d="M55 35 Q65 20 60 10 Q55 18 50 30 Q52 34 55 35Z" opacity="0.7" />
      <path d="M65 38 Q75 28 72 18 Q66 25 58 33 Q62 37 65 38Z" opacity="0.5" />
      {/* Base */}
      <ellipse cx="40" cy="40" rx="25" ry="8" opacity="0.3" />
      {/* Water line */}
      <path d="M5 48 Q20 44 40 48 Q60 52 75 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}
