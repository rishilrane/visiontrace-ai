import React, { useState } from 'react';
import { Film, AlertTriangle, CheckCircle2, Clock, Activity, Calendar } from 'lucide-react';

export default function VideoFrameViewer({
  videoPath,
  keyframePath,
  metadata = {},
  frameDetails = [],
  suspiciousCount = 0,
}) {
  const [selectedFrame, setSelectedFrame] = useState(null);

  const totalFrames = frameDetails.length;

  return (
    <div className="space-y-6">
      {/* Video Preview & Metadata Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Video Playback Inspection</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">
              {metadata.resolution || 'Auto'} • {metadata.fps || 25} FPS
            </span>
          </div>

          <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[380px] border border-slate-800/80">
            <video
              src={videoPath}
              controls
              className="max-h-[380px] w-full object-contain"
            />
          </div>

          {keyframePath && (
            <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Representative Forensic Keyframe:</span>
              <a
                href={keyframePath}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-mono text-[11px]"
              >
                Inspect Annotated Keyframe ↗
              </a>
            </div>
          )}
        </div>

        {/* Video Forensic Stats */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Temporal Inspection Metrics</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-100 font-semibold">{metadata.duration_seconds || 0}s</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Total Video Frames:</span>
                <span className="text-slate-100 font-semibold">{metadata.total_frames || 0}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Sampled Keyframes:</span>
                <span className="text-cyan-400 font-semibold">{totalFrames} frames</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Suspicious Frames:</span>
                <span className={`font-semibold ${suspiciousCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {suspiciousCount} / {totalFrames}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Sampling Ratio:</span>
                <span className="text-slate-300">
                  {metadata.total_frames && totalFrames > 0
                    ? `1 frame every ${Math.round(metadata.total_frames / totalFrames)} frames`
                    : 'Adaptive'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            Inter-frame temporal analysis tracks facial landmark displacement and skin texture continuity across sampled moments.
          </div>
        </div>
      </div>

      {/* Frame Timeline Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <h4 className="text-sm font-bold text-slate-100 mb-3 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Sampled Frames Timeline</span>
          </span>
          <span className="text-xs font-normal text-slate-400">
            Click frame node to inspect per-frame forensic reasons
          </span>
        </h4>

        {/* Interactive nodes */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 px-1">
          {frameDetails.map((f, idx) => {
            const isSusp = f.status === 'Suspicious';
            const isSelected = selectedFrame?.frame_number === f.frame_number;
            return (
              <button
                key={f.frame_number}
                onClick={() => setSelectedFrame(f)}
                className={`group flex-1 min-w-[58px] p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 scale-105'
                    : ''
                } ${
                  isSusp
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-950/60'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">
                  F#{f.frame_number}
                </div>
                <div className="text-[9px] font-mono opacity-75 mt-0.5">
                  {f.timestamp}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isSusp ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : 'bg-emerald-500'
                    }`}
                  ></span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Frame Detail Popup Banner */}
        {selectedFrame && (
          <div className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 text-xs flex items-start justify-between gap-4">
            <div>
              <span className="font-mono font-bold text-cyan-400">
                Frame #{selectedFrame.frame_number} ({selectedFrame.timestamp}):
              </span>{' '}
              <span className={selectedFrame.status === 'Suspicious' ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                {selectedFrame.status} ({selectedFrame.confidence}% confidence)
              </span>
              {selectedFrame.reasons && selectedFrame.reasons.length > 0 && (
                <div className="text-slate-300 mt-1 text-[11px]">
                  Flagged: {selectedFrame.reasons.join(', ')}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedFrame(null)}
              className="text-slate-500 hover:text-white font-mono text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Frame Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md overflow-hidden">
        <h4 className="text-sm font-bold text-slate-100 mb-3">
          Frame-by-Frame Forensic Evidence Log
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Frame</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Anomaly Indicators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono">
              {frameDetails.map((row) => {
                const isSusp = row.status === 'Suspicious';
                return (
                  <tr
                    key={row.frame_number}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSusp ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-semibold text-slate-200">
                      #{row.frame_number}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{row.timestamp}</td>
                    <td className="py-2 px-3 text-slate-200">{row.confidence}%</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSusp
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">
                      {row.reasons && row.reasons.length > 0
                        ? row.reasons.join(', ')
                        : 'Continuous motion & gradient alignment'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
