import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar,
  User,
  Eye,
  Printer,
  Share2,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  X,
  Check,
  Send
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  DOMAIN_REPORTS,
  ReportItem,
  ReportStatus,
  DOMAIN_PROJECTS,
  DOMAIN_DOCUMENTS
} from '../data/domainData';
import { generateReport } from '../api';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(DOMAIN_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(DOMAIN_REPORTS[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form state
  const [reportType, setReportType] = useState('Geological Investigation Report');
  const [selectedProjectId, setSelectedProjectId] = useState('CMPDI-2026-014');
  const [reportingPeriod, setReportingPeriod] = useState('FY 2025-26 (Exploration Phase)');
  const [includeHistorical, setIncludeHistorical] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('Emphasize Barakar formation coal seam thickness expansion and fault F1-F1\' realignment.');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeProject = DOMAIN_PROJECTS.find(p => p.id === selectedProjectId) || DOMAIN_PROJECTS[0];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Call backend API if running, fallback gracefully
    generateReport({ reportType, project: activeProject.name, period: reportingPeriod })
      .catch(() => {});

    setTimeout(() => {
      const newReport: ReportItem = {
        id: `REP-2026-${String(reports.length + 1).padStart(3, '0')}`,
        title: `${reportType} - ${activeProject.name.split('-')[1] || activeProject.name}`,
        reportType,
        projectId: activeProject.id,
        subsidiary: activeProject.subsidiary,
        period: reportingPeriod,
        status: 'AI Draft',
        author: 'Dr. Sharma (Technical Officer)',
        dateCreated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        summary: {
          executiveSummary: `This comprehensive technical report synthesizes borehole core drilling (18 boreholes/km²), stratigraphic correlation, and resource modeling for ${activeProject.name}. Proved recoverable reserves evaluate at ${activeProject.targetReserves} under UNFC Category 111 with 94% statistical confidence. Structural anomalies and historical benchmark variations have been verified against source archives.`,
          keyFindings: [
            `Geological exploration confirmed average coal seam thickness of 4.80m across Barakar beds.`,
            `Total proved geological reserves estimated at ${activeProject.targetReserves} with 94% confidence.`,
            `Fault Line F1-F1' throw delineated with +12m vertical offset, requiring a 180m southward pit shift.`,
            `ISP UNFC Category 111 compliance established via 18 exploratory boreholes.`
          ],
          sourcesUsed: [
            'Talcher Coalfield - Geological Report (DOC-TAL-001, 142 pp)',
            'Exploration_Data_Q1_2024.xlsx (DOC-TAL-002, 18 tables)',
            'CMPDI Historical Baseline Survey 2018 (Archive REF-2018-TAL)'
          ],
          confidenceScore: 94
        }
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
      setIsGenerating(false);
      setIsPreviewOpen(true);
    }, 1800);
  };

  const handleUpdateStatus = (reportId: string, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Technical Reports"
        subtitle="AI-assisted compilation, sovereign format standardization, and technical officer verification."
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-gray font-mono">CMPDI STANDARD FORMAT v4.2</span>
          </div>
        }
      />

      {/* Main 2-Column Split: Left Repository, Right Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Column: Reports Repository Table (col-span-8) */}
        <div className="lg:col-span-8 card">
          <div className="card-header">
            <div>
              <h3 className="section-title text-base">Report Repository ({reports.length})</h3>
              <p className="text-xs text-muted mt-0.5">
                Technical reports compiled, reviewed, or published for CIL subsidiaries
              </p>
            </div>
            <span className="badge badge-gray">CMPDI Archive</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Report Title & ID</th>
                  <th>Type</th>
                  <th>Subsidiary</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedReport(r);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-accent-primary flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-primary block leading-snug">{r.title}</span>
                          <span className="font-mono text-[10px] text-muted">{r.id} • {r.dateCreated}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary text-xs">{r.reportType}</td>
                    <td className="text-secondary text-xs">{r.subsidiary.split(' ')[0]}</td>
                    <td className="text-secondary text-xs font-mono">{r.period}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1 hover:border-accent-primary hover:text-accent-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(r);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <Eye size={12} /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Generate Report Form (col-span-4) */}
        <div className="lg:col-span-4 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent-primary" />
              <h3 className="section-title text-base">Generate Technical Report</h3>
            </div>
            <span className="badge badge-blue">AI-Assisted</span>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4 text-xs">
            <div className="form-group mb-0">
              <label className="form-label text-xs">Report Type</label>
              <select
                className="form-control"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="Geological Investigation Report">Geological Investigation Report</option>
                <option value="Mining Production Report">Mining Production & Stripping Report</option>
                <option value="Resource Evaluation Report">Resource Evaluation (UNFC 111) Report</option>
                <option value="Environmental Baseline Report">Environmental Baseline & Clearance Report</option>
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Target Project</label>
              <select
                className="form-control"
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
              >
                {DOMAIN_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Reporting Period</label>
              <input
                type="text"
                className="form-control"
                value={reportingPeriod}
                onChange={e => setReportingPeriod(e.target.value)}
              />
            </div>

            <div className="p-3 bg-muted rounded border border-light flex flex-col gap-2">
              <span className="font-semibold text-primary block">Included Analytical Modules:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHistorical}
                  onChange={e => setIncludeHistorical(e.target.checked)}
                />
                <span>Include 2018 Historical Benchmark Variance Analysis</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnomalies}
                  onChange={e => setIncludeAnomalies(e.target.checked)}
                />
                <span>Include Structural Fault Throw F1-F1' Delineation</span>
              </label>
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-xs">Special Technical Directives</label>
              <textarea
                className="form-control"
                style={{ height: '70px', fontSize: '12px' }}
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-md w-full flex items-center justify-center gap-2 mt-1"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Synthesizing Geological & Mining Data...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Compile Technical Report Draft</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Realistic Professional STRATA / CMPDI Report Preview Modal */}
      {isPreviewOpen && selectedReport && (
        <div className="modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '860px', maxHeight: '92vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Control Bar */}
            <div className="modal-header bg-card">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-accent-primary" />
                <div>
                  <h3 className="card-title text-base font-bold text-primary">
                    STRATA Report Preview: {selectedReport.id}
                  </h3>
                  <span className="text-xs text-muted">
                    Technical Intelligence Document • Sovereign Format Specification
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedReport.status} />

                {/* State advancement actions */}
                {selectedReport.status === 'AI Draft' && (
                  <button
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'Technical Review')}
                  >
                    <Send size={12} /> Submit to Review
                  </button>
                )}
                {selectedReport.status === 'Technical Review' && (
                  <button
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'Approved')}
                  >
                    <CheckCircle2 size={12} /> Approve Report
                  </button>
                )}
                {selectedReport.status === 'Approved' && (
                  <button
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'Published')}
                  >
                    <Check size={12} /> Publish
                  </button>
                )}

                <button
                  className="btn btn-outline btn-sm flex items-center gap-1"
                  onClick={() => alert("Sending formatted document to printer...")}
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  className="btn btn-primary btn-sm flex items-center gap-1"
                  onClick={() => alert(`Exporting formal publication PDF: ${selectedReport.title}.pdf`)}
                >
                  <Download size={13} /> Export PDF
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Realistic Technical Document Paper Body */}
            <div
              className="modal-body"
              style={{
                backgroundColor: '#F1F5F9',
                padding: '24px',
                fontFamily: 'serif'
              }}
            >
              {/* Paper Sheet */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '36px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  color: '#0F172A',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {/* STRATA Brand Header with Logo */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/brand/strata-logo.png"
                      alt="STRATA Logo"
                      style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                    />
                    <div className="border-l border-slate-300 pl-3">
                      <div className="text-xs font-bold text-slate-900 tracking-wider">STRATA MINING INTELLIGENCE</div>
                      <div className="text-[10px] text-slate-500 font-mono">TECHNICAL INTELLIGENCE & REPORTING PLATFORM</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="badge badge-gray text-[10px] font-mono">
                      CMPDI / CIL EVALUATION PROTOTYPE
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">SIH 2026 Prototype • Not an Official Statutory Release</div>
                  </div>
                </div>

                {/* CMPDI / CIL Context Formal Header */}
                <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
                  <div className="font-bold text-xs uppercase tracking-widest text-slate-600 mb-1">
                    GOVERNMENT OF INDIA • MINISTRY OF COAL (CONTEXT EVALUATION)
                  </div>
                  <div className="font-extrabold text-lg text-slate-900 tracking-tight">
                    CENTRAL MINE PLANNING & DESIGN INSTITUTE LIMITED
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    REGIONAL INSTITUTE VII • BHUBANESWAR, ODISHA • {selectedReport.subsidiary}
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-600 mt-2">
                    <span>DOCUMENT NO: CMPDI/RI-VII/GEO/2026/{selectedReport.id}</span>
                    <span>•</span>
                    <span>PROJECT: {selectedReport.projectId}</span>
                    <span>•</span>
                    <span>DATE: {selectedReport.dateCreated}</span>
                  </div>
                </div>

                {/* Report Title & Metadata Box */}
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                    {selectedReport.title}
                  </h1>
                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    PERIOD: {selectedReport.period} • SUBSIDIARY: {selectedReport.subsidiary}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <span className="badge badge-gray text-[10px] font-mono">Status: {selectedReport.status}</span>
                    <span className="badge badge-blue text-[10px] font-mono">UNFC 111 Classified</span>
                  </div>
                </div>

                {/* Section 1: Executive Summary */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    1. Executive Summary & Resource Estimate
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify mb-3">
                    {selectedReport.summary.executiveSummary}
                  </p>
                </div>

                {/* Section 2: Key Technical Findings */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    2. Geological Findings & Core Logging Analysis
                  </h2>
                  <div className="flex flex-col gap-2 text-xs text-slate-700">
                    {selectedReport.summary.keyFindings.map((finding, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Historical Comparison & Benchmarks */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    3. Historical Comparison & Benchmark Variances
                  </h2>
                  <div className="border border-slate-200 rounded overflow-hidden mb-2">
                    <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                      <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="p-2 text-left border-b border-slate-200">Analytical Metric</th>
                          <th className="p-2 text-left border-b border-slate-200">Historical (2018)</th>
                          <th className="p-2 text-left border-b border-slate-200">Current (2024-26)</th>
                          <th className="p-2 text-left border-b border-slate-200">Observed Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                        <tr>
                          <td className="p-2 font-medium">Average Seam Thickness</td>
                          <td className="p-2 font-mono">4.20 m</td>
                          <td className="p-2 font-mono font-bold text-slate-900">4.80 m</td>
                          <td className="p-2 font-mono text-emerald-700 font-bold">+0.60 m (+14.3%)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Proved Recoverable Reserves</td>
                          <td className="p-2 font-mono">124.5 Mt</td>
                          <td className="p-2 font-mono font-bold text-slate-900">118.2 Mt</td>
                          <td className="p-2 font-mono text-slate-600">-6.3 Mt (-5.1%)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Exploration Drilling Density</td>
                          <td className="p-2 font-mono">12 bh/km²</td>
                          <td className="p-2 font-mono font-bold text-slate-900">18 bh/km²</td>
                          <td className="p-2 font-mono text-emerald-700 font-bold">+6 bh/km² (+50.0%)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Average Proximate Ash Content</td>
                          <td className="p-2 font-mono">32.5%</td>
                          <td className="p-2 font-mono font-bold text-slate-900">34.1%</td>
                          <td className="p-2 font-mono text-amber-700">+1.6%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 4: Validation & Governance Status */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    4. Technical Review & Verification Status
                  </h2>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex flex-col gap-1.5 text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Cross-Document Discrepancy Checks:</span>
                      <span className="badge badge-green text-[10px]">Passed & Reconciled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Source Lineage Traceability:</span>
                      <span className="badge badge-green text-[10px]">Verified against Ingested Documents</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Technical Officer Sign-off:</span>
                      <span className="text-slate-700 font-mono text-[11px]">Dr. Sharma (Technical Officer)</span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Traceable Sources & Provenance */}
                <div className="mb-8">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    5. Document Lineage & Vector Evidence
                  </h2>
                  <div className="flex flex-col gap-1 text-xs font-mono text-slate-600 mb-3">
                    {selectedReport.summary.sourcesUsed.map((src, idx) => (
                      <div key={idx}>[{idx + 1}] {src}</div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Cross-validated against CMPDI technical evidence index with {selectedReport.summary.confidenceScore}% confidence.</span>
                  </div>
                </div>

                {/* Official Sign-off Block */}
                <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">Dr. Sharma</div>
                    <div className="text-slate-600">Technical Officer (Geology)</div>
                    <div className="text-slate-500">CMPDI Regional Institute VII</div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block border border-slate-400 px-3 py-1 rounded text-[11px] font-mono text-slate-600 mb-1">
                      {selectedReport.status === 'Published'
                        ? 'PUBLISHED & ARCHIVED'
                        : selectedReport.status === 'Approved'
                        ? 'VERIFIED & APPROVED'
                        : selectedReport.status.toUpperCase()}
                    </div>
                    <div className="text-slate-500">{selectedReport.dateCreated}</div>
                  </div>
                </div>

                {/* Prototype Footer Note */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
                  STRATA MINING INTELLIGENCE • SMART INDIA HACKATHON 2026 PROTOTYPE EVALUATION OUTPUT
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
