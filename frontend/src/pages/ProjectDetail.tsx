import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FolderKanban,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  User,
  Layers,
  FileText,
  BarChart3,
  History,
  Bot,
  CheckSquare2,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Download,
  AlertTriangle,
  CheckCircle2,
  Database,
  Pickaxe
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import {
  DOMAIN_PROJECTS,
  DOMAIN_DOCUMENTS,
  DOMAIN_STRATIGRAPHY,
  DOMAIN_BOREHOLES,
  DOMAIN_ANOMALIES,
  DOMAIN_HISTORICAL_COMPARISONS,
  DOMAIN_VALIDATION_CHECKS,
  DOMAIN_REPORTS,
  DOMAIN_AUDIT_TRAIL,
  DOMAIN_MINING_METRICS
} from '../data/domainData';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Find project or default to Talcher
  const project = DOMAIN_PROJECTS.find(p => p.id === projectId) || DOMAIN_PROJECTS[0];

  // Active Tab state
  type TabType = 'overview' | 'documents' | 'geological' | 'mining' | 'historical' | 'ai' | 'validation' | 'reports' | 'audit';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Filter project-specific data
  const projectDocs = DOMAIN_DOCUMENTS.filter(d => d.projectId === project.id || d.title.toLowerCase().includes('talcher'));
  const projectReports = DOMAIN_REPORTS.filter(r => r.projectId === project.id);
  const projectAudits = DOMAIN_AUDIT_TRAIL.filter(a => a.projectId === project.id);

  // Evidence modal state
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceData | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const openEvidence = (metric: string, source: string, page: number, val: string, hist: string, conf: number) => {
    setSelectedEvidence({
      claim: `${metric} evaluated at ${val} compared with ${hist} in master baseline.`,
      sourceDocument: source,
      pageNumber: page,
      extractedValue: val,
      historicalBenchmark: hist,
      confidenceScore: conf,
      verificationStatus: 'Verified',
      verifyingOfficer: project.owner
    });
    setIsEvidenceOpen(true);
  };

  return (
    <div>
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-outline btn-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Projects Workspace
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <button
            className="btn btn-primary btn-sm flex items-center gap-1.5"
            onClick={() => navigate('/reports')}
          >
            <FileText size={14} /> Generate Project Report
          </button>
        </div>
      </div>

      {/* Project Master Info Header Card */}
      <div className="card mb-6" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {project.id}
              </span>
              <span className="text-xs text-muted font-medium">
                {project.projectType}
              </span>
            </div>
            <h1 className="text-xl font-bold text-primary mt-1.5 mb-2">
              {project.name}
            </h1>
            <p className="text-sm text-secondary max-w-4xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Metadata Strip */}
        <div
          className="grid grid-cols-4 gap-4 mt-5 pt-4 border-t border-light"
          style={{ fontSize: '0.8125rem' }}
        >
          <div>
            <span className="text-xs text-muted block mb-0.5">Subsidiary & Basin</span>
            <span className="font-semibold text-secondary flex items-center gap-1.5">
              <Building2 size={14} className="text-subtle" /> {project.subsidiary}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted block mb-0.5">Geographical Location</span>
            <span className="font-semibold text-secondary flex items-center gap-1.5">
              <MapPin size={14} className="text-subtle" /> {project.location}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted block mb-0.5">Technical Review Officer</span>
            <span className="font-semibold text-secondary flex items-center gap-1.5">
              <User size={14} className="text-subtle" /> {project.owner}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted block mb-0.5">Proved Geological Reserves</span>
            <span className="font-bold text-primary flex items-center gap-1.5">
              <Pickaxe size={14} className="text-accent-primary" /> {project.targetReserves} (UNFC 111)
            </span>
          </div>
        </div>
      </div>

      {/* Unified 9-Tab Workspace Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Layers size={15} /> Overview & Telemetry
        </button>

        <button
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={15} /> Documents ({projectDocs.length})
        </button>

        <button
          className={`tab-button ${activeTab === 'geological' ? 'active' : ''}`}
          onClick={() => setActiveTab('geological')}
        >
          <Database size={15} /> Geological Stratigraphy
        </button>

        <button
          className={`tab-button ${activeTab === 'mining' ? 'active' : ''}`}
          onClick={() => setActiveTab('mining')}
        >
          <BarChart3 size={15} /> Mining Analytics
        </button>

        <button
          className={`tab-button ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveTab('historical')}
        >
          <History size={15} /> Historical Comparison
        </button>

        <button
          className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Bot size={15} /> AI Analysis
        </button>

        <button
          className={`tab-button ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          <CheckSquare2 size={15} /> Validation & Checks
        </button>

        <button
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={15} /> Reports ({projectReports.length})
        </button>

        <button
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldAlert size={15} /> Audit Trail ({projectAudits.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-dashboard gap-6">
          <div className="flex flex-col gap-6">
            <div className="card">
              <h3 className="section-title text-base mb-3">Project Summary & Exploration Scope</h3>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                The {project.name} represents a major detailed exploration campaign conducted by CMPDI RI-VII. The target area encompasses Sector B of the Talcher Basin, focusing on stratigraphic delineation of Seams I through VIII in the Barakar formation.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-light">
                <div className="p-3 bg-muted rounded border border-light">
                  <span className="text-xs text-muted block mb-1">Drilling Density</span>
                  <span className="text-base font-bold text-primary">{project.drillingDensity}</span>
                  <span className="text-xs text-secondary mt-0.5 block">18 Boreholes drilled</span>
                </div>
                <div className="p-3 bg-muted rounded border border-light">
                  <span className="text-xs text-muted block mb-1">Seams Identified</span>
                  <span className="text-base font-bold text-primary">{project.seamsIdentified} Seams</span>
                  <span className="text-xs text-secondary mt-0.5 block">Seams I to VIII</span>
                </div>
                <div className="p-3 bg-muted rounded border border-light">
                  <span className="text-xs text-muted block mb-1">ISP UNFC Status</span>
                  <span className="text-base font-bold text-success">Category 111</span>
                  <span className="text-xs text-secondary mt-0.5 block">Proved Economical</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="section-title text-base mb-3">Structural & Geological Highlights</h3>
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded border border-light bg-muted flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-primary block">Seam Lateral Continuity</span>
                    <span className="text-xs text-secondary">
                      Barakar formation coal seams exhibit persistent thickness across Sector B with minimal facies variance.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded border border-amber-200 bg-amber-50 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-warning block">Fault Throw Demarcation</span>
                    <span className="text-xs text-secondary">
                      Fault line F1-F1' identified with +12m vertical throw offset at BH-TAL-04, requiring opencast pit adjustment.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card">
              <h3 className="section-title text-base mb-3">Key Project Ingestion Assets</h3>
              <div className="flex flex-col gap-2.5">
                {projectDocs.slice(0, 3).map((doc, i) => (
                  <div key={i} className="p-3 border border-light rounded bg-muted flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-accent-primary" />
                      <div>
                        <div className="text-xs font-semibold text-primary">{doc.title}</div>
                        <div className="text-xs text-muted">{doc.documentType} • {doc.pageCount} pp</div>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title text-base mb-2">Technical Sign-off Pipeline</h3>
              <p className="text-xs text-muted mb-4">
                Sequential validation by CMPDI technical review board
              </p>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-muted">
                  <span className="font-medium text-secondary">1. Ingestion & Embedding</span>
                  <span className="badge badge-green">Completed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted">
                  <span className="font-medium text-secondary">2. Stratigraphy & Borehole Cross-check</span>
                  <span className="badge badge-green">Completed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                  <span className="font-semibold text-warning">3. Technical Officer Sign-off</span>
                  <span className="badge badge-amber">Awaiting Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Documents */}
      {activeTab === 'documents' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title text-base">Project Documents Repository</h3>
              <p className="text-xs text-muted mt-0.5">Ingested exploration reports, borehole assay sheets, and baseline clearances</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/documents')}>
              Upload New Document
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Format</th>
                  <th>Pages</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projectDocs.map((doc, idx) => (
                  <tr key={idx} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-muted flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-primary block">{doc.title}</span>
                          <span className="text-xs text-muted">{doc.organization}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{doc.documentType}</td>
                    <td className="text-secondary">{doc.year}</td>
                    <td>
                      <span className="font-mono text-xs uppercase px-1.5 py-0.5 bg-muted rounded border border-light">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="text-secondary">{doc.pageCount}</td>
                    <td><StatusBadge status={doc.status} /></td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm py-1 px-2.5 text-xs"
                        onClick={() => navigate('/documents')}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Geological Stratigraphy & Borehole Logs */}
      {activeTab === 'geological' && (
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title text-base mb-3">Stratigraphic Succession - Talcher Basin</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Formation</th>
                    <th>Lithological Description</th>
                    <th>Depth Range</th>
                    <th>Average Thickness</th>
                    <th>Coal Seams</th>
                    <th>Economic Significance</th>
                  </tr>
                </thead>
                <tbody>
                  {DOMAIN_STRATIGRAPHY.map((s, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-primary">{s.formation}</td>
                      <td className="text-secondary text-xs">{s.lithology}</td>
                      <td className="font-mono text-xs">{s.depthRange}</td>
                      <td className="text-secondary">{s.avgThickness}</td>
                      <td className="text-secondary font-medium">{s.coalSeams}</td>
                      <td>
                        <span className={`badge ${s.economicSignificance.includes('Primary') ? 'badge-green' : 'badge-gray'}`}>
                          {s.economicSignificance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title text-base mb-3">Borehole Core Intersections (Sector B)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Borehole ID</th>
                    <th>Collar Elev (m)</th>
                    <th>Depth (m)</th>
                    <th>Seams Intersected</th>
                    <th>Thickness (m)</th>
                    <th>Core Recovery</th>
                    <th>Ash Content</th>
                    <th>Coal Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DOMAIN_BOREHOLES.map((bh, idx) => (
                    <tr key={idx}>
                      <td className="font-mono font-semibold text-accent-primary">{bh.boreholeId}</td>
                      <td className="font-mono text-xs">{bh.collarElevation} m</td>
                      <td className="font-mono text-xs">{bh.totalDepth} m</td>
                      <td className="text-secondary font-medium">{bh.coalSeamIntersected}</td>
                      <td className="font-semibold text-primary">{bh.seamThickness} m</td>
                      <td className="text-secondary">{bh.coreRecoveryPercent}%</td>
                      <td className="text-secondary">{bh.ashContent}%</td>
                      <td><span className="badge badge-gray">{bh.coalGrade}</span></td>
                      <td><StatusBadge status={bh.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Mining Analytics */}
      {activeTab === 'mining' && (
        <div className="grid grid-cols-dashboard gap-6">
          <div className="card">
            <h3 className="section-title text-base mb-3">Operational Excavation Performance</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-muted rounded border border-light">
                <span className="text-xs text-muted block mb-1">Total Excavation (YTD)</span>
                <span className="text-lg font-bold text-primary">11.78M m³</span>
                <span className="text-xs text-success block mt-1">+4.8% over plan</span>
              </div>
              <div className="p-3 bg-muted rounded border border-light">
                <span className="text-xs text-muted block mb-1">Overburden Stripped</span>
                <span className="text-lg font-bold text-secondary">8.42M m³</span>
                <span className="text-xs text-muted block mt-1">Dragline + Shovel</span>
              </div>
              <div className="p-3 bg-muted rounded border border-light">
                <span className="text-xs text-muted block mb-1">Stripping Ratio</span>
                <span className="text-lg font-bold text-warning">2.41 : 1</span>
                <span className="text-xs text-muted block mt-1">Plan: 2.15 : 1</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded border border-light text-xs text-secondary leading-relaxed">
              <span className="font-bold text-primary block mb-1">Operational Telemetry Note:</span>
              Stripping ratio at Sector B increased to 2.41:1 due to upper sandstone thickening in the Barren Measures contact zone. Recommended adjusting bench height from 12m to 15m for 24m³ electric rope shovel operation.
            </div>
          </div>

          <div className="card">
            <h3 className="section-title text-base mb-3">HEMM Fleet Availability</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-2.5 bg-muted rounded border border-light">
                <span className="text-xs font-medium text-secondary">Heavy Shovel Availability</span>
                <span className="font-bold text-success text-sm">87.4%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-muted rounded border border-light">
                <span className="text-xs font-medium text-secondary">Dumper Fleet Utilization</span>
                <span className="font-bold text-primary text-sm">82.1%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-muted rounded border border-light">
                <span className="text-xs font-medium text-secondary">Blast Hole Drill Availability</span>
                <span className="font-bold text-primary text-sm">89.0%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Historical Comparison */}
      {activeTab === 'historical' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title text-base">Historical Benchmark Comparison (2024 vs 2018)</h3>
              <p className="text-xs text-muted mt-0.5">Strict neutral technical analysis contrasting current exploration against 2018 Master Baseline</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Geological Parameter</th>
                  <th>2018 Baseline</th>
                  <th>2024 Exploration</th>
                  <th>Observed Difference</th>
                  <th>Status</th>
                  <th>Evidence Trace</th>
                </tr>
              </thead>
              <tbody>
                {DOMAIN_HISTORICAL_COMPARISONS.map((h, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-primary">{h.metric}</td>
                    <td className="font-mono text-xs">{h.historicalValue}</td>
                    <td className="font-mono font-bold text-secondary">{h.currentValue}</td>
                    <td className="font-semibold" style={{ color: h.observedDifference.startsWith('+') ? 'var(--status-success)' : 'var(--status-danger)' }}>
                      {h.observedDifference}
                    </td>
                    <td><StatusBadge status={h.status} /></td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                        onClick={() => openEvidence(h.metric, h.evidenceSource, h.evidencePage, h.currentValue, h.historicalValue, h.confidence)}
                      >
                        <ExternalLink size={12} /> Trace ({h.confidence}%)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: AI Analysis */}
      {activeTab === 'ai' && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent-primary" />
              <h3 className="section-title text-base">AI Copilot Operational Intelligence</h3>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/ai-copilot')}>
              Open Full Copilot Workspace
            </button>
          </div>

          <div className="evidence-panel mb-4">
            <div className="evidence-header">
              <Sparkles size={14} /> Synthesized Project Assessment - {project.name}
            </div>
            <p className="evidence-body">
              Detailed exploration confirms 118.2 Mt proved reserves. While seam thickness expanded by +14.3% in Barakar beds, fault F1-F1' throw of +12m constitutes an operational challenge that necessitates shifting the initial box-cut 180m southward. Proximate ash content of 34.1% is consistent with thermal Grade G-11.
            </p>
            <div className="evidence-meta">
              <span className="font-bold text-accent-primary">Confidence: 94%</span>
              <span>•</span>
              <span>Evidence Sources: 2 Ingested Documents (160 pp)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Validation */}
      {activeTab === 'validation' && (
        <div className="card">
          <h3 className="section-title text-base mb-3">Validation & Automated Rule Checks</h3>
          <div className="flex flex-col gap-3">
            {DOMAIN_VALIDATION_CHECKS.map((chk, idx) => (
              <div
                key={idx}
                className="p-3.5 border rounded-md flex items-start justify-between"
                style={{
                  backgroundColor: chk.severity === 'Critical' ? '#FEE2E220' : chk.severity === 'Warning' ? '#FEF3C720' : 'var(--bg-muted)',
                  borderColor: chk.severity === 'Critical' ? '#FECACA' : chk.severity === 'Warning' ? '#FDE68A' : 'var(--border-light)'
                }}
              >
                <div className="flex items-start gap-3">
                  {chk.severity === 'Passed' ? (
                    <CheckCircle2 size={18} className="text-success mt-0.5" />
                  ) : chk.severity === 'Warning' ? (
                    <AlertTriangle size={18} className="text-warning mt-0.5" />
                  ) : (
                    <AlertTriangle size={18} className="text-danger mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-sm text-primary">{chk.name}</div>
                    <div className="text-xs text-secondary mt-1">{chk.description}</div>
                    <div className="text-xs text-muted mt-2">
                      <span className="font-semibold">Action:</span> {chk.actionRecommendation}
                    </div>
                  </div>
                </div>
                <StatusBadge status={chk.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Reports */}
      {activeTab === 'reports' && (
        <div className="card">
          <div className="card-header">
            <h3 className="section-title text-base">Generated Reports for {project.name}</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/reports')}>
              Generate New Report
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projectReports.map((r, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-primary">{r.title}</td>
                    <td className="text-secondary">{r.reportType}</td>
                    <td className="text-secondary">{r.period}</td>
                    <td className="text-secondary">{r.author}</td>
                    <td className="text-muted text-xs">{r.dateCreated}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <button className="btn btn-outline btn-sm py-1 px-2.5 text-xs" onClick={() => navigate('/reports')}>
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 9: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="card">
          <h3 className="section-title text-base mb-3">Project Specific Audit Trail</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Agent</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projectAudits.map((a, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-xs text-muted">{a.timestamp}</td>
                    <td className="font-semibold text-primary">{a.user}</td>
                    <td><span className="badge badge-gray">{a.role}</span></td>
                    <td className="text-secondary">{a.action}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Trace Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
};

export default ProjectDetail;
