import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Eye,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileImage,
  FileVideo,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import StatisticsCards from '../components/StatisticsCards';
import RiskBadge from '../components/RiskBadge';
import { getDashboardStats } from '../services/api';

export default function DashboardPage({ setActivePage, onSelectRecord }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend statistics database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Header with Title and Start New Analysis CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Operational Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            System Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time forensic analysis database metrics and recent query logs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            title="Refresh database statistics"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActivePage('analyze')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Start New Analysis</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="underline font-mono">Retry</button>
        </div>
      )}

      {/* Live Statistics Cards */}
      <StatisticsCards stats={stats} />

      {/* Main Section: Recent Analyses */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Recent Forensic Analyses</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest media processed by the VisionTrace detection engine
            </p>
          </div>

          <button
            onClick={() => setActivePage('history')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading && !stats ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400 animate-pulse">
            Loading recent analyses from SQLite...
          </div>
        ) : !stats?.recent_analyses || stats.recent_analyses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400">No analyses logged yet.</p>
            <button
              onClick={() => setActivePage('analyze')}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Analyze Your First Media File
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">File Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Prediction</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-mono">
                {stats.recent_analyses.map((row) => {
                  const isManip = row.prediction?.includes('MANIPULATED');
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-sans text-slate-100 font-medium max-w-[200px] truncate">
                        {row.filename}
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          {row.file_type === 'video' ? (
                            <FileVideo className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <FileImage className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span>{row.file_type}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                      <td className="py-2.5 px-3 text-white font-bold">
                        {row.confidence}%
                      </td>
                      <td className="py-2.5 px-3">
                        <RiskBadge level={row.risk_level} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {row.created_at}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            onSelectRecord(row);
                            setActivePage('analyze');
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-sans font-medium bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-300 transition-colors inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
