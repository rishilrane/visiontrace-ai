import React, { useState } from 'react';
import { Eye, Layers, ShieldAlert, Sparkles, ZoomIn } from 'lucide-react';

export default function FaceDetectionViewer({ originalPath, processedPath, facesCount = 0 }) {
  const toMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    return "https://visiontrace-ai.onrender.comfrontend\src\components\FaceDetectionViewer.jsx";
  };
  const [activeView, setActiveView] = useState('annotated'); // 'annotated' | 'original' | 'split'

  const hasOverlay = Boolean(processedPath);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      {/* Header with view selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Forensic Visual Inspection & Face Regions</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {facesCount > 0
              ? `${facesCount} facial region(s) isolated via Haar Cascade classifiers`
              : 'Full frame global visual analysis (no frontal face landmark cluster detected)'}
          </p>
        </div>

        {/* View Toggle Tabs */}
        {hasOverlay && (
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveView('annotated')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeView === 'annotated'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forensic Overlay
            </button>
            <button
              onClick={() => setActiveView('original')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeView === 'original'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original Media
            </button>
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeView === 'split'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        )}
      </div>

      {/* Media Canvas View */}
      <div className="relative">
        {activeView === 'split' && hasOverlay ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Original Input
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 flex items-center justify-center max-h-[380px]">
                <img
                  src={toMediaUrl(originalPath)}
                  alt="Original Media"
                  className="max-h-[380px] w-auto object-contain"
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Annotated Overlay (HUD)
              </span>
              <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 flex items-center justify-center max-h-[380px] shadow-lg shadow-cyan-500/5">
                <img
                  src={toMediaUrl(processedPath)}
                  alt="Annotated Evidence"
                  className="max-h-[380px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/90 flex items-center justify-center min-h-[320px] max-h-[460px] p-2 relative group">
            <img
              src={toMediaUrl(activeView === 'original' || !hasOverlay ? originalPath : processedPath)}
              alt="Analyzed Media"
              className="max-h-[440px] w-auto object-contain rounded-lg"
            />
            
            {/* Overlay Indicator Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center space-x-2 shadow-lg">
              <span className={`w-2 h-2 rounded-full ${activeView === 'annotated' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>
                {activeView === 'annotated'
                  ? 'Visual indicators detected in analyzed regions (Bounding Boxes & Markers)'
                  : 'Original Unmodified Media'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Cyan rectangles delineate face bounding boxes. Red/Amber highlights denote statistical and edge anomalies.</span>
        </div>
      </div>
    </div>
  );
}

