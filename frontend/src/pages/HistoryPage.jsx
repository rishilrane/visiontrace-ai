import React, { useState, useEffect } from 'react';
import HistoryTable from '../components/HistoryTable';
import { getAnalyses, deleteAnalysis } from '../services/api';
import { History, RefreshCw, AlertCircle } from 'lucide-react';

export default function HistoryPage({ setActivePage, onSelectRecord }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    type: 'all',
    prediction: 'all',
    search: '',
    sort: 'newest',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalyses(filters);
      setAnalyses(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analyses from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleView = (record) => {
    onSelectRecord(record);
    setActivePage('analyze');
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Audit Trail & Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            Analysis History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database-backed registry of all executed forensic image and video evaluations
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors self-start sm:self-auto"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* History Table with Filters */}
      <HistoryTable
        analyses={analyses}
        loading={loading}
        onViewRecord={handleView}
        onDeleteRecord={handleDelete}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
