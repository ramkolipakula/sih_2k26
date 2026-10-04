
import { useEffect, useState } from 'react';
import { fetchSummary, fetchDocuments, fetchInsights, generateReport, searchQdrant } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary().then(res => setStats(res.data));
    fetchDocuments().then(res => setDocs(res.data));
    fetchInsights().then(res => setInsights(res.data));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(query) {
       navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleChip = (text: string) => {
    setQuery(text);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Report Generation Triggered! See Reports tab.");
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <form onSubmit={handleSearch} className="hero-search">
          <input 
            type="text" 
            placeholder="Ask a question about CMPDI/CIL reports..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="chip-container">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Try asking:</span>
          <div className="chip" onClick={() => handleChip("What was the coal production at Jharia in 2023?")}>What was the coal production at Jharia in 2023?</div>
          <div className="chip" onClick={() => handleChip("Show exploration projects in Odisha")}>Show exploration projects in Odisha</div>
          <div className="chip" onClick={() => handleChip("Generate a mine plan summary for BCCL")}>Generate a mine plan summary for BCCL</div>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#F0E6D8' }}>🪨</div>
          <div className="stat-info">
            <div className="stat-title">Geological Reports</div>
            <div className="stat-value">{stats?.geological_reports || "..."}</div>
            <div className="stat-sub">Documents</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FFF0E5' }}>⛏️</div>
          <div className="stat-info">
            <div className="stat-title">Mining Reports</div>
            <div className="stat-value">{stats?.mining_reports || "..."}</div>
            <div className="stat-sub">Documents</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E5F0FF', color: '#1976D2' }}>📡</div>
          <div className="stat-info">
            <div className="stat-title">Exploration Data</div>
            <div className="stat-value">{stats?.exploration_data || "..."}</div>
            <div className="stat-sub">Datasets</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FBE9E7', color: '#D84315' }}>📋</div>
          <div className="stat-info">
            <div className="stat-title">Pending Reviews</div>
            <div className="stat-value">{stats?.pending_tasks || "..."}</div>
            <div className="stat-sub">Items</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-dashboard">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Documents</h3>
            <a href="/documents" style={{ color: 'var(--accent-orange)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>View All &gt;</a>
          </div>
          <table>
            <tbody>
              {docs.slice(0,4).map((doc, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={`doc-type-icon ${doc.document_type.includes('Exploration') ? 'doc-type-xls' : 'doc-type-pdf'}`}>
                        {doc.document_type.includes('Exploration') ? 'XLS' : 'PDF'}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {doc.organization} • {doc.page_count} pages • {doc.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    12 Mar 2024
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid" style={{ gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 Generate Report
            </h3>
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <select className="form-select">
                  <option>Mining Production Report</option>
                  <option>Geological Report</option>
                  <option>Exploration Summary</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Mine/Project</label>
                <select className="form-select">
                  <option>Jharia Coalfield</option>
                  <option>Bokaro Block</option>
                  <option>Odisha Block</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Period</label>
                <select className="form-select">
                  <option>2020 - 2024</option>
                  <option>2023 - 2024</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>+ Generate Report</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Insights at a Glance
            </h3>
            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              {/* Fake chart bars */}
              {insights?.chart.values.map((v: number, i: number) => (
                <div key={i} style={{ flex: 1, backgroundColor: 'var(--accent-orange)', height: `${v}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} title={insights.chart.labels[i]}></div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {insights?.chart.title}
            </div>
            
            <div className="ai-insight">
              <div className="ai-insight-title">✨ AI Insight</div>
              <div className="ai-insight-text">{insights?.insight}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
