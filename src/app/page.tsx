"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GodavariSunsetScene } from "@/components/icons/GodavariScene";

function detectLanguage(): string {
  if (typeof window === "undefined") return "te";
  const saved = localStorage.getItem("godavari-lang");
  if (saved) return saved;
  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("hi")) return "hi";
  if (browserLang.startsWith("en")) return "en";
  return "te";
}

export default function SplashScreen() {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage progression
    const t1 = setTimeout(() => setStage(1), 100); // Om appears
    const t2 = setTimeout(() => setStage(2), 1200); // Scene reveals
    const t3 = setTimeout(() => setStage(3), 2200); // Title appears
    const t4 = setTimeout(() => setStage(4), 3800); // Fade out
    const t5 = setTimeout(() => {
      const lang = detectLanguage();
      router.replace(`/${lang}`);
    }, 4500); // Redirect

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [router]);

  return (
    <div
      className="flex-1 flex flex-col min-h-dvh relative overflow-hidden transition-opacity duration-700"
      style={{
        opacity: stage === 4 ? 0 : 1,
        background: "#1a0a2e",
      }}
    >
      {/* ===== SUNSET SCENE BACKGROUND ===== */}
      <div
        className="absolute inset-0 transition-opacity duration-[1500ms] ease-out"
        style={{ opacity: stage >= 2 ? 1 : 0 }}
      >
        <GodavariSunsetScene className="w-full h-full" />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          background: `
            linear-gradient(180deg,
              rgba(26,10,46,0.5) 0%,
              rgba(26,10,46,0.15) 20%,
              transparent 40%,
              transparent 60%,
              rgba(26,10,46,0.2) 80%,
              rgba(26,10,46,0.6) 100%
            )
          `,
        }}
      />

      {/* ===== CONTENT LAYERS ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* ===== STAGE 1: Om Symbol ===== */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: stage >= 1 && stage < 3 ? 1 : 0,
            transition: "opacity 800ms ease, transform 1000ms ease",
            transform:
              stage >= 2
                ? "translateY(-120px) scale(0.5)"
                : "translateY(0) scale(1)",
          }}
        >
          {/* Radial glow behind Om */}
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(255,183,77,0.25) 0%, rgba(255,152,0,0.1) 40%, transparent 70%)",
              opacity: stage >= 1 ? 1 : 0,
              transition: "opacity 1000ms ease",
            }}
          />

          {/* Expanding rings */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: `${80 + ring * 40}px`,
                height: `${80 + ring * 40}px`,
                borderColor: `rgba(255,183,77,${0.15 - ring * 0.04})`,
                opacity: stage >= 1 ? 1 : 0,
                transition: `opacity ${600 + ring * 200}ms ease`,
                animation:
                  stage >= 1
                    ? `sacred-pulse ${2 + ring * 0.5}s ease-in-out infinite`
                    : "none",
                animationDelay: `${ring * 0.3}s`,
              }}
            />
          ))}

          {/* Om symbol */}
          <span
            className="relative font-serif select-none"
            style={{
              fontSize: "100px",
              color: "#ffb74d",
              textShadow:
                "0 0 40px rgba(255,183,77,0.5), 0 0 80px rgba(255,152,0,0.3), 0 0 120px rgba(230,81,0,0.15)",
              opacity: stage >= 1 ? 1 : 0,
              transition: "opacity 800ms ease",
              lineHeight: 1,
            }}
          >
            ॐ
          </span>
        </div>

        {/* ===== STAGE 2: Sacred Diya/Kalasam ===== */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            top: "22%",
            opacity: stage >= 2 && stage < 4 ? 1 : 0,
            transform: stage >= 2 ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 800ms ease 200ms, transform 800ms ease 200ms",
          }}
        >
          {/* Glowing diya */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: "rgba(255,183,77,0.3)",
                transform: "scale(2.5)",
              }}
            />
            <svg
              width="48"
              height="48"
              viewBox="0 0 60 60"
              className="relative z-10"
            >
              {/* Flame */}
              <path
                d="M30 6 Q24 18 21 24 Q17 30 22 34 Q26 38 30 35 Q34 38 38 34 Q43 30 39 24 Q36 18 30 6Z"
                fill="#ffd24a"
                opacity="0.95"
              >
                <animate
                  attributeName="d"
                  values="M30 6 Q24 18 21 24 Q17 30 22 34 Q26 38 30 35 Q34 38 38 34 Q43 30 39 24 Q36 18 30 6Z;M30 4 Q23 16 20 23 Q16 30 22 35 Q27 39 30 36 Q33 39 38 35 Q44 30 40 23 Q37 16 30 4Z;M30 6 Q24 18 21 24 Q17 30 22 34 Q26 38 30 35 Q34 38 38 34 Q43 30 39 24 Q36 18 30 6Z"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M30 14 Q27 22 26 26 Q24 30 27 32 Q29 34 30 32 Q31 34 33 32 Q36 30 34 26 Q33 22 30 14Z"
                fill="#fff9c4"
              />
              {/* Diya base */}
              <ellipse cx="30" cy="40" rx="13" ry="5" fill="#dd7302" />
              <path
                d="M17 40 Q17 48 23 50 L37 50 Q43 48 43 40"
                fill="#b74f06"
              />
              <ellipse cx="30" cy="52" rx="9" ry="2.5" fill="#943c0c" />
            </svg>
          </div>
        </div>

        {/* ===== STAGE 3: Title & Branding ===== */}
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {/* Spacer to push title to right position */}
          <div style={{ height: "60px" }} />

          {/* Telugu title */}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fff",
              textShadow:
                "0 2px 24px rgba(230,81,0,0.5), 0 1px 4px rgba(0,0,0,0.6)",
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 700ms ease, transform 700ms ease",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            గోదావరి పుష్కరాలు
          </h1>

          {/* Lotus divider */}
          <div
            className="flex items-center justify-center gap-2 my-3"
            style={{
              opacity: stage >= 3 ? 1 : 0,
              transition: "opacity 600ms ease 300ms",
            }}
          >
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,204,128,0.6))",
              }}
            />
            <svg width="22" height="14" viewBox="0 0 24 16" opacity={0.8}>
              <path
                d="M12,1 Q9,5 7,8 Q9,10 12,9 Q15,10 17,8 Q15,5 12,1Z"
                fill="#ffcc80"
              />
              <path
                d="M6,10 Q2,6 4,3 Q6,6 8,9 Q7,10 6,10Z"
                fill="#ffcc80"
                opacity="0.6"
              />
              <path
                d="M18,10 Q22,6 20,3 Q18,6 16,9 Q17,10 18,10Z"
                fill="#ffcc80"
                opacity="0.6"
              />
            </svg>
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,204,128,0.6), transparent)",
              }}
            />
          </div>

          {/* English subtitle */}
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase" as const,
              color: "rgba(255,224,178,0.9)",
              textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 600ms ease 200ms, transform 600ms ease 200ms",
            }}
          >
            Godavari Pushkaralu
          </h2>

          {/* Tagline */}
          <p
            style={{
              fontSize: "10px",
              marginTop: "6px",
              letterSpacing: "0.15em",
              color: "rgba(255,204,128,0.45)",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              opacity: stage >= 3 ? 1 : 0,
              transition: "opacity 500ms ease 500ms",
            }}
          >
            Smart Pilgrim Assistance
          </p>
        </div>

        {/* ===== Bottom: Location ===== */}
        <div
          className="text-center pb-8"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transition: "opacity 500ms ease 600ms",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              color: "rgba(255,204,128,0.3)",
            }}
          >
            Rajahmundry, Andhra Pradesh
          </p>
          <p
            style={{
              fontSize: "8px",
              marginTop: "3px",
              letterSpacing: "0.12em",
              color: "rgba(255,204,128,0.18)",
            }}
          >
            Government of Andhra Pradesh
          </p>

          {/* Loading dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(255,183,77,0.4)",
                  animation: "sacred-pulse 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
