import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export const PIPELINE_STEPS = [
  { step: 1, title: 'File Validation', desc: 'Format check, size verification & sanitization' },
  { step: 2, title: 'Pre-processing', desc: 'Aspect normalization & color channel scaling' },
  { step: 3, title: 'Face Detection', desc: 'Haar Cascade facial ROI localization' },
  { step: 4, title: 'Feature Extraction', desc: 'ELA, 2D FFT, Laplacian gradient & noise' },
  { step: 5, title: 'AI/ML Detection', desc: 'Baseline multi-factor forensic fusion' },
  { step: 6, title: 'Confidence Calculation', desc: 'Probabilistic certainty & risk assessment' },
  { step: 7, title: 'Explanation Generation', desc: 'Plain-English forensic explainability' },
  { step: 8, title: 'Report Generation', desc: 'Database commit & PDF report caching' },
];

export default function PipelineProgress({ currentStep = 0, isFinished = false }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Forensic Analysis Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active 8-Stage Deepfake Detection & Feature Decomposition
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/40">
            {isFinished ? 'COMPLETED' : `STAGE ${Math.min(currentStep, 8)} / 8`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PIPELINE_STEPS.map((item) => {
          let status = 'pending';
          if (isFinished || currentStep > item.step) {
            status = 'completed';
          } else if (currentStep === item.step) {
            status = 'processing';
          }

          return (
            <div
              key={item.step}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : status === 'processing'
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5 shrink-0">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : status === 'processing' ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Step {item.step}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        status === 'completed'
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : status === 'processing'
                          ? 'text-cyan-300 bg-cyan-950/80 animate-pulse'
                          : 'text-slate-500 bg-slate-900'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
