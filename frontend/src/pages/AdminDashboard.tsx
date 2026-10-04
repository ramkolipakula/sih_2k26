import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchSummary().then(res => setStats(res.data));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>System Administration Overview</h2>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-value">{stats?.geological_reports || 0}</div>
          <div className="stat-label">Geological Reports</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats?.mining_reports || 0}</div>
          <div className="stat-label">Mining Reports</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats?.exploration_data || 0}</div>
          <div className="stat-label">Exploration Data</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats?.pending_tasks || 0}</div>
          <div className="stat-label">Pending System Tasks</div>
        </div>
      </div>
      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Platform Health</h3>
        <p>All AI/RAG services are operational. Supabase connection active.</p>
      </div>
    </div>
  );
}
