import React from 'react';

export default function GeologistDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Geological Intelligence Dashboard</h2>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-value">24</div>
          <div className="stat-label">Geological Reports</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Active Exploration Projects</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">2</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Recent Geological Reports</h3>
        <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Report Name</th>
              <th style={{ padding: '8px' }}>Location</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>Jharia Coalfield Geological Report 2023</td>
              <td style={{ padding: '8px' }}>Jharia</td>
              <td style={{ padding: '8px', color: '#27ae60' }}>Verified</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Talcher Coalfield Assessment</td>
              <td style={{ padding: '8px' }}>Talcher</td>
              <td style={{ padding: '8px', color: '#f39c12' }}>Under Review</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Odisha Block Exploration Data</td>
              <td style={{ padding: '8px' }}>Odisha</td>
              <td style={{ padding: '8px', color: '#27ae60' }}>Verified</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
