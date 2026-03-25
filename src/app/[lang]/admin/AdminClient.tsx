"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { fetchGhats, fetchAlerts, type GhatData, type AlertData } from "@/lib/sheetsData";

const ADMIN_PASSWORD = "pushkar2025";

type CrowdLevel = "low" | "medium" | "high";
type Lang = "te" | "hi" | "en";

const translations = {
  te: {
    title: "అడ్మిన్ డాష్‌బోర్డ్",
    subtitle: "నిర్వహణ ప్యానెల్",
    ghats: "ఘాట్లు",
    alerts: "హెచ్చరికలు",
    crowd: "రద్దీ",
    password: "పాస్‌వర్డ్",
    login: "లాగిన్",
    logout: "లాగౌట్",
    wrongPassword: "తప్పు పాస్‌వర్డ్",
    openSheet: "Google Sheet తెరవండి",
    refreshData: "డేటా రిఫ్రెష్",
    lastRefresh: "చివరి రిఫ్రెష్",
    totalGhats: "మొత్తం ఘాట్లు",
    totalAlerts: "మొత్తం హెచ్చరికలు",
    activeAlerts: "చురుకు హెచ్చరికలు",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "ఎక్కువ",
  },
  hi: {
    title: "एडमिन डैशबोर्ड",
    subtitle: "प्रबंधन पैनल",
    ghats: "घाट",
    alerts: "अलर्ट",
    crowd: "भीड़",
    password: "पासवर्ड",
    login: "लॉगिन",
    logout: "लॉगआउट",
    wrongPassword: "गलत पासवर्ड",
    openSheet: "Google Sheet खोलें",
    refreshData: "डेटा रिफ्रेश",
    lastRefresh: "आखिरी रिफ्रेश",
    totalGhats: "कुल घाट",
    totalAlerts: "कुल अलर्ट",
    activeAlerts: "सक्रिय अलर्ट",
    low: "कम",
    medium: "मध्यम",
    high: "अधिक",
  },
  en: {
    title: "Admin Dashboard",
    subtitle: "Management Panel",
    ghats: "Ghats",
    alerts: "Alerts",
    crowd: "Crowd",
    password: "Password",
    login: "Login",
    logout: "Logout",
    wrongPassword: "Wrong password",
    openSheet: "Open Google Sheet",
    refreshData: "Refresh Data",
    lastRefresh: "Last refresh",
    totalGhats: "Total Ghats",
    totalAlerts: "Total Alerts",
    activeAlerts: "Active Alerts",
    low: "Low",
    medium: "Moderate",
    high: "High",
  },
};

