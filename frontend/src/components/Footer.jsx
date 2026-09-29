import React from 'react';
import { Shield, AlertTriangle, Cpu, ExternalLink } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 mt-auto text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: System Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-200 text-sm font-mono">VisionTrace AI</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                v1.2-Baseline
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Software-Based Deepfake Detection Using Artificial Intelligence and Machine Learning.
              Academic prototype developed to study facial manipulation heuristics, Error Level Analysis (ELA),
              frequency spectrum distributions, and temporal frame consistency.
            </p>
            <div className="flex items-center space-x-2 text-amber-400/90 bg-amber-950/30 border border-amber-800/30 rounded-lg p-2.5 max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="text-[11px] leading-tight">
                AI-assisted detection provides an indication of possible manipulation, not definitive proof.
                Results should not replace human expert verification for critical or legal decisions.
              </p>
            </div>
          </div>

          {/* Col 2: Architecture & Engine */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Detection Engine</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>OpenCV Haar Cascades</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Error Level Analysis (ELA)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>2D FFT Power Spectrum</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Laplacian Gradient Variance</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Temporal Frame Sampler</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('analyze')} className="hover:text-cyan-400 transition-colors">
                  Analyze Media
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-cyan-400 transition-colors">
                  Analysis History
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('methodology')} className="hover:text-cyan-400 transition-colors">
                  Methodology & Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition-colors">
                  About Project
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 VisionTrace AI – DeepGuard AI-Based Deepfake Detection System. Academic Research Prototype.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="text-slate-400 font-mono">SQLite DB Connected</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">FastAPI + React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
