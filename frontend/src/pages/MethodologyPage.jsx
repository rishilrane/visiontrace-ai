import React from 'react';
import {
  BookOpen,
  ArrowDown,
  Layers,
  Search,
  Sliders,
  Cpu,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Zap,
  Activity,
  Award,
} from 'lucide-react';

export default function MethodologyPage() {
  const pipelineStages = [
    {
      num: 1,
      title: 'User Input & Media Upload',
      desc: 'User selects an image (JPG, PNG, WEBP) or video (MP4, MOV, AVI) via local upload or bundled benchmark samples. File size and MIME type are strictly validated.',
      icon: Search,
    },
    {
      num: 2,
      title: 'Pre-processing & Aspect Normalization',
      desc: 'Media is decoded using OpenCV. Excessive dimensions are downscaled preserving native aspect ratios. Color channels are normalized across standard BGR/RGB matrices.',
      icon: Sliders,
    },
    {
      num: 3,
      title: 'Face Detection & ROI Segmentation',
      desc: 'Frontal face bounding boxes are localized via Haar Cascade classifiers. Detected facial regions of interest (ROIs) are extracted with safety margins for localized inspection.',
      icon: Layers,
    },
    {
      num: 4,
      title: 'Forensic Feature Extraction',
      desc: 'A multi-factor statistical and forensic feature suite is extracted: Error Level Analysis (ELA), 2D Fast Fourier Transform (FFT) power spectra, Laplacian edge variance, and noise residuals.',
      icon: Activity,
    },
    {
      num: 5,
      title: 'AI/ML Detection Engine',
      desc: 'The active detector evaluates feature differentials between facial ROIs and contextual background, cross-referencing synthetic frequency spikes and compression inconsistencies.',
      icon: Cpu,
    },
    {
      num: 6,
      title: 'Confidence Calculation & Risk Mapping',
      desc: 'Weighted anomaly scores are normalized to compute dynamic confidence (0–100%) and categorised into LOW, MEDIUM, or HIGH risk brackets.',
      icon: Award,
    },
    {
      num: 7,
      title: 'Explainable AI (XAI) Synthesis',
      desc: 'Technical indicators are translated into clear, objective plain English explaining the underlying rationale while maintaining scientific uncertainty (never claiming 100% certainty).',
      icon: Zap,
    },
    {
      num: 8,
      title: 'Report Generation & Persistence',
      desc: 'Analysis findings, metadata, and HUD overlays are committed to the SQLite database. Downloadable PDF and printable HTML forensic reports are generated.',
      icon: FileText,
    },
  ];

  const researchChallenges = [
    {
      title: 'Generalization Across Unseen Generators',
      desc: 'Detectors trained exclusively on specific GAN or Diffusion models frequently suffer performance degradation when confronted with unseen generative architectures or post-processing filters.',
    },
    {
      title: 'Robustness Against Adversarial Compression',
      desc: 'Social media platforms routinely transcode, downscale, and heavily compress media. This lossy re-encoding can obscure subtle biometric and frequency-domain artifacts.',
    },
    {
      title: 'Computational Efficiency & Real-Time Constraints',
      desc: 'Heavyweight Deep Convolutional Neural Networks (CNNs) and Vision Transformers (ViTs) demand extensive GPU memory and compute power, making lightweight baseline heuristics essential for edge evaluation.',
    },
    {
      title: 'Forensic Explainability vs Black-Box Inference',
      desc: 'Deep learning models often function as opaque black boxes. In judicial and forensic domains, human analysts require interpretable visual evidence, boundary heatmaps, and plain-English rationale.',
    },
  ];

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-3 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-mono text-cyan-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic System Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono text-white">
          Detection Methodology & Pipeline
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Detailed technical breakdown of the multi-factor deepfake detection architecture,
          algorithmic feature extraction, and computer vision heuristics.
        </p>
      </div>

      {/* 8-Stage Academic Pipeline Visual Flow */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Academic Processing Pipeline</span>
        </h2>

        <div className="space-y-4 relative">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.num}>
                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-850 hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-sm">
                    {stage.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-100">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="flex justify-center py-0.5 text-cyan-500/50">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Algorithmic Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Error Level Analysis (ELA)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            JPEG compression operates by segmenting images into 8x8 discrete cosine transform (DCT) grids.
            When an image is altered or a synthetic facial patch is spliced into an existing frame, the manipulated
            region exhibits an error differential when resaved at a controlled compression ratio (90%), revealing
            discontinuous compression histories.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>2D Fourier Transform (FFT) Spectra</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generative Adversarial Networks (GANs) and Autoencoders employ convolutional up-sampling layers (such as
            transposed convolutions). These operations introduce subtle periodic grid artifacts into the frequency domain.
            By computing the azimuthal average of the 2D FFT power spectrum, synthetic up-convolution signatures can be identified.
          </p>
        </div>
      </div>

      {/* Research Challenges Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Core Deepfake Research Challenges</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Critical hurdles identified in contemporary AI/ML forensic literature
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchChallenges.map((rc, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-slate-200">{rc.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{rc.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Computational Resource Tradeoffs: </span>
            While high-capacity deep CNNs (e.g. EfficientNet) and Transformers offer high accuracy on synthetic benchmarks,
            their significant compute requirements render them challenging for resource-constrained deployments.
            VisionTrace AI balances efficiency and transparency by utilizing high-speed statistical forensics as a baseline.
          </div>
        </div>
      </div>
    </div>
  );
}
