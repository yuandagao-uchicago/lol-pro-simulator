'use client';

import Image from 'next/image';
import { TEAM_LOGOS } from '@/lib/team-assets';

interface TeamLogoProps {
  shortName: string;
  teamId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TEAM_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  IG:  { bg: 'bg-white/10', text: 'text-white', border: 'border-white/30', glow: '0 0 12px rgba(255,255,255,0.15)' },
  FPX: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-400/30', glow: '0 0 12px rgba(239,68,68,0.2)' },
  T1:  { bg: 'bg-red-600/10', text: 'text-red-500', border: 'border-red-500/30', glow: '0 0 12px rgba(220,38,38,0.2)' },
  GEN: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-400/30', glow: '0 0 12px rgba(245,158,11,0.2)' },
  SKT: { bg: 'bg-red-600/10', text: 'text-red-500', border: 'border-red-500/30', glow: '0 0 12px rgba(220,38,38,0.2)' },
  SSG: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-400/30', glow: '0 0 12px rgba(59,130,246,0.2)' },
  DWG: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-400/30', glow: '0 0 12px rgba(14,165,233,0.2)' },
  EDG: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-400/30', glow: '0 0 12px rgba(249,115,22,0.2)' },
  RNG: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-400/30', glow: '0 0 12px rgba(234,179,8,0.2)' },
  G2:  { bg: 'bg-gray-300/10', text: 'text-gray-300', border: 'border-gray-300/30', glow: '0 0 12px rgba(209,213,219,0.15)' },
  BLG: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-400/30', glow: '0 0 12px rgba(6,182,212,0.2)' },
  WBG: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-400/30', glow: '0 0 12px rgba(168,85,247,0.2)' },
  BLU: { bg: 'bg-blue-accent/10', text: 'text-blue-accent', border: 'border-blue-accent/30', glow: '0 0 12px rgba(0,229,255,0.2)' },
  RED: { bg: 'bg-red-accent/10', text: 'text-red-accent', border: 'border-red-accent/30', glow: '0 0 12px rgba(255,32,96,0.2)' },
};

const SIZE_MAP = {
  sm: { box: 'w-8 h-8', text: 'text-[10px]', img: 24 },
  md: { box: 'w-12 h-12', text: 'text-sm', img: 40 },
  lg: { box: 'w-16 h-16', text: 'text-lg', img: 56 },
  xl: { box: 'w-24 h-24', text: 'text-2xl', img: 80 },
};

export default function TeamLogo({ shortName, teamId, size = 'md', className = '' }: TeamLogoProps) {
  const style = TEAM_COLORS[shortName] || { bg: 'bg-card-bg', text: 'text-foreground/60', border: 'border-card-border', glow: 'none' };
  const sizeStyle = SIZE_MAP[size];
  const logoUrl = teamId ? TEAM_LOGOS[teamId] : undefined;

  return (
    <div
      className={`${sizeStyle.box} ${style.bg} ${style.border} border flex items-center justify-center overflow-hidden ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        boxShadow: style.glow,
      }}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={shortName}
          width={sizeStyle.img}
          height={sizeStyle.img}
          className="w-[75%] h-[75%] object-contain"
          unoptimized
        />
      ) : (
        <span className={`font-mono font-extrabold ${style.text} ${sizeStyle.text} tracking-wider`}>
          {shortName}
        </span>
      )}
    </div>
  );
}
