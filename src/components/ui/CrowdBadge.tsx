"use client";

import Badge from "./Badge";

type CrowdLevel = "low" | "medium" | "high";

interface CrowdBadgeProps {
  level: CrowdLevel;
  label?: string;
  size?: "sm" | "md";
}

const crowdConfig: Record<CrowdLevel, { variant: "success" | "warning" | "danger"; text: string }> = {
  low: { variant: "success", text: "Low Crowd" },
  medium: { variant: "warning", text: "Moderate" },
  high: { variant: "danger", text: "Crowded" },
};

export default function CrowdBadge({ level, label, size = "sm" }: CrowdBadgeProps) {
  const config = crowdConfig[level];
  return (
    <Badge variant={config.variant} size={size} dot>
      {label || config.text}
    </Badge>
  );
}
