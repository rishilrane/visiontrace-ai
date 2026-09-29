import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Trash2,
  FileImage,
  FileVideo,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import RiskBadge from './RiskBadge';
import { getReportPdfUrl, getReportHtmlUrl } from '../services/api';

export default function HistoryTable({
  analyses = [],
  loading = false,
  onViewRecord,
  onDeleteRecord,
  filters,
  setFilters,
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleTypeChange = (e) => {
    setFilters((prev) => ({ ...prev, type: e.target.value }));
  };

  const handlePredictionChange = (e) => {
    setFilters((prev) => ({ ...prev, prediction: e.target.value }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter and Sort Controls */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filename, ID, or reasons..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Media Type Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <span>Type:</span>
            <select
              value={filters.type}
              onChange={handleTypeChange}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Media</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          {/* Verdict Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <span>Result:</span>
            <select
              value={filters.prediction}
              onChange={handlePredictionChange}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Verdicts</option>
              <option value="real">Likely Authentic</option>
              <option value="manipulated">Potentially Manipulated</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sort}
              onChange={handleSortChange}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-mono animate-pulse">
            Querying SQLite analysis repository...
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">No analysis records found matching your filters.</p>
            <p className="text-slate-500 text-xs mt-1">Upload an image or video or test a demo sample to log your first record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Analysis ID</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-mono">
                {analyses.map((row) => {
                  const isManip = row.prediction?.includes('MANIPULATED');
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 text-cyan-400 font-bold whitespace-nowrap">
                        {row.id}
                      </td>

                      {/* Filename */}
                      <td className="py-3 px-4 font-sans text-slate-200 max-w-[180px] truncate">
                        {row.filename}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="flex items-center space-x-1.5 text-slate-400 uppercase text-[11px]">
                          {row.file_type === 'video' ? (
                            <FileVideo className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <FileImage className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span>{row.file_type}</span>
                        </span>
                      </td>

                      {/* Verdict */}
                      <td className="py-3 px-4 whitespace-nowrap font-sans">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isManip
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          }`}
                        >
                          {isManip ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>{row.prediction}</span>
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-4 text-white font-bold whitespace-nowrap">
                        {row.confidence}%
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <RiskBadge level={row.risk_level} size="sm" />
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {row.created_at}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-sans">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewRecord(row)}
                            title="View Detailed Results"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={getReportPdfUrl(row.id)}
                            download
                            title="Download PDF Report"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-300 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setDeleteConfirmId(row.id)}
                            title="Delete Analysis Record"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Analysis Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete analysis <span className="font-mono text-cyan-400">{deleteConfirmId}</span>?
              This will permanently delete the database record and associated forensic artifacts from disk.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteRecord(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
