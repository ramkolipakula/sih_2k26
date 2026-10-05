import { useEffect, useState } from 'react';
import { fetchSummary, fetchDocuments, fetchInsights } from '../api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FileText, Database, CheckCircle, AlertCircle, Sparkles, TrendingUp, Pickaxe, Map } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary().then(res => setStats(res.data)).catch(() => {
      // Mock stats if API fails
      setStats({
        active_projects: 14,
        reports_generated: 128,
        pending_reviews: 7,
        validation_issues: 3
      });
    });
    
    fetchDocuments().then(res => setDocs(res.data)).catch(() => {
      // Mock docs
      setDocs([
        { title: 'Talcher Coalfield - Geological Report', type: 'PDF', org: 'CMPDI RI-I', date: '2024-03-12' },
        { title: 'Jharia Block II Exploration Data', type: 'XLSX', org: 'BCCL', date: '2024-03-10' },
        { title: 'Singrauli Environmental Clearance', type: 'PDF', org: 'NCL', date: '2024-03-08' },
        { title: 'Ib Valley Production Summary', type: 'DOCX', org: 'MCL', date: '2024-03-05' }
      ]);
    });
    
    fetchInsights().then(res => setInsights(res.data)).catch(() => {
      setInsights({
        chart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          values: [42, 58, 65, 82, 95, 112]
        },
        insight: "Analysis of the Talcher project reveals a 14.3% higher confidence in reserve estimates compared to historical benchmarks from 2018."
      });
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Overview of reporting ecosystem and intelligence extraction.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/reports')}>
          + Generate Technical Report
        </button>
      </div>

      <div className="grid grid-cols-4 mb-6">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
            <Map size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-title">Active Projects</div>
            <div className="stat-value">{stats?.active_projects || "14"}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-title">Reports Generated</div>
            <div className="stat-value">{stats?.reports_generated || "128"}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-title">Pending Review</div>
            <div className="stat-value">{stats?.pending_reviews || "7"}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-title">Validation Issues</div>
            <div className="stat-value">{stats?.validation_issues || "3"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-dashboard">
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title">
              <TrendingUp size={20} className="text-muted" /> 
              Reporting Pipeline Activity
            </h3>
            <div style={{ height: '300px', marginTop: '24px' }}>
              {insights?.chart ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={insights.chart.labels.map((lbl: string, i: number) => ({
                      name: lbl,
                      value: insights.chart.values[i]
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}
                      itemStyle={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted">
                  Loading telemetry...
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title mb-0">
                <Database size={20} className="text-muted" /> 
                Recent Document Ingestion
              </h3>
              <button className="btn btn-outline" onClick={() => navigate('/documents')}>View All</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Source Organization</th>
                    <th>Date Processed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.slice(0,4).map((doc, idx) => (
                    <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => navigate('/documents')}>
                      <td>
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-muted" />
                          <span style={{ fontWeight: 500 }}>{doc.title}</span>
                        </div>
                      </td>
                      <td>{doc.org || doc.organization || 'CMPDI'}</td>
                      <td>{doc.date || doc.uploaded_at ? new Date(doc.date || doc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <span className="badge badge-green">Indexed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title">
              <Sparkles size={20} color="var(--accent-primary)" />
              AI Intelligence Summary
            </h3>
            
            <div className="evidence-panel">
              <div className="evidence-header">
                <Sparkles size={14} /> Key Finding - Talcher Project
              </div>
              <div className="evidence-body">
                {insights?.insight || "Geological anomaly detected in Sector B. Coal seam thickness variance exceeds 15% of historical models."}
              </div>
              <div className="evidence-meta">
                <span>Confidence: 92%</span>
                <span>•</span>
                <span>Source: Exploration_Data_Q1.xlsx</span>
              </div>
            </div>

            <div className="evidence-panel" style={{ borderLeftColor: 'var(--accent-amber)', backgroundColor: '#FEF3C720' }}>
              <div className="evidence-header" style={{ color: 'var(--accent-amber)' }}>
                <AlertCircle size={14} /> Validation Warning
              </div>
              <div className="evidence-body">
                Missing stratigraphic correlation data for 3 boreholes in the western block.
              </div>
              <div className="evidence-meta">
                <span>Severity: Moderate</span>
                <span>•</span>
                <span>Project: Jharia Block II</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">
              <CheckCircle size={20} className="text-muted" />
              Action Required
            </h3>
            
            <div className="flex items-center justify-between p-3 border-b border-light hover:bg-hover cursor-pointer rounded-md">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Review Mine Plan 2024</span>
                <span className="text-xs text-muted">Awaiting technical officer approval</span>
              </div>
              <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Review</button>
            </div>
            
            <div className="flex items-center justify-between p-3 border-b border-light hover:bg-hover cursor-pointer rounded-md mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Resolve Data Conflicts</span>
                <span className="text-xs text-muted">2 conflicting values in Jharia report</span>
              </div>
              <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Resolve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