const crowdColors: Record<CrowdLevel, { bg: string; text: string; dot: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export default function AdminClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "en";
  const t = translations[l];
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"ghats" | "alerts">("ghats");
  const [ghats, setGhats] = useState<GhatData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
      loadData();
    } else {
      setError(t.wrongPassword);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [ghatData, alertData] = await Promise.all([fetchGhats(), fetchAlerts()]);
    setGhats(ghatData);
    setAlerts(alertData);
    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved === "true") {
      setAuthenticated(true);
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticated) sessionStorage.setItem("admin_auth", "true");
  }, [authenticated]);

  const lowCount = ghats.filter((g) => g.crowd === "low").length;
  const medCount = ghats.filter((g) => g.crowd === "medium").length;
  const highCount = ghats.filter((g) => g.crowd === "high").length;
  const activeAlerts = alerts.filter((a) => a.active).length;

  // Login Screen
  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-godavari-50 px-6">
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{
            background: "linear-gradient(180deg, #0f2847 0%, #142f54 100%)",
            boxShadow: "0 25px 60px rgba(15,40,71,0.4)",
          }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-saffron-500/20 flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f99b07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold">{t.title}</h1>
            <p className="text-godavari-300 text-sm mt-1">{t.subtitle}</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder={t.password}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-saffron-500 transition-colors"
            />
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #f99b07, #dd7302)",
                boxShadow: "0 4px 15px rgba(249,155,7,0.3)",
              }}
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-godavari-50">
      {/* Header */}
      <header
        className="sticky top-0 z-30 safe-top"
        style={{
          background: "linear-gradient(135deg, #0f2847 0%, #1a3f6e 100%)",
          boxShadow: "0 2px 16px rgba(15,40,71,0.35)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">{t.title}</h1>
              <p className="text-godavari-300 text-xs">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => { setAuthenticated(false); sessionStorage.removeItem("admin_auth"); }}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20"
          >
            {t.logout}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 text-center border border-godavari-100">
            <p className="text-2xl font-bold text-godavari-700">{ghats.length}</p>
            <p className="text-[10px] font-semibold text-godavari-500">{t.totalGhats}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-godavari-100">
            <p className="text-2xl font-bold text-godavari-700">{alerts.length}</p>
            <p className="text-[10px] font-semibold text-godavari-500">{t.totalAlerts}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-godavari-100">
            <p className="text-2xl font-bold text-saffron-600">{activeAlerts}</p>
            <p className="text-[10px] font-semibold text-godavari-500">{t.activeAlerts}</p>
          </div>
        </div>

        {/* Crowd Summary */}
        <div className="flex gap-2">
          {([["low", lowCount], ["medium", medCount], ["high", highCount]] as [CrowdLevel, number][]).map(([level, count]) => {
            const c = crowdColors[level];
            return (
              <div key={level} className={clsx("flex-1 rounded-xl p-2.5 text-center", c.bg)}>
                <div className="flex items-center justify-center gap-1.5">
                  <span className={clsx("w-2.5 h-2.5 rounded-full", c.dot)} />
                  <span className={clsx("text-lg font-bold", c.text)}>{count}</span>
                </div>
                <p className={clsx("text-[10px] font-semibold", c.text)}>{t[level]}</p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1b5bae, #1c4d8f)" }}
          >
            {loading ? "..." : t.refreshData}
          </button>
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #f99b07, #dd7302)" }}
          >
            {t.openSheet}
          </a>
        </div>

        {lastRefresh && (
          <p className="text-[11px] text-godavari-400 text-center">
            {t.lastRefresh}: {lastRefresh}
          </p>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("ghats")}
            className={clsx(
              "flex-1 py-2 rounded-full text-sm font-semibold transition-all",
              tab === "ghats"
                ? "bg-godavari-700 text-white shadow-md"
                : "bg-white text-godavari-700 border border-godavari-200"
            )}
          >
            🛕 {t.ghats} ({ghats.length})
          </button>
          <button
            onClick={() => setTab("alerts")}
            className={clsx(
              "flex-1 py-2 rounded-full text-sm font-semibold transition-all",
              tab === "alerts"
                ? "bg-godavari-700 text-white shadow-md"
                : "bg-white text-godavari-700 border border-godavari-200"
            )}
          >
            📢 {t.alerts} ({alerts.length})
          </button>
        </div>

        {/* Ghats Tab — with crowd dropdown */}
        {tab === "ghats" && (
          <div className="space-y-2">
            {ghats.map((ghat) => {
              const c = crowdColors[ghat.crowd];
              return (
                <div key={ghat.id} className="bg-white rounded-xl p-3 border border-godavari-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">🛕</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-godavari-950 truncate">{ghat.name[l]}</p>
                        <p className="text-[11px] text-godavari-400">{ghat.distance}</p>
                      </div>
                    </div>
                    <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full", c.bg)}>
                      <span className={clsx("w-2 h-2 rounded-full", c.dot)} />
                      <span className={clsx("text-xs font-bold", c.text)}>{t[ghat.crowd]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Alerts Tab */}
        {tab === "alerts" && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  "bg-white rounded-xl p-3 border border-godavari-100",
                  !alert.active && "opacity-60"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg mt-0.5">
                    {alert.type === "crowd" ? "👥" : alert.type === "safety" ? "🛡️" : alert.type === "weather" ? "🌧️" : "📢"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-godavari-950 truncate">{alert.title[l]}</p>
                      <span
                        className={clsx(
                          "text-[10px] font-bold px-3 py-1 rounded-full flex-shrink-0",
                          alert.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {alert.active ? "ACTIVE" : "OFF"}
                      </span>
                    </div>
                    <p className="text-[12px] text-godavari-500 mt-0.5 line-clamp-2">{alert.message[l]}</p>
                    <p className="text-[10px] text-godavari-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
