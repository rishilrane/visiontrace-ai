import React from 'react';

export default function ConfidenceMeter({ confidence = 0, isManipulated = false }) {
  const percentage = Math.min(100, Math.max(0, Math.round(confidence * 10) / 10));
  
  // Circumference for 80px radius circle
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = isManipulated
    ? 'text-rose-500 stroke-rose-500'
    : 'text-emerald-500 stroke-emerald-500';

  const glowClass = isManipulated
    ? 'drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]'
    : 'drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transform"
        >
          {/* Track background */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            className="text-slate-800"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress bar */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            className={`${colorClass} ${glowClass}`}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center numeric label */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black font-mono tracking-tight text-white">
            {percentage}%
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Confidence
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="text-xs text-slate-400">Detection Certainty Meter</span>
        <div className="flex items-center justify-between text-[10px] text-slate-500 w-36 mt-1 font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
