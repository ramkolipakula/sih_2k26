import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportingDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Report Management Dashboard</h2>
      <div className="grid">
        <div className="card stat-card">
          <div className="stat-value">42</div>
          <div className="stat-label">Reports Generated</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Reports Pending Review</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">37</div>
          <div className="stat-label">Reports Approved</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">124</div>
          <div className="stat-label">Documents Available</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '24px', gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <h3>Review Queue</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Annual Mining Review - BCCL (Pending Validation)</li>
            <li>Q3 Environmental Compliance - Jharia (Pending Changes)</li>
            <li>Exploration Summary - Odisha (Ready for Approval)</li>
          </ul>
        </div>
        <div className="card">
          <h3>Actions</h3>
          <button className="btn-primary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => navigate('/reports')}>
            Generate New Report
          </button>
          <button className="btn-secondary" style={{ width: '100%' }}>
            View Approved Reports
          </button>
        </div>
      </div>
    </div>
  );
}
