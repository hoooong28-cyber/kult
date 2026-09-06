import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface FreshnessBadgeProps {
  lastVerifiedDate: string;
  monthsAgo: number;
  isStale: boolean;
  badgeLabel: string;
  className?: string;
}

export default function FreshnessBadge({
  monthsAgo,
  isStale,
  badgeLabel,
  className = '',
}: FreshnessBadgeProps) {
  if (isStale) {
    // Faded badge for 3+ months stale verification
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800/60 text-stone-400 border border-stone-700/50 opacity-80 ${className}`}
        title="Verified over 3 months ago. Information may have changed."
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-500/80" />
        <span>{badgeLabel}</span>
      </span>
    );
  }

  // Fresh verification badge (< 3 months)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>{badgeLabel}</span>
    </span>
  );
}
