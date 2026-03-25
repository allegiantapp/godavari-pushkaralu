"use client";

const ministers = [
  {
    title: "HON'BLE CHIEF MINISTER",
    name: "Sri. N. Chandrababu Naidu",
    image: "/images/officials/cm.png",
  },
  {
    title: "HON'BLE DEPUTY CM",
    name: "Sri. K. Pawan Kalyan",
    image: "/images/officials/dcm.png",
  },
  {
    title: "MINISTER FOR TOURISM",
    name: "Sri. Kandula Durgesh",
    image: "/images/officials/tourism.png",
  },
  {
    title: "MINISTER FOR ENDOWMENTS",
    name: "Sri. Anam Ramanarayana Reddy",
    image: "/images/officials/endowments.png",
  },
];

export default function GovHeader() {
  return (
    <div
      className="w-full relative z-20 safe-top animate-fade-in-up"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,248,235,0.88) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,183,77,0.2)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top thin saffron-white-green tricolor line */}
      <div className="flex w-full h-[3px]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Row 1: Logos + Government text */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
        {/* AP Government Emblem */}
        <div className="flex items-center gap-2">
          {/* Ashoka-style emblem placeholder — replace with actual /images/officials/ap-emblem.png */}
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0">
            <img
              src="/images/officials/ap-emblem.png"
              alt="AP Government"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `<svg viewBox="0 0 40 40" class="w-full h-full"><circle cx="20" cy="20" r="19" fill="#FFF8E1" stroke="#C88B2E" stroke-width="1.5"/><circle cx="20" cy="20" r="14" fill="none" stroke="#C88B2E" stroke-width="0.8"/><text x="20" y="24" text-anchor="middle" font-size="10" fill="#C88B2E" font-weight="bold">AP</text></svg>`;
              }}
            />
          </div>
          <div className="leading-none">
            <p
              className="text-[7px] font-bold tracking-[0.08em] uppercase"
              style={{ color: "#5D4037" }}
            >
              Government of
            </p>
            <p
              className="text-[9px] font-bold tracking-[0.04em]"
              style={{ color: "#33291A" }}
            >
              Andhra Pradesh
            </p>
          </div>
        </div>

        {/* APTDC Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-[30px] h-[30px] rounded overflow-hidden flex-shrink-0">
            <img
              src="/images/officials/aptdc.png"
              alt="APTDC"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `<svg viewBox="0 0 40 40" class="w-full h-full"><rect width="40" height="40" rx="4" fill="#FFF8E1" stroke="#2E7D32" stroke-width="1"/><text x="20" y="16" text-anchor="middle" font-size="6" fill="#2E7D32" font-weight="bold">AP</text><text x="20" y="26" text-anchor="middle" font-size="6" fill="#E65100" font-weight="bold">TDC</text></svg>`;
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Ministers — horizontally scrollable */}
      <div className="overflow-x-auto hide-scrollbar">
        <div
          className="flex gap-0 px-2 pb-2 pt-0.5"
          style={{ minWidth: "max-content" }}
        >
          {ministers.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2"
              style={{
                borderRight:
                  i < ministers.length - 1
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "none",
              }}
            >
              {/* Portrait circle */}
              <div
                className="w-[28px] h-[28px] rounded-full overflow-hidden flex-shrink-0"
                style={{
                  border: "1.5px solid rgba(200,139,46,0.4)",
                  background: "#FFF8E1",
                }}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `<svg viewBox="0 0 40 40" class="w-full h-full"><circle cx="20" cy="20" r="20" fill="#FFF3E0"/><circle cx="20" cy="16" r="7" fill="#BCAAA4"/><path d="M6,38 Q6,28 20,26 Q34,28 34,38" fill="#BCAAA4"/></svg>`;
                  }}
                />
              </div>
              {/* Title & name */}
              <div className="leading-none min-w-0">
                <p
                  className="text-[5.5px] font-bold tracking-[0.05em] uppercase whitespace-nowrap"
                  style={{ color: "#8D6E63" }}
                >
                  {m.title}
                </p>
                <p
                  className="text-[7px] font-semibold whitespace-nowrap"
                  style={{ color: "#3E2723" }}
                >
                  {m.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom thin gold line */}
      <div
        className="h-[1px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(200,139,46,0.3) 30%, rgba(200,139,46,0.3) 70%, transparent 95%)",
        }}
      />
    </div>
  );
}
