import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface FreshnessBadgeProps {
  lastVerifiedDate: string;
  monthsAgo: number;
  isStale: boolean;
  isDemo?: boolean;
  isDiscovery?: boolean;
  badgeLabel: string;
  className?: string;
}

export default function FreshnessBadge({
  isStale,
  lastVerifiedDate,
  isDemo,
  isDiscovery,
  badgeLabel,
  className = '',
}: FreshnessBadgeProps) {
  if (isDiscovery) return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs border border-amber-500/30 text-amber-600 ${className}`}>발견한 공간 · 방문 미확인</span>;

  if (isDemo) {
    return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#f6f3ef] text-[#706F6C] border border-[#e5e2de] ${className}`} title="공유 목록에서 가져온 테스트 장소입니다. 방문 검증 전입니다.">테스트 장소</span>;
  }

  if (isStale) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#f6f3ef] text-[#706F6C] border border-[#e5e2de] ${className}`}
        title={lastVerifiedDate ? "Verified over 3 months ago. Information may have changed." : "운영 정보를 아직 확인하지 않았어요 · Operating details not yet verified"}
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
