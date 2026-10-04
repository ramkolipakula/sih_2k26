import React from 'react';

export default function ManagementDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Management Intelligence Dashboard</h2>
      <div className="grid">
        <div className="card stat-card" style={{ borderLeft: '4px solid #2980b9' }}>
          <div className="stat-value">12%</div>
          <div className="stat-label">Production Increase (YTD)</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid #27ae60' }}>
          <div className="stat-value">14</div>
          <div className="stat-label">Active Mining Projects</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid #f39c12' }}>
          <div className="stat-value">3</div>
          <div className="stat-label">Pending Management Reviews</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid #8e44ad' }}>
          <div className="stat-value">8</div>
          <div className="stat-label">Reports Generated (This Month)</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '24px', gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <h3>AI Insights</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Production increased by 12% across selected projects (Jharia & Talcher).</li>
            <li>3 projects require management review due to potential operational delays.</li>
            <li>Exploration activity increased by 15% in Odisha blocks.</li>
          </ul>
          <button className="btn-primary" style={{ marginTop: '16px' }}>Ask AI Assistant</button>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <button className="btn-secondary" style={{ width: '100%' }}>View Production Trend</button>
            <button className="btn-secondary" style={{ width: '100%' }}>Generate Board Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
