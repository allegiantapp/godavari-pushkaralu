"use client";

export function GodavariSunsetScene({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 430 900"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dramatic sunset sky */}
        <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="12%" stopColor="#2d1452" />
          <stop offset="25%" stopColor="#6b2fa0" stopOpacity="0.8" />
          <stop offset="38%" stopColor="#c2185b" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#e65100" stopOpacity="0.7" />
          <stop offset="62%" stopColor="#f57c00" />
          <stop offset="72%" stopColor="#ff9800" />
          <stop offset="82%" stopColor="#ffb74d" />
          <stop offset="92%" stopColor="#ffe0b2" />
          <stop offset="100%" stopColor="#fff8e1" />
        </linearGradient>

        {/* Sun glow */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="30%" stopColor="#ffecb3" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ff9800" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff6f00" stopOpacity="0" />
        </radialGradient>

        {/* Warm water */}
        <linearGradient id="warmWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e65100" stopOpacity="0.5" />
          <stop offset="20%" stopColor="#bf360c" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#4a148c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1a0a2e" stopOpacity="0.7" />
        </linearGradient>

        {/* Golden reflection streak */}
        <linearGradient id="goldReflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffcc02" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ff9800" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e65100" stopOpacity="0.1" />
        </linearGradient>

        {/* Silhouette color */}
        <linearGradient id="silhouetteGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0520" />
          <stop offset="100%" stopColor="#2a0a30" />
        </linearGradient>
      </defs>

      {/* ===== SKY ===== */}
      <rect width="430" height="900" fill="url(#sunsetSky)" />

      {/* Wispy clouds catching sunset light */}
      <ellipse cx="80" cy="120" rx="90" ry="12" fill="#c2185b" opacity="0.12" />
      <ellipse cx="320" cy="100" rx="70" ry="8" fill="#e040fb" opacity="0.08" />
      <ellipse cx="200" cy="160" rx="120" ry="10" fill="#f4511e" opacity="0.1" />
      <ellipse cx="350" cy="180" rx="80" ry="6" fill="#ff7043" opacity="0.12" />
      <ellipse cx="60" cy="200" rx="60" ry="7" fill="#ff8a65" opacity="0.1" />
      <ellipse cx="250" cy="220" rx="100" ry="9" fill="#ffab40" opacity="0.15" />
      <ellipse cx="120" cy="260" rx="80" ry="8" fill="#ffcc80" opacity="0.12" />
      <ellipse cx="370" cy="250" rx="60" ry="5" fill="#ffab40" opacity="0.1" />

      {/* ===== SUN ===== */}
      <circle cx="215" cy="410" r="80" fill="url(#sunGlow)" />
      <circle cx="215" cy="410" r="32" fill="#fff9c4" opacity="0.95" />
      <circle cx="215" cy="410" r="26" fill="#ffffff" opacity="0.7" />

      {/* Sun rays */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 215 + 36 * Math.cos(angle);
        const y1 = 410 + 36 * Math.sin(angle);
        const x2 = 215 + (55 + (i % 3) * 15) * Math.cos(angle);
        const y2 = 410 + (55 + (i % 3) * 15) * Math.sin(angle);
        return (
          <line
            key={`ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#fff9c4"
            strokeWidth={i % 2 === 0 ? "1" : "0.5"}
            opacity={0.15 - (i % 3) * 0.03}
          />
        );
      })}

      {/* ===== DISTANT TREELINE / HILLS ===== */}
      <path
        d="M0,420 Q30,412 60,416 Q90,408 120,414 Q150,406 180,412 Q210,404 240,410 Q270,405 300,412 Q330,407 360,414 Q390,409 420,416 L430,418 L430,440 L0,440 Z"
        fill="#1a0520"
        opacity="0.7"
      />

      {/* ===== LEFT BANK - TEMPLE & MANDAP ===== */}
      {/* Large Temple Gopuram - left side */}
      <g fill="#1a0520">
        {/* Gopuram tower */}
        <path d="M10,380 L30,320 L35,315 L42,310 L50,320 L70,380 Z" />
        {/* Tier decorations */}
        <rect x="25" y="330" width="30" height="3" opacity="0.5" />
        <rect x="22" y="345" width="36" height="3" opacity="0.5" />
        <rect x="18" y="360" width="44" height="3" opacity="0.5" />
        {/* Kalasam on top */}
        <circle cx="42" cy="307" r="4" />
        <line x1="42" y1="303" x2="42" y2="297" stroke="#1a0520" strokeWidth="2" />
        <circle cx="42" cy="295" r="2.5" />
        {/* Temple body */}
        <rect x="5" y="380" width="70" height="45" />
        {/* Arched doorway */}
        <path d="M28,425 V400 Q28,390 42,390 Q56,390 56,400 V425 Z" fill="#2a0a30" />
      </g>

      {/* Mandap / Pavilion (like in inspiration photo 1) */}
      <g fill="#1a0520" transform="translate(75, 0)">
        {/* Dome */}
        <path d="M20,390 Q35,365 50,390 Z" />
        <circle cx="35" cy="363" r="3" />
        {/* Pillars */}
        <rect x="22" y="390" width="4" height="35" />
        <rect x="44" y="390" width="4" height="35" />
        <rect x="33" y="390" width="4" height="35" />
        {/* Base */}
        <rect x="18" y="425" width="34" height="6" />
      </g>

      {/* Small shrine near water */}
      <g fill="#1a0520" transform="translate(130, 0)">
        <path d="M0,415 L10,400 L20,415 Z" />
        <rect x="2" y="415" width="16" height="10" />
        {/* Flag */}
        <line x1="10" y1="400" x2="10" y2="388" stroke="#1a0520" strokeWidth="1.5" />
        <path d="M10,388 L18,392 L10,395 Z" fill="#e65100" opacity="0.5" />
      </g>

      {/* ===== RIGHT BANK - BUILDINGS ===== */}
      <g fill="#1a0520">
        {/* Small temple */}
        <path d="M370,395 L385,365 L400,395 Z" />
        <circle cx="385" cy="362" r="3" />
        <rect x="372" y="395" width="26" height="30" />

        {/* Building blocks */}
        <rect x="395" y="388" width="35" height="37" />
        <rect x="400" y="383" width="25" height="5" />

        {/* Trees on right bank */}
        <circle cx="360" cy="400" r="12" opacity="0.8" />
        <rect x="358" y="412" width="4" height="13" opacity="0.8" />
      </g>

      {/* ===== GHAT STEPS - LEFT SIDE ===== */}
      <g fill="#1a0520" opacity="0.9">
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <rect
            key={`lstep-${step}`}
            x={0}
            y={425 + step * 6}
            width={155 - step * 12}
            height="6"
            opacity={0.95 - step * 0.05}
          />
        ))}
      </g>

      {/* ===== GHAT STEPS - RIGHT SIDE ===== */}
      <g fill="#1a0520" opacity="0.9">
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <rect
            key={`rstep-${step}`}
            x={320 + step * 10}
            y={425 + step * 6}
            width={110 - step * 10}
            height="6"
            opacity={0.95 - step * 0.05}
          />
        ))}
      </g>

      {/* ===== THE ICONIC ARCH BRIDGE ===== */}
      <g opacity="0.85">
        {/* Bridge deck */}
        <rect x="0" y="430" width="430" height="5" fill="#1a0520" />

        {/* Arch spans - the distinctive Rajahmundry arches */}
        {[
          { x: 155, w: 55 },
          { x: 210, w: 50 },
          { x: 260, w: 55 },
        ].map((arch, i) => (
          <g key={`bridgearch-${i}`}>
            <path
              d={`M${arch.x},430 Q${arch.x + arch.w / 2},${395 - i * 2} ${arch.x + arch.w},430`}
              fill="none"
              stroke="#1a0520"
              strokeWidth="3.5"
            />
            {/* Cross-bracing */}
            <path
              d={`M${arch.x + arch.w * 0.25},${418} Q${arch.x + arch.w / 2},${405} ${arch.x + arch.w * 0.75},${418}`}
              fill="none"
              stroke="#1a0520"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Vertical hangers */}
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((p, j) => {
              const bx = arch.x + arch.w * p;
              const t = Math.sin(p * Math.PI);
              const archY = 430 - t * 35;
              return (
                <line
                  key={`hanger-${i}-${j}`}
                  x1={bx}
                  y1={archY}
                  x2={bx}
                  y2={430}
                  stroke="#1a0520"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}
          </g>
        ))}

        {/* Bridge pillars */}
        {[155, 210, 260, 315].map((x, i) => (
          <rect
            key={`bpillar-${i}`}
            x={x - 4}
            y={430}
            width="8"
            height="30"
            fill="#1a0520"
            opacity="0.7"
          />
        ))}
      </g>

      {/* ===== PILGRIM SILHOUETTES ===== */}
      {/* People on left ghat steps */}
      {[
        { x: 30, y: 418, s: 1 },
        { x: 50, y: 420, s: 0.9 },
        { x: 70, y: 416, s: 1.1 },
        { x: 95, y: 422, s: 0.85 },
        { x: 115, y: 428, s: 0.8 },
        { x: 42, y: 424, s: 0.7 },
      ].map((p, i) => (
        <g key={`pilgrim-${i}`} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`} fill="#1a0520" opacity={0.75 - i * 0.04}>
          <circle cx="0" cy="-10" r="2.5" />
          <path d="M0,-7.5 L0,0 M-3.5,-4 L3.5,-4 M0,0 L-2.5,7 M0,0 L2.5,7" stroke="#1a0520" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      {/* Person bathing - half in water */}
      <g transform="translate(140, 448)" fill="#1a0520" opacity="0.5">
        <circle cx="0" cy="-8" r="2.5" />
        <path d="M0,-5.5 L0,0 M-4,-2 L0,0 L4,-2" stroke="#1a0520" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* People on right ghat */}
      {[
        { x: 345, y: 420, s: 0.85 },
        { x: 365, y: 424, s: 0.9 },
        { x: 385, y: 418, s: 0.8 },
      ].map((p, i) => (
        <g key={`rpilgrim-${i}`} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`} fill="#1a0520" opacity={0.6 - i * 0.05}>
          <circle cx="0" cy="-10" r="2.5" />
          <path d="M0,-7.5 L0,0 M-3.5,-4 L3.5,-4 M0,0 L-2.5,7 M0,0 L2.5,7" stroke="#1a0520" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      {/* ===== BOATS ===== */}
      {/* Boat near left bank */}
      <g transform="translate(170, 465)" opacity="0.5">
        <path d="M-15,3 Q-10,-3 0,-4 Q10,-3 15,3 Q7,6 -7,6 Z" fill="#1a0520" />
        <circle cx="0" cy="-8" r="2" fill="#1a0520" />
        <path d="M0,-6 L0,-2" stroke="#1a0520" strokeWidth="1.2" />
        <line x1="8" y1="-2" x2="18" y2="5" stroke="#1a0520" strokeWidth="1" />
      </g>

      {/* Boat near right */}
      <g transform="translate(300, 458)" opacity="0.4">
        <path d="M-12,2 Q-8,-2 0,-3 Q8,-2 12,2 Q5,5 -5,5 Z" fill="#1a0520" />
        <line x1="0" y1="-3" x2="0" y2="-14" stroke="#1a0520" strokeWidth="1" />
        <path d="M0,-14 L8,-10 L0,-7 Z" fill="#1a0520" opacity="0.6" />
      </g>

      {/* ===== RIVER ===== */}
      <path
        d="M0,455 Q80,450 160,458 Q240,448 320,455 Q380,450 430,456 L430,900 L0,900 Z"
        fill="url(#warmWater)"
      />

      {/* Golden sun reflection on water */}
      <path
        d="M185,456 Q195,470 190,500 Q200,530 195,560 Q205,590 200,620 Q210,650 205,680 Q215,710 210,740 L220,740 Q225,710 215,680 Q220,650 215,620 Q225,590 220,560 Q215,530 225,500 Q220,470 230,456 Z"
        fill="url(#goldReflection)"
        opacity="0.5"
      />

      {/* Wider soft glow on water from sun */}
      <ellipse cx="215" cy="500" rx="80" ry="40" fill="#ff9800" opacity="0.08" />
      <ellipse cx="215" cy="560" rx="60" ry="30" fill="#ff9800" opacity="0.06" />
      <ellipse cx="215" cy="620" rx="50" ry="25" fill="#ff6f00" opacity="0.04" />

      {/* Water shimmer lines */}
      {[465, 480, 495, 510, 530, 550, 575, 600, 630, 660].map((y, i) => (
        <g key={`shimmer-${i}`} opacity={0.15 - i * 0.012}>
          <path
            d={`M${20 + i * 8},${y} Q${80 + i * 5},${y - 2} ${150},${y + 1} Q${215},${y - 1} ${280},${y + 2} Q${350 - i * 3},${y - 1} ${410 - i * 6},${y}`}
            fill="none"
            stroke="#ffcc80"
            strokeWidth="0.8"
          />
        </g>
      ))}

      {/* ===== FLOATING DIYAS ON WATER ===== */}
      {[
        { x: 60, y: 475 },
        { x: 150, y: 488 },
        { x: 260, y: 478 },
        { x: 340, y: 490 },
        { x: 100, y: 510 },
        { x: 310, y: 515 },
        { x: 190, y: 530 },
        { x: 380, y: 505 },
      ].map((d, i) => (
        <g key={`fdiya-${i}`} transform={`translate(${d.x}, ${d.y})`} opacity={0.6 - i * 0.05}>
          {/* Glow */}
          <circle cx="0" cy="0" r="8" fill="#ffcc02" opacity="0.2" />
          <circle cx="0" cy="0" r="4" fill="#ffcc02" opacity="0.15" />
          {/* Leaf plate */}
          <ellipse cx="0" cy="2" rx="4" ry="1.8" fill="#2e7d32" opacity="0.5" />
          {/* Flame */}
          <path d="M0,-5 Q-1.5,-2 -1,1 Q0,2.5 1,1 Q1.5,-2 0,-5Z" fill="#ffeb3b" opacity="0.9" />
          <path d="M0,-3.5 Q-0.8,-1.5 -0.5,0.5 Q0,1.5 0.5,0.5 Q0.8,-1.5 0,-3.5Z" fill="#fff9c4" />
        </g>
      ))}

      {/* Bridge reflection in water (inverted, faded) */}
      <g opacity="0.08" transform="translate(0, 460) scale(1, 0.4)">
        <rect x="0" y="0" width="430" height="4" fill="#ffcc80" />
        {[155, 210, 260, 315].map((x, i) => (
          <rect key={`bref-${i}`} x={x - 3} y="0" width="6" height="40" fill="#ffcc80" opacity="0.5" />
        ))}
      </g>
    </svg>
  );
}
