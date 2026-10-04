import React from 'react';

export default function AnalystDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Data & Intelligence Dashboard</h2>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-value">1,245</div>
          <div className="stat-label">Documents Indexed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">8</div>
          <div className="stat-label">Data Sources Connected</div>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid #e74c3c' }}>
          <div className="stat-value">3</div>
          <div className="stat-label">Data Quality Issues</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Data Quality Flags</h3>
        <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Issue Description</th>
              <th style={{ padding: '8px' }}>Source</th>
              <th style={{ padding: '8px' }}>Severity</th>
              <th style={{ padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>Production data mismatch (Q2 2023)</td>
              <td style={{ padding: '8px' }}>Jharia ERP Export</td>
              <td style={{ padding: '8px', color: '#e74c3c' }}>High</td>
              <td style={{ padding: '8px' }}><button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Resolve</button></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Missing metadata (Location)</td>
              <td style={{ padding: '8px' }}>Legacy Report #4421</td>
              <td style={{ padding: '8px', color: '#f39c12' }}>Medium</td>
              <td style={{ padding: '8px' }}><button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Resolve</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
