import React from 'react';
import {
  Info,
  Award,
  Target,
  Shield,
  FileCheck,
  AlertOctagon,
  CheckCircle2,
  Database,
  Cpu,
} from 'lucide-react';

export default function AboutPage() {
  const objectives = [
    {
      title: 'Study Modern AI/ML Deepfake Detection',
      desc: 'Investigate contemporary generative synthesis methods (GANs, diffusion models, face-swapping pipelines) and examine the digital footprints they impart on media files.',
    },
    {
      title: 'Compare Detection Approaches',
      desc: 'Evaluate the trade-offs between compute-intensive deep learning models (CNNs, Vision Transformers) and lightweight, interpretable computer vision/statistical forensics.',
    },
    {
      title: 'Identify Research Gaps',
      desc: 'Document key operational hurdles in cross-dataset generalization, resistance to social media recompression, and forensic explainability for non-technical stakeholders.',
    },
    {
      title: 'Develop a Practical Software Prototype',
      desc: 'Engineer a fully operational end-to-end full-stack software system featuring automated file validation, face ROI segmentation, multi-indicator scoring, audit logs, and downloadable forensic reports.',
    },
  ];

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-mono text-cyan-400">
          <Info className="w-3.5 h-3.5" />
          <span>Academic Project Specification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono text-white">
          About VisionTrace AI
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Academic research prototype for Software-Based Deepfake Detection Using Artificial Intelligence and Machine Learning
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-slate-400">Project Title</span>
            <h3 className="text-lg font-bold text-white">
              AI-Based Deepfake Detection System (VisionTrace AI)
            </h3>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-slate-400">Domain</span>
            <h3 className="text-lg font-bold text-cyan-400">
              Artificial Intelligence & Machine Learning (Computer Vision Forensics)
            </h3>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5 space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Core Purpose</span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            “To develop a practical software system capable of analyzing image and video media for potential deepfake indicators.”
          </p>
        </div>
      </div>

      {/* Research Objectives */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <span>Academic Objectives</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((obj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 backdrop-blur-md"
            >
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Objective #{idx + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{obj.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Stack Architecture */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>System Technology Stack</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block">Frontend</span>
            <span className="text-white font-bold mt-1 block">React 19 + Vite</span>
            <span className="text-[10px] text-cyan-400">Tailwind CSS + Lucide</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block">Backend</span>
            <span className="text-white font-bold mt-1 block">Python FastAPI</span>
            <span className="text-[10px] text-cyan-400">Uvicorn Async Engine</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block">Forensics / CV</span>
            <span className="text-white font-bold mt-1 block">OpenCV + NumPy</span>
            <span className="text-[10px] text-cyan-400">Haar Cascade & ELA</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block">Database & PDF</span>
            <span className="text-white font-bold mt-1 block">SQLite + ReportLab</span>
            <span className="text-[10px] text-cyan-400">Persistent Audit Log</span>
          </div>
        </div>
      </div>

      {/* Limitations & Ethical Disclaimer */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 text-slate-300 space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
          <AlertOctagon className="w-5 h-5" />
          <span>Important Academic Limitations & Ethical Disclaimer</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          This system is an <strong>academic research prototype</strong>. Deepfake detection is probabilistic in nature.
          Benchmark detection performance does not guarantee reliable identification of previously unseen manipulations,
          ultra-high-resolution neural rendering, or heavily recompressed transmissions.
        </p>
        <p className="text-xs leading-relaxed text-slate-400 italic">
          “AI-assisted detection provides an indication of possible manipulation, not definitive proof.
          Prototype results should not replace qualified human forensic verification for critical or legal decisions.”
        </p>
      </div>
    </div>
  );
}
