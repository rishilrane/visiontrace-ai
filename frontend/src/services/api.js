/**
 * API service for communicating with FastAPI backend.
 */
const API_BASE = 'https://visiontrace-ai.onrender.com/api';
const API_BASE = 'https://visiontrace-ai.onrender.com/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}

export async function analyzeMedia(file, onProgressStep) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Analysis request failed');
  }

  return res.json();
}

export async function getDemoSamples() {
  const res = await fetch(`${API_BASE}/demo/samples`);
  if (!res.ok) throw new Error('Failed to fetch demo samples');
  return res.json();
}

export async function runDemoAnalysis(sampleId) {
  const res = await fetch(`${API_BASE}/demo/analyze/${sampleId}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Demo analysis failed');
  }

  return res.json();
}

export async function getAnalyses(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.prediction && filters.prediction !== 'all') params.append('prediction', filters.prediction);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);

  const res = await fetch(`${API_BASE}/analyses?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load analyses');
  return res.json();
}

export async function getAnalysisById(id) {
  const res = await fetch(`${API_BASE}/analyses/${id}`);
  if (!res.ok) throw new Error('Analysis record not found');
  return res.json();
}

export async function deleteAnalysis(id) {
  const res = await fetch(`${API_BASE}/analyses/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete analysis record');
  return res.json();
}

export function getReportPdfUrl(id) {
  return `${API_BASE}/report/${id}/pdf`;
}

export function getReportHtmlUrl(id) {
  return `${API_BASE}/report/${id}/html`;
}
