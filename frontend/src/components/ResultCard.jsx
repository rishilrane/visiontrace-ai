import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  FileText,
  RotateCcw,
  Clock,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import RiskBadge from './RiskBadge';
import IndicatorList from './IndicatorList';
import FaceDetectionViewer from './FaceDetectionViewer';
import VideoFrameViewer from './VideoFrameViewer';
import { getReportPdfUrl, getReportHtmlUrl } from '../services/api';

export default function ResultCard({ result, onReset, onViewHistory }) {
  if (!result) return null;

  const isManipulated = result.prediction?.includes('MANIPULATED');
  const isVideo = result.file_type === 'video';

  const downloadPdf = () => {
    window.open(getReportPdfUrl(result.id), '_blank');
  };

  const openHtmlReport = () => {
    window.open(getReportHtmlUrl(result.id), '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Main Verdict Card */}
      <div
        className={`relative rounded-3xl p-8 border shadow-2xl backdrop-blur-xl overflow-hidden ${
          isManipulated
            ? 'bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-950 border-rose-500/40 shadow-rose-500/10'
            : 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border-emerald-500/40 shadow-emerald-500/10'
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-30 pointer-events-none ${
            isManipulated ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            {/* Verdict Headline */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Detection Verdict
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-cyan-400">
                  ID: {result.id}
                </span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-black font-mono tracking-tight flex items-center space-x-3 ${
                  isManipulated ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isManipulated ? (
                  <ShieldAlert className="w-9 h-9 shrink-0 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-9 h-9 shrink-0 text-emerald-400" />
                )}
                <span>{result.prediction}</span>
              </h2>

              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                {isManipulated
                  ? 'Forensic analysis identified localized statistical anomalies and boundary inconsistencies consistent with digital alteration or generative synthesis.'
                  : 'Statistical feature metrics and edge transitions are consistent with authentic camera captures. No significant synthetic signatures detected.'}
              </p>
            </div>

            {/* Confidence & Risk Pills */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
              <RiskBadge level={result.risk_level} size="lg" />
              <div className="text-xs font-mono text-slate-400">
                Engine: <span className="text-cyan-400 font-semibold">{result.detector_name}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Confidence</span>
              <span className="text-xl font-mono font-bold text-white mt-0.5 block">
                {result.confidence}%
              </span>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Faces Isolated</span>
              <span className="text-xl font-mono font-bold text-white mt-0.5 block">
                {result.faces_detected}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Frames Sampled</span>
              <span className="text-xl font-mono font-bold text-white mt-0.5 block">
                {result.frames_analyzed}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Processing Time</span>
              <span className="text-xl font-mono font-bold text-cyan-400 mt-0.5 block">
                {result.processing_time}s
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={downloadPdf}
                className="px-5 py-2.5 rounded-xl text-xs font-bold font-mono bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </button>

              <button
                onClick={openHtmlReport}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>View Printable Report</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onReset}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center space-x-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start New Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Evidence Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Forensic Evidence & Visual Inspection</span>
        </h3>

        {isVideo ? (
          <VideoFrameViewer
            videoPath={result.file_path}
            keyframePath={result.processed_path}
            metadata={result.metadata_info}
            frameDetails={result.frame_details || []}
            suspiciousCount={
              (result.frame_details || []).filter((f) => f.status === 'Suspicious').length
            }
          />
        ) : (
          <FaceDetectionViewer
            originalPath={result.file_path}
            processedPath={result.processed_path}
            facesCount={result.faces_detected}
          />
        )}
      </div>

      {/* Explainability & Indicator Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Explainability & Indicators */}
        <div className="lg:col-span-2 space-y-6">
          {/* Explainability Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 mb-3">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Why did we get this result? (Explainable AI)</span>
            </h3>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-850 text-slate-300 text-sm leading-relaxed space-y-3 font-sans">
              <p>{result.explanation}</p>
            </div>

            <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>
                Prototype result — probabilistic baseline analysis. Human verification is recommended for high-stakes decisions.
              </span>
            </div>
          </div>

          {/* Indicators Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 mb-4">
              Detailed Detection Indicators
            </h3>
            <IndicatorList indicators={result.indicators} />
          </div>
        </div>

        {/* Right Col: Confidence Meter & Engine Specs */}
        <div className="space-y-6">
          {/* Confidence Meter Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md text-center">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Statistical Certainty
            </h4>
            <ConfidenceMeter
              confidence={result.confidence}
              isManipulated={isManipulated}
            />
          </div>

          {/* Engine Technical Specifications */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md text-xs space-y-3 font-mono">
            <h4 className="text-sm font-bold text-slate-200 font-sans flex items-center space-x-2 mb-2 pb-2 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Engine Specifications</span>
            </h4>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Active Engine:</span>
              <span className="text-slate-200">{result.detector_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Face Classifier:</span>
              <span className="text-cyan-400">OpenCV Haar Cascade</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Compression ELA:</span>
              <span className="text-slate-200">Resave-90 Differential</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Frequency Analysis:</span>
              <span className="text-slate-200">2D FFT Azimuthal Spectrum</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Edge Variance:</span>
              <span className="text-slate-200">Laplacian Dispersion</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Storage Backend:</span>
              <span className="text-emerald-400">SQLite Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
