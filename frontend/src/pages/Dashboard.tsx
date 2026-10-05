import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FolderKanban,
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Database,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import {
  DOMAIN_PROJECTS,
  DOMAIN_DOCUMENTS,
  DOMAIN_VALIDATION_CHECKS,
  DOMAIN_HISTORICAL_COMPARISONS
} from '../data/domainData';
import { fetchSummary, fetchDocuments, fetchInsights } from '../api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Metrics state
  const [stats, setStats] = useState({
    active_projects: DOMAIN_PROJECTS.length,
    reports_generated: 128,
    pending_reviews: 7,
    validation_issues: 3
  });

  // Recent docs
  const [recentDocs, setRecentDocs] = useState<any[]>(DOMAIN_DOCUMENTS);

  // Evidence modal state
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceData | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  // Pipeline telemetry chart
  const pipelineData = [
    { month: 'Oct 2025', ingested: 28, processed: 26, validated: 24 },
    { month: 'Nov 2025', ingested: 42, processed: 40, validated: 38 },
    { month: 'Dec 2025', ingested: 58, processed: 55, validated: 52 },
    { month: 'Jan 2026', ingested: 72, processed: 69, validated: 65 },
    { month: 'Feb 2026', ingested: 95, processed: 91, validated: 88 },
    { month: 'Mar 2026', ingested: 128, processed: 124, validated: 118 },
  ];

  useEffect(() => {
    // Attempt backend sync, fallback gracefully to coherent domain store
    fetchSummary()
      .then(res => {
        if (res?.data) {
          setStats(prev => ({
            ...prev,
            active_projects: res.data.active_projects || prev.active_projects,
            reports_generated: res.data.reports_generated || prev.reports_generated,
            pending_reviews: res.data.pending_tasks || prev.pending_reviews,
            validation_issues: prev.validation_issues
          }));
        }
      })
      .catch(() => {});

    fetchDocuments()
      .then(res => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setRecentDocs(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const openTalcherEvidence = () => {
    setSelectedEvidence({
      claim: "Barakar formation coal seam thickness in Sector B averages 4.80m, representing a +14.3% increase over the 2018 historical benchmark.",
      sourceDocument: "Talcher Coalfield - Geological Report (DOC-TAL-001)",
      documentId: "DOC-TAL-001",
      pageNumber: 32,
      section: "Chapter 3: Stratigraphy & Borehole Evaluation",
      extractedValue: "4.80 m (Composite average across 18 boreholes)",
      historicalBenchmark: "4.20 m (2018 Master Baseline)",
      variance: "+0.60 m (+14.3%)",
      confidenceScore: 94,
      verificationStatus: "Verified",
      verifyingOfficer: "Dr. Sharma (Technical Officer, CMPDI)",
      citationSnippet: "Analysis of 18 exploratory boreholes (BH-TAL-01 to BH-TAL-08) in Sector B confirms composite coal seam intersection thickness averaging 4.80 meters with standard deviation of 0.32m."
    });
    setIsEvidenceOpen(true);
  };

  const openValidationWarningEvidence = () => {
    setSelectedEvidence({
      claim: "Borehole exploration density cited as 18 boreholes/km² in Section 2, but cited as 15 boreholes/km² in Appendix Table 3.2.",
      sourceDocument: "DOC-TAL-001 vs DOC-TAL-002",
      documentId: "VAL-002",
      pageNumber: 118,
      section: "Appendix B: Tabular Exploration Telemetry",
      extractedValue: "18 boreholes/km²",
      historicalBenchmark: "15 boreholes/km²",
      variance: "Discrepancy of 3 infill boreholes",
      confidenceScore: 91,
      verificationStatus: "Flagged",
      verifyingOfficer: "Validation Rule Engine (Automated)",
      citationSnippet: "Notice: Infill drilling Q1 2024 added 3 peripheral boreholes to western perimeter that require inclusion in the formal appendix summary tables."
    });
    setIsEvidenceOpen(true);
  };

  return (
    <div>
      {/* Global Page Header */}
      <PageHeader
        title="Executive Dashboard"
        subtitle="National mining intelligence, borehole stratigraphy, and technical reporting overview."
        actions={
          <div className="flex items-center gap-3">
            <button className="btn btn-outline btn-md" onClick={() => navigate('/documents')}>
              Upload Document
            </button>
            <button className="btn btn-primary btn-md flex items-center gap-2" onClick={() => navigate('/reports')}>
              <FileText size={16} /> Generate Technical Report
            </button>
          </div>
        }
      />

      {/* 4 Standardized Metric Cards */}
      <div className="grid grid-cols-4 mb-6">
        <MetricCard
          label="Active Projects"
          value={stats.active_projects}
          subtext="+2 added this quarter"
          icon={<FolderKanban size={22} />}
          iconBgColor="#EFF6FF"
          iconColor="#2563EB"
          onClick={() => navigate('/projects')}
        />
        <MetricCard
          label="Reports Generated"
          value={stats.reports_generated}
          subtext="24 published this quarter"
          icon={<FileText size={22} />}
          iconBgColor="#DCFCE7"
          iconColor="#16A34A"
          onClick={() => navigate('/reports')}
        />
        <MetricCard
          label="Pending Review"
          value={stats.pending_reviews}
          subtext="3 high-priority reviews"
          icon={<Clock size={22} />}
          iconBgColor="#FEF3C7"
          iconColor="#D97706"
          onClick={() => navigate('/validation')}
        />
        <MetricCard
          label="Validation Issues"
          value={stats.validation_issues}
          subtext="1 critical • 2 warnings"
          icon={<AlertTriangle size={22} />}
          iconBgColor="#FEE2E2"
          iconColor="#DC2626"
          onClick={() => navigate('/validation')}
        />
      </div>

      {/* Main 2-Column Responsive Dashboard Grid */}
      <div className="grid grid-cols-dashboard">
        {/* Left Column: Reporting Pipeline Chart & Recent Document Ingestion */}
        <div className="flex flex-col gap-6">
          {/* Reporting Pipeline Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="section-title">
                  <TrendingUp size={18} className="text-accent-primary" />
                  Reporting Pipeline & Extraction Throughput
                </h3>
                <p className="text-xs text-muted mt-1">
                  Cumulative documents ingested, processed, and validated through CMPDI knowledge base
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-gray">FY 2025-26</span>
              </div>
            </div>

            <div style={{ height: '300px', width: '100%', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={pipelineData}
                  margin={{ top: 12, right: 16, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientIngested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradientValidated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-md)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ingested"
                    name="Ingested Documents"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientIngested)"
                  />
                  <Area
                    type="monotone"
                    dataKey="validated"
                    name="Validated Intelligence"
                    stroke="#16A34A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientValidated)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span style={{ width: '10px', height: '10px', backgroundColor: '#2563EB', borderRadius: '2px' }} />
                Ingested Documents
              </span>
              <span className="flex items-center gap-2">
                <span style={{ width: '10px', height: '10px', backgroundColor: '#16A34A', borderRadius: '2px' }} />
                Validated Technical Insights
              </span>
            </div>
          </div>

          {/* Recent Document Ingestion Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="section-title">
                  <Database size={18} className="text-secondary" />
                  Recent Document Ingestion
                </h3>
                <p className="text-xs text-muted mt-1">
                  Latest technical reports, exploration spreadsheets, and mine plans loaded into vector store
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/documents')}>
                View All Documents
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Organization</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.slice(0, 4).map((doc, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => navigate('/documents')}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <FileText size={16} className="text-muted flex-shrink-0" />
                          <span className="font-semibold text-primary">
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted text-xs">
                        {doc.documentType || doc.document_type || 'Geological Report'}
                      </td>
                      <td className="text-secondary">
                        {doc.organization || doc.org || 'CMPDI'}
                      </td>
                      <td className="text-muted text-xs">
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '12 Mar 2024'}
                      </td>
                      <td>
                        <StatusBadge status={doc.status || 'INDEXED'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Intelligence Summary & Action Required Items */}
        <div className="flex flex-col gap-6">
          {/* AI Intelligence Summary Card */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent-primary" />
                <h3 className="section-title text-base">AI Intelligence Summary</h3>
              </div>
              <span className="badge badge-blue">AI-Assisted Synthesis</span>
            </div>

            {/* Structured Key Finding Panel */}
            <div className="evidence-panel">
              <div className="evidence-header">
                <Sparkles size={14} /> Key Finding - Talcher Coalfield (Sector B)
              </div>
              <p className="evidence-body">
                Barakar formation coal seam thickness in Sector B averages 4.80m, representing a +14.3% increase over the 2018 historical benchmark. Total proved reserves estimated at 118.2 Mt.
              </p>
              <div className="evidence-meta">
                <span className="font-semibold text-accent-primary">Confidence: 94%</span>
                <span>•</span>
                <span>Source: DOC-TAL-001 (Page 32)</span>
                <span>•</span>
                <button
                  className="btn btn-ghost btn-sm p-0 text-accent-primary font-semibold flex items-center gap-1 hover:underline"
                  onClick={openTalcherEvidence}
                >
                  <ExternalLink size={12} /> View Evidence Trace
                </button>
              </div>
            </div>

            {/* Validation Warning Box */}
            <div
              className="evidence-panel mt-4"
              style={{
                backgroundColor: '#FEF3C720',
                borderLeftColor: 'var(--status-warning)',
                borderColor: '#FDE68A'
              }}
            >
              <div className="evidence-header" style={{ color: 'var(--status-warning)' }}>
                <AlertTriangle size={14} /> Validation Warning - Jharia Block II
              </div>
              <p className="evidence-body">
                Borehole density cited as 18 boreholes/km² in Section 2, but referenced as 15 boreholes/km² in Appendix Table 3.2.
              </p>
              <div className="evidence-meta">
                <span className="font-semibold text-warning">Severity: Moderate</span>
                <span>•</span>
                <span>Project: CMPDI-2026-015</span>
                <span>•</span>
                <button
                  className="btn btn-ghost btn-sm p-0 text-warning font-semibold flex items-center gap-1 hover:underline"
                  onClick={openValidationWarningEvidence}
                >
                  <ExternalLink size={12} /> Inspect Discrepancy
                </button>
              </div>
            </div>
          </div>

          {/* Action Required Items */}
          <div className="card">
            <div className="card-header">
              <h3 className="section-title text-base">
                <ShieldCheck size={18} className="text-secondary" />
                Action Required (Governance)
              </h3>
              <span className="badge badge-amber">2 Items Pending</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 border border-light rounded-md bg-muted hover:bg-hover transition-colors flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-primary">Technical Review Sign-off</div>
                  <div className="text-xs text-muted mt-0.5">Talcher Coalfield reserve calculations awaiting sign-off</div>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate('/validation')}
                >
                  Review
                </button>
              </div>

              <div className="p-3 border border-light rounded-md bg-muted hover:bg-hover transition-colors flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-primary">Resolve Jharia Seam Discrepancy</div>
                  <div className="text-xs text-muted mt-0.5">2 numerical conflicts flagged in borehole telemetry</div>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate('/validation')}
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Traceable Evidence Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
};

export default Dashboard;
