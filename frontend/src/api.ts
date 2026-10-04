
const API_BASE = 'http://localhost:8000/api/v1';

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/dashboard/insights`);
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
}

export async function generateReport(data: any) {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function searchQdrant(query: string) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}
