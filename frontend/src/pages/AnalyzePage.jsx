import React, { useState, useEffect } from 'react';
import UploadZone from '../components/UploadZone';
import PipelineProgress from '../components/PipelineProgress';
import ResultCard from '../components/ResultCard';
import { analyzeMedia, getDemoSamples, runDemoAnalysis } from '../services/api';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AnalyzePage({ activeResult, setActiveResult, setActivePage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [demoCatalog, setDemoCatalog] = useState([]);

  useEffect(() => {
    // Load demo samples list
    getDemoSamples()
      .then(setDemoCatalog)
      .catch((err) => console.error('Could not load demo catalog', err));
  }, []);

  const simulateProgress = () => {
    setCurrentStep(1);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 450);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    const progressTimer = simulateProgress();

    try {
      const data = await analyzeMedia(selectedFile);
      clearInterval(progressTimer);
      setCurrentStep(8);
      // Brief pause to allow the user to see the 8th completed step
      setTimeout(() => {
        setActiveResult(data);
        setIsAnalyzing(false);
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      setIsAnalyzing(false);
      setCurrentStep(0);
      setErrorMessage(err.message || 'An error occurred during analysis');
    }
  };

  const handleDemoSelect = async (sampleId) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    const progressTimer = simulateProgress();

    try {
      const data = await runDemoAnalysis(sampleId);
      clearInterval(progressTimer);
      setCurrentStep(8);
      setTimeout(() => {
        setActiveResult(data);
        setIsAnalyzing(false);
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      setIsAnalyzing(false);
      setCurrentStep(0);
      setErrorMessage(err.message || 'Failed to analyze demo sample');
    }
  };

  const handleReset = () => {
    setActiveResult(null);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setCurrentStep(0);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Media Forensics Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            {activeResult ? 'Forensic Inspection Results' : 'Analyze Media'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeResult
              ? 'Multi-factor visual and statistical analysis breakdown'
              : 'Upload an image or video file to trigger the 8-stage deepfake detection pipeline'}
          </p>
        </div>

        {activeResult && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-mono text-xs text-rose-400">
            Dismiss
          </button>
        </div>
      )}

      {/* If Result exists, show ResultCard */}
      {activeResult ? (
        <ResultCard
          result={activeResult}
          onReset={handleReset}
          onViewHistory={() => setActivePage('history')}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Pipeline Progress bar when analyzing */}
          {isAnalyzing && (
            <PipelineProgress
              currentStep={currentStep}
              isFinished={currentStep >= 8}
            />
          )}

          {/* Upload Zone & Demo Selector */}
          <UploadZone
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            fileType={fileType}
            setFileType={setFileType}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onSelectDemo={handleDemoSelect}
            demoCatalog={demoCatalog}
          />
        </div>
      )}
    </div>
  );
}
