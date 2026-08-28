const API_BASE = '/api/v1';

async function request(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.error || 'Request failed');
  return data;
}

export const api = {
  // Proposals
  getProposals: () => request('/proposals'),
  getProposal: (id: string) => request(`/proposals/${id}`),
  uploadProposal: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/proposals/upload`, { method: 'POST', body: form });
    return res.json();
  },
  processProposal: (id: string) => request(`/proposals/${id}/process`, { method: 'POST' }),
  getExtraction: (id: string) => request(`/proposals/${id}/extraction`),

  // Jobs
  getJobStatus: (jobId: string) => request(`/jobs/${jobId}`),

  // Evaluation
  startEvaluation: (id: string) => request(`/evaluation/${id}/analyze`, { method: 'POST' }),
  getEvaluation: (id: string) => request(`/evaluation/${id}`),

  // Tribunal
  startTribunal: (id: string) => request(`/evaluations/${id}/tribunal`, { method: 'POST' }),
  getTribunal: (id: string) => request(`/evaluations/${id}/tribunal`),
  getEvidence: (id: string) => request(`/evaluations/${id}/evidence`),
  getFullReport: (id: string) => request(`/evaluations/${id}/report`),
  getPipelineStatus: (id: string) => request(`/evaluations/${id}/pipeline-status`),

  // Human Review
  submitReview: (id: string, action: string, notes: string) =>
    request(`/evaluations/${id}/human-review`, {
      method: 'POST',
      body: JSON.stringify({ action, reviewer_notes: notes }),
    }),

  // Admin
  getAdminProposals: () => request('/admin/proposals'),
  submitAdminReview: (id: string, decision: string, comment: string) =>
    request(`/admin/proposals/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, comment, reviewer_id: 'admin' }),
    }),
  getAdminSystemHealth: () => request('/admin/system'),
  getAdminKnowledge: () => request('/admin/knowledge'),
  verifyKnowledge: (id: string, action: string) =>
    request(`/admin/knowledge/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),
};
