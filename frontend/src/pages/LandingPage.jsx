import React from 'react';
import {
  ShieldCheck,
  Search,
  BookOpen,
  FileImage,
  FileVideo,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Layers,
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto pt-6 pb-10 space-y-6">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-cyan-300 font-mono shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>DeepGuard AI Forensic System • Academic Research Prototype</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
          VisionTrace<span className="text-cyan-400">.AI</span>
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-300">
          AI-Based Deepfake Detection System
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Analyze suspicious images and videos using AI-assisted visual and forensic analysis.
          Inspect facial ROI boundaries, error levels (ELA), 2D frequency spectra (FFT), and temporal frame continuity.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('analyze')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('methodology')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center space-x-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>View Methodology</span>
          </button>
        </div>

        {/* Probabilistic Warning Badge */}
        <div className="inline-flex items-center space-x-2 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 rounded-full px-4 py-1.5 mt-4">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Deepfake detection is probabilistic. Results should not replace human verification.</span>
        </div>
      </div>

      {/* Three Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1: Image Detection */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all hover:translate-y-[-2px] backdrop-blur-md shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-500/10">
            <FileImage className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Image Detection
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Analyze uploaded images for manipulation indicators. Extracts Error Level Analysis (ELA) signatures,
            2D FFT up-convolution frequency spikes, and boundary Laplacian edge disparities.
          </p>
        </div>

        {/* Feature 2: Video Detection */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all hover:translate-y-[-2px] backdrop-blur-md shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-5 shadow-lg shadow-blue-500/10">
            <FileVideo className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Video Detection
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extract and analyze video frames for suspicious inconsistencies. Performs intelligent frame sampling,
            facial landmark tracking, and temporal motion continuity checks across sampled keyframes.
          </p>
        </div>

        {/* Feature 3: Explainable Results */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all hover:translate-y-[-2px] backdrop-blur-md shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-5 shadow-lg shadow-purple-500/10">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Explainable Results
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Understand the confidence, risk level and indicators behind the result. Communicates findings in simple,
            transparent English while preserving scientific uncertainty.
          </p>
        </div>
      </div>

      {/* Architecture Highlights Banner */}
      <div className="max-w-6xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Pluggable Detection Architecture</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Designed for Transparent Machine Learning Research
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            VisionTrace AI implements a modular DetectionEngine abstraction. The system currently executes a baseline
            forensic and statistical feature suite, engineered with clean interfaces to swap in deep learning
            (CNN/Transformer) weights as research progresses.
          </p>
        </div>

        <button
          onClick={() => setActivePage('dashboard')}
          className="shrink-0 px-6 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Explore Live Dashboard →
        </button>
      </div>
    </div>
  );
}
