/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export function Skeleton({ className = "", style = {}, ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
      style={style}
      {...props}
    />
  );
}

import { useMemo } from "react";

// Deterministic pseudo-random width based on line index for React purity
function getDeterministicWidth(i:any) {
  // Simple LCG: (a * i + c) % m, scaled to [0, 1)
  const a = 9301, c = 49297, m = 233280;
  const seed = (a * i + c) % m;
  const rand = seed / m;
  return 80 + rand * 20;
}

export function SkeletonText({ lines = 3, className = "", style = {} }) {
  return (
    <div className={className} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"
          style={{ width: `${getDeterministicWidth(i)}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 40, className = "", style = {} }) {
  return (
    <div
      className={`rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}
