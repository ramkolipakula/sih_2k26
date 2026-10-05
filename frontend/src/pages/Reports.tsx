import { useState, useEffect } from 'react';
import { fetchReports, generateReport } from '../api';
import { FileText, Download, CheckCircle, Sparkles } from 'lucide-react';

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
    }).catch(() => {
      setReports([
        { id: '1', title: 'Talcher Project Status Q1', report_type: 'Project Status Report', project: 'Talcher Coalfield', period: 'Q1 2024', status: 'PUBLISHED' },
        { id: '2', title: 'Jharia Production Summary', report_type: 'Mining Production Report', project: 'Jharia Coalfield', period: 'FY 2023-24', status: 'UNDER REVIEW' }
      ]);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerated(null);
    try {
      const res = await generateReport({ reportType, project, period });
      setGenerated(res.data);
      fetchReports().then(r => setReports(r.data));
    } catch {
      // Mock generated report
      setTimeout(() => {
        setGenerated({
          title: `${project} - ${reportType}`,
          summary: {
            executive_summary: "The analysis indicates standard operational performance with a minor deviation in stripping ratio.",
            key_findings: ["Production on target.", "Stripping ratio variance 2.4 vs 2.1.", "Exploration data validated."],
            sources_used: ["Exploration_Data.xlsx", "Previous_Quarter_Report.pdf"]
          }
        });
        setGenerating(false);
      }, 1500);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Technical Reports</h1>
        <p className="page-subtitle">AI-assisted report generation, technical review, and publication.</p>
      </div>

      <div className="grid grid-cols-dashboard">
        {/* Main Content: Report list & preview */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title">Report Repository</h3>
            {loading ? (
              <p className="text-muted p-4 text-center">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-muted p-4 text-center">No reports yet. Generate one using the form.</p>
            ) : (
              <div className="table-container mt-4">
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
                      <tr key={r.id} className="cursor-pointer">
                        <td>
                          <div className="flex items-center gap-2">
                             <FileText size={16} className="text-muted" />
                             <span className="font-medium text-text-primary">{r.title}</span>
                          </div>
                        </td>
                        <td className="text-secondary">{r.report_type}</td>
                        <td className="text-secondary">{r.project}</td>
                        <td className="text-secondary">{r.period}</td>
                        <td>
                          <span className={`badge ${r.status === 'PUBLISHED' ? 'badge-green' : 'badge-amber'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Generated report preview */}
          {generated && (
            <div className="card border-accent-primary border-t-4">
              <div className="flex justify-between items-center mb-6 border-b border-light pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><FileText size={20} className="text-accent-primary"/> {generated.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="badge badge-green flex items-center gap-1"><CheckCircle size={12}/> AI Draft Ready</span>
                  <button className="btn btn-primary btn-sm"><Download size={14} /> Export</button>
                  <button className="btn btn-outline btn-sm">Submit for Review</button>
                </div>
              </div>
              
              <div className="evidence-panel bg-app border-l-4 border-accent-primary p-4 rounded-r-lg mb-6">
                <div className="evidence-header text-accent-primary flex items-center gap-2 mb-2"><Sparkles size={16}/> Executive Summary</div>
                <div className="text-secondary leading-relaxed">{generated.summary?.executive_summary}</div>
              </div>
              
              <h4 className="font-semibold text-text-primary mb-3">Key Technical Findings</h4>
              <ul className="list-disc pl-5 mb-6 text-secondary space-y-2">
                {(generated.summary?.key_findings || []).map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              
              {generated.summary?.sources_used?.length > 0 && (
                <>
                  <h4 className="font-semibold text-text-primary mb-3">Traceable Evidence Sources</h4>
                  <ul className="list-disc pl-5 text-muted text-sm space-y-1">
                    {generated.summary.sources_used.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Generate form sidebar */}
        <div className="card h-fit">
          <h3 className="section-title"><Sparkles size={20} className="text-accent-primary" /> Generate Report</h3>
          <form onSubmit={handleGenerate} className="mt-4">
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select className="form-control" value={reportType} onChange={e => setReportType(e.target.value)}>
                <option>Mining Production Report</option>
                <option>Geological Report</option>
                <option>Exploration Summary</option>
                <option>Environmental Report</option>
                <option>Hydrogeological Report</option>
                <option>Project Status Report</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mine / Project Context</label>
              <select className="form-control" value={project} onChange={e => setProject(e.target.value)}>
                <option>Jharia Coalfield</option>
                <option>Bokaro Block</option>
                <option>Odisha Block</option>
                <option>Raniganj Coalfield</option>
                <option>Talcher Coalfield</option>
                <option>Singrauli Open Cast</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Time Period</label>
              <select className="form-control" value={period} onChange={e => setPeriod(e.target.value)}>
                <option>2020 - 2024</option>
                <option>2023 - 2024</option>
                <option>Q1 2024</option>
                <option>FY 2023-24</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Instructions (Optional)</label>
              <textarea className="form-control" rows={3} placeholder="E.g., Focus on coal seam thickness variations..."></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={generating}
            >
              {generating ? 'Processing Data...' : 'Generate AI Draft'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
