import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ level = 'LOW', size = 'md' }) {
  const normalized = (level || 'LOW').toUpperCase();

  const configs = {
    LOW: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      icon: ShieldCheck,
      label: 'LOW RISK',
    },
    MEDIUM: {
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/10',
      icon: AlertTriangle,
      label: 'MEDIUM RISK',
    },
    HIGH: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/10',
      icon: AlertOctagon,
      label: 'HIGH RISK',
    },
  };

  const config = configs[normalized] || configs.LOW;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-1' 
    : size === 'lg' 
    ? 'text-base px-4 py-2 font-bold' 
    : 'text-sm px-3 py-1.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-md ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClasses}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span className="font-mono tracking-wider">{config.label}</span>
    </span>
  );
}
