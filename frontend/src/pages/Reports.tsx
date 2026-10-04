import { useState, useEffect } from 'react';
import { fetchReports, generateReport } from '../api';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);

  // Form state
  const [reportType, setReportType] = useState('Mining Production Report');
  const [project, setProject] = useState('Jharia Coalfield');
  const [period, setPeriod] = useState('2020 - 2024');

  useEffect(() => {
    fetchReports().then(res => {
      setReports(res.data);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerated(null);
    const res = await generateReport({ reportType, project, period });
    setGenerated(res.data);
    // Refresh list
    const updated = await fetchReports();
    setReports(updated.data);
    setGenerating(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Reports</h2>
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Report list */}
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Generated Reports</h3>
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading reports...</p>
            ) : reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No reports yet. Generate one using the form.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Project</th>
                    <th>Period</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 500 }}>{r.title}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.report_type}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.project}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.period}</td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600,
                          color: r.status === 'PUBLISHED' ? '#2E7D32' : 'var(--accent-orange)',
                          backgroundColor: r.status === 'PUBLISHED' ? '#E8F5E9' : '#FFF8F0',
                          padding: '3px 8px', borderRadius: '4px'
                        }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Generated report preview */}
          {generated && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📄 {generated.title}</h3>
                <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600, backgroundColor: '#E8F5E9', padding: '4px 10px', borderRadius: '4px' }}>
                  Generated
                </span>
              </div>
              <div className="ai-insight" style={{ marginBottom: '16px' }}>
                <div className="ai-insight-title">Executive Summary</div>
                <div className="ai-insight-text">{generated.summary?.executive_summary}</div>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>Key Findings</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {(generated.summary?.key_findings || []).map((f: string, i: number) => (
                  <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{f}</li>
                ))}
              </ul>
              {generated.summary?.sources_used?.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>Source Documents</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {generated.summary.sources_used.map((s: string, i: number) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', fontStyle: 'italic' }}>
                * This report was generated from demo data. Numbers are illustrative and not official CMPDI statistics.
              </p>
            </div>
          )}
        </div>

        {/* Generate form */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>📄 Generate Report</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select className="form-select" value={reportType} onChange={e => setReportType(e.target.value)}>
                <option>Mining Production Report</option>
                <option>Geological Report</option>
                <option>Exploration Summary</option>
                <option>Environmental Report</option>
                <option>Hydrogeological Report</option>
                <option>Project Status Report</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mine / Project</label>
              <select className="form-select" value={project} onChange={e => setProject(e.target.value)}>
                <option>Jharia Coalfield</option>
                <option>Bokaro Block</option>
                <option>Odisha Block</option>
                <option>Raniganj Coalfield</option>
                <option>Talcher Coalfield</option>
                <option>Singrauli Open Cast</option>
                <option>Korba Mine</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Period</label>
              <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)}>
                <option>2020 - 2024</option>
                <option>2023 - 2024</option>
                <option>Q1 2024</option>
                <option>Q4 2023</option>
                <option>FY 2023-24</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={generating}
            >
              {generating ? 'Generating...' : '+ Generate Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
