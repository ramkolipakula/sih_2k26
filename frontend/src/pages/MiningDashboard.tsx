import React from 'react';

export default function MiningDashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Mining Operations Dashboard</h2>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-value">18 MT</div>
          <div className="stat-label">Current Production (Q3)</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">6</div>
          <div className="stat-label">Active Mines</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Mining Reports</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3>Mining Projects Overview</h3>
        <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Project</th>
              <th style={{ padding: '8px' }}>Location</th>
              <th style={{ padding: '8px' }}>Production Target</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>BCCL Underground Expansion</td>
              <td style={{ padding: '8px' }}>Bokaro</td>
              <td style={{ padding: '8px' }}>4.5 MT</td>
              <td style={{ padding: '8px', color: '#27ae60' }}>On Track</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Jharia Surface Mining</td>
              <td style={{ padding: '8px' }}>Jharia</td>
              <td style={{ padding: '8px' }}>8.0 MT</td>
              <td style={{ padding: '8px', color: '#f39c12' }}>Slight Delay</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
