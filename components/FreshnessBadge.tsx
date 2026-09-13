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
  isStale,
  badgeLabel,
  className = '',
}: FreshnessBadgeProps) {
  if (isStale) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#f6f3ef] text-[#706F6C] border border-[#e5e2de] ${className}`}
        title="Verified over 3 months ago. Information may have changed."
      >
        <AlertCircle className="w-3.5 h-3.5 text-[#bf703a]" />
        <span>{badgeLabel}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#e6f4ea] text-[#137333] border border-[#ceead6] ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#137333]" />
      <span>{badgeLabel}</span>
    </span>
  );
}
