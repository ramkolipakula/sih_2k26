const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchAPI(endpoint: string, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function login(payload: any) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchSummary() {
  return fetchAPI('/dashboard/summary');
}

export async function fetchInsights() {
  return fetchAPI('/dashboard/insights');
}

export async function fetchDocuments() {
  return fetchAPI('/documents');
}

export async function fetchDataSources() {
  return fetchAPI('/data-sources');
}

export async function fetchTasks() {
  return fetchAPI('/tasks');
}

export async function generateReport(payload: any) {
  return fetchAPI('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchReports() {
  return fetchAPI('/reports');
}

export async function searchQdrant(query: string, type: string = "", year: string = "") {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (type) params.append('type', type);
  if (year) params.append('year', year);

  return fetchAPI(`/search?${params.toString()}`);
}
