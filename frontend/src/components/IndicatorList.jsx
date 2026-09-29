import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function IndicatorList({ indicators = [] }) {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
        No indicators recorded.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {indicators.map((ind, index) => {
        const isAnomaly = ind.status === 'anomaly';
        const isInfo = ind.status === 'info';
        
        let borderClass = 'border-slate-800 bg-slate-900/40';
        let badgeBg = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (isAnomaly) {
          borderClass = ind.severity === 'high'
            ? 'border-rose-500/30 bg-rose-950/20'
            : 'border-amber-500/30 bg-amber-950/20';
          badgeBg = ind.severity === 'high'
            ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
            : 'bg-amber-950/80 text-amber-400 border-amber-800/60';
          Icon = ind.severity === 'high' ? AlertOctagon : AlertTriangle;
          iconColor = ind.severity === 'high' ? 'text-rose-400' : 'text-amber-400';
        } else if (isInfo) {
          borderClass = 'border-blue-500/20 bg-blue-950/20';
          badgeBg = 'bg-blue-950/80 text-blue-400 border-blue-800/40';
          Icon = Info;
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all ${borderClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 min-w-0">
                <div className="mt-0.5 shrink-0">
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                    <span>{ind.name}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${badgeBg}`}>
                  {isAnomaly ? `${ind.severity} anomaly` : ind.status}
                </span>
                {ind.score !== undefined && ind.score !== null && (
                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    Index: {Number(ind.score).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
