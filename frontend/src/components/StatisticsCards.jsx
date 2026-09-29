import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Percent } from 'lucide-react';

export default function StatisticsCards({ stats }) {
  const cards = [
    {
      title: 'Total Analyses',
      value: stats?.total_analyses ?? 0,
      icon: Activity,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      sub: 'Lifetime queries logged',
    },
    {
      title: 'Deepfakes Detected',
      value: stats?.deepfakes_detected ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20',
      sub: 'Flagged suspicious media',
    },
    {
      title: 'Real Media',
      value: stats?.real_media ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      sub: 'Likely authentic captures',
    },
    {
      title: 'Average Confidence',
      value: stats?.avg_confidence ? `${stats.avg_confidence}%` : '0%',
      icon: Percent,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20',
      sub: 'Mean detector certainty',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${card.border} ${card.bg} backdrop-blur-md shadow-lg transition-all hover:translate-y-[-2px]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {card.value}
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
