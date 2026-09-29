import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, FileVideo, X, AlertCircle, Sparkles } from 'lucide-react';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
];

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.avi'];
const MAX_SIZE_MB = 50;

export default function UploadZone({
  selectedFile,
  setSelectedFile,
  filePreview,
  setFilePreview,
  fileType,
  setFileType,
  onAnalyze,
  isAnalyzing,
  onSelectDemo,
  demoCatalog = [],
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage(null);

    if (!file) return;

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes). Please upload a valid media file.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File exceeds the maximum allowed size of ${MAX_SIZE_MB}MB.`);
      return;
    }

    const name = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTS.some((ext) => name.endsWith(ext));

    if (!hasValidExt && !ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported file format. Supported formats: JPG, JPEG, PNG, WEBP, MP4, MOV, AVI.');
      return;
    }

    const isVideo = file.type.startsWith('video') || name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.avi');
    const detectedType = isVideo ? 'video' : 'image';

    setSelectedFile(file);
    setFileType(detectedType);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setFilePreview(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm flex items-start space-x-3 shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <span className="font-semibold">Validation Error:</span> {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-200 text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Box or Selected File Preview */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99] shadow-2xl shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi"
            onChange={handleFileChange}
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-100">
            Drop your image or video here
          </h3>
          <p className="text-sm text-cyan-400 font-medium mt-1">
            or Browse Files
          </p>

          <p className="text-xs text-slate-400 mt-4 max-w-sm">
            Supported formats: <span className="text-slate-300 font-mono">JPG, JPEG, PNG, WEBP, MP4, MOV, AVI</span> (up to 50MB)
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Actual Live Preview */}
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[320px] p-2 relative group">
              {fileType === 'video' ? (
                <video
                  src={filePreview}
                  controls
                  className="max-h-[300px] w-auto object-contain rounded-xl"
                />
              ) : (
                <img
                  src={filePreview}
                  alt="Selected Preview"
                  className="max-h-[300px] w-auto object-contain rounded-xl"
                />
              )}
            </div>

            {/* Selected File Details & Controls */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
                  {fileType === 'video' ? (
                    <FileVideo className="w-4 h-4" />
                  ) : (
                    <FileImage className="w-4 h-4" />
                  )}
                  <span>Ready For Forensic Pipeline</span>
                </div>

                <h3 className="text-lg font-bold text-white break-all">
                  {selectedFile.name}
                </h3>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <span className="text-slate-400 block">File Size:</span>
                    <span className="text-slate-200 font-semibold">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <span className="text-slate-400 block">Media Type:</span>
                    <span className="text-cyan-400 font-semibold uppercase">{fileType}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Processing Media...' : 'Analyze Media'}</span>
                </button>

                <button
                  onClick={handleRemoveFile}
                  disabled={isAnalyzing}
                  className="py-3 px-5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Remove File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Samples Selector (Try Demo Feature) */}
      {!selectedFile && demoCatalog.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Or Try Bundled Demo Samples (Instant 1-Click Test)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real pipeline analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {demoCatalog.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectDemo(sample.id)}
                className="text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {sample.file_type}
                  </span>
                  <span className="text-[10px] text-cyan-400 group-hover:underline">
                    Test Sample →
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2 truncate">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
