import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  Layers,
  Table,
  BookOpen,
  Download,
  ExternalLink,
  ShieldCheck,
  Hash
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { DocumentRecord } from '../data/domainData';

interface DocumentDetailProps {
  doc: DocumentRecord | any;
  onBack: () => void;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ doc, onBack }) => {
  const [detailTab, setDetailTab] = useState<'summary' | 'tables' | 'entities' | 'raw'>('summary');

  const uploadedDate = doc.uploadedAt || doc.uploaded_at
    ? new Date(doc.uploadedAt || doc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '12 Mar 2024';

  return (
    <div>
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="btn btn-outline btn-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Documents
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={doc.status || 'INDEXED'} />
          <button
            className="btn btn-outline btn-sm flex items-center gap-1.5"
            onClick={() => alert(`Downloading verified technical document ${doc.title}`)}
          >
            <Download size={14} /> Export Source PDF
          </button>
        </div>
      </div>

      {/* Document Header Card */}
      <div className="card mb-6" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {doc.id}
              </span>
              <span className="text-xs text-muted font-medium">
                {doc.documentType || 'Geological Report'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-primary mt-1.5 mb-2 flex items-center gap-2">
              <FileText size={20} className="text-accent-primary flex-shrink-0" />
              {doc.title}
            </h1>
            <p className="text-sm text-secondary leading-relaxed max-w-4xl">
              {doc.description}
            </p>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-4 border-t border-light text-xs">
          <div>
            <span className="text-muted block mb-0.5">Authoring Organization</span>
            <span className="font-semibold text-secondary flex items-center gap-1">
              <Building2 size={13} className="text-subtle" /> {doc.organization}
            </span>
          </div>

          <div>
            <span className="text-muted block mb-0.5">Associated Project</span>
            <span className="font-semibold text-secondary flex items-center gap-1">
              <MapPin size={13} className="text-subtle" /> {doc.projectId || 'CMPDI-2026-014'}
            </span>
          </div>

          <div>
            <span className="text-muted block mb-0.5">Date Ingested</span>
            <span className="font-semibold text-secondary flex items-center gap-1">
              <Calendar size={13} className="text-subtle" /> {uploadedDate}
            </span>
          </div>

          <div>
            <span className="text-muted block mb-0.5">Ingestion Specs</span>
            <span className="font-semibold text-secondary flex items-center gap-1">
              <Layers size={13} className="text-subtle" /> {doc.pageCount || 142} Pages • {doc.fileSize || '14.2 MB'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${detailTab === 'summary' ? 'active' : ''}`}
          onClick={() => setDetailTab('summary')}
        >
          <Sparkles size={15} /> AI Synthesis & Key Findings
        </button>

        <button
          className={`tab-button ${detailTab === 'tables' ? 'active' : ''}`}
          onClick={() => setDetailTab('tables')}
        >
          <Table size={15} /> Extracted Tabular Datasets
        </button>

        <button
          className={`tab-button ${detailTab === 'entities' ? 'active' : ''}`}
          onClick={() => setDetailTab('entities')}
        >
          <Hash size={15} /> Identified Geological Entities
        </button>

        <button
          className={`tab-button ${detailTab === 'raw' ? 'active' : ''}`}
          onClick={() => setDetailTab('raw')}
        >
          <BookOpen size={15} /> Lineage & Document Provenance
        </button>
      </div>

      {/* Tab Content: Summary */}
      {detailTab === 'summary' && (
        <div className="grid grid-cols-dashboard gap-6">
          <div className="card">
            <h3 className="section-title text-base mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-accent-primary" />
              Verified Technical Extraction
            </h3>

            <div className="p-4 bg-muted rounded border border-light text-sm text-secondary leading-relaxed mb-5">
              {doc.description || "Comprehensive geological exploration survey detailing Barakar formation borehole core assays, coal seam depth intersections, and structural strike lines."}
            </div>

            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted mb-3">
              Extracted Key Findings
            </h4>
            <div className="flex flex-col gap-2.5 mb-6">
              {(doc.keyFindings || [
                'Coal seam thickness in Sector B averages 4.8m, exceeding 2018 historical estimates by 14.3%.',
                'Barakar formation demonstrates strong lateral continuity with low structural disturbance.',
                'Proved recoverable coal reserves calculated at 118.2 million tonnes with 94% confidence.'
              ]).map((f: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded bg-muted border border-light">
                  <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-secondary leading-normal">{f}</span>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted mb-3">
              Indexed Categorical Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {(doc.majorTopics || ['Barakar Stratigraphy', 'Coal Seam Thickness', 'Reserve Estimation', 'Borehole Logs']).map((topic: string) => (
                <span key={topic} className="badge badge-gray border border-border-strong">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card">
              <h3 className="section-title text-base mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                Lineage & Evidence Verification
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-light">
                  <span className="text-muted">Verification Status</span>
                  <StatusBadge status="Verified" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-light">
                  <span className="text-muted">Confidence Score</span>
                  <span className="font-bold text-accent-primary">94%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-light">
                  <span className="text-muted">Extracted Text Chunks</span>
                  <span className="font-mono text-secondary">248 chunks (1536d)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted">Qdrant Vector Index</span>
                  <span className="font-mono text-success font-semibold">Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Extracted Tables */}
      {detailTab === 'tables' && (
        <div className="card">
          <h3 className="section-title text-base mb-3">Detected Tabular Data (Borehole Intersections)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Borehole ID</th>
                  <th>Depth From (m)</th>
                  <th>Depth To (m)</th>
                  <th>Seam Thickness (m)</th>
                  <th>Proximate Ash (%)</th>
                  <th>Gross Calorific (kcal/kg)</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono font-semibold text-accent-primary">BH-TAL-01</td>
                  <td className="font-mono text-xs">312.4</td>
                  <td className="font-mono text-xs">317.3</td>
                  <td className="font-semibold text-primary">4.90</td>
                  <td className="text-secondary">33.8%</td>
                  <td className="font-mono text-xs">4,120</td>
                  <td><span className="badge badge-gray">G-11</span></td>
                </tr>
                <tr>
                  <td className="font-mono font-semibold text-accent-primary">BH-TAL-02</td>
                  <td className="font-mono text-xs">328.0</td>
                  <td className="font-mono text-xs">333.1</td>
                  <td className="font-semibold text-primary">5.10</td>
                  <td className="text-secondary">32.9%</td>
                  <td className="font-mono text-xs">4,250</td>
                  <td><span className="badge badge-gray">G-11</span></td>
                </tr>
                <tr>
                  <td className="font-mono font-semibold text-accent-primary">BH-TAL-03</td>
                  <td className="font-mono text-xs">295.6</td>
                  <td className="font-mono text-xs">300.2</td>
                  <td className="font-semibold text-primary">4.60</td>
                  <td className="text-secondary">34.6%</td>
                  <td className="font-mono text-xs">3,980</td>
                  <td><span className="badge badge-gray">G-12</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Geological Entities */}
      {detailTab === 'entities' && (
        <div className="card">
          <h3 className="section-title text-base mb-3">Identified Geological & Mining Entities</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded border border-light bg-muted">
              <span className="text-xs font-semibold text-muted block mb-1">Stratigraphic Formations</span>
              <span className="text-sm font-bold text-primary block">Barakar Formation</span>
              <span className="text-xs text-secondary mt-1 block">Mentioned 42 times across Ch 2-4</span>
            </div>

            <div className="p-3 rounded border border-light bg-muted">
              <span className="text-xs font-semibold text-muted block mb-1">Structural Features</span>
              <span className="text-sm font-bold text-primary block">Fault Line F1-F1'</span>
              <span className="text-xs text-secondary mt-1 block">+12m vertical throw detected</span>
            </div>

            <div className="p-3 rounded border border-light bg-muted">
              <span className="text-xs font-semibold text-muted block mb-1">Coal Seam Horizon</span>
              <span className="text-sm font-bold text-primary block">Seams I to VIII Composite</span>
              <span className="text-xs text-secondary mt-1 block">4.8m average composite thickness</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Raw Lineage */}
      {detailTab === 'raw' && (
        <div className="card">
          <h3 className="section-title text-base mb-3">Document Provenance & Sovereign Hash</h3>
          <div className="p-4 bg-muted rounded border border-light font-mono text-xs text-secondary flex flex-col gap-2">
            <div>SHA256: 4f8b91c2847a9e03d9812bcfe1438902fa88390bca7192348a9018e20349f821</div>
            <div>INGESTION_TIMESTAMP: 2024-03-12T09:30:00.000Z</div>
            <div>VECTOR_COLLECTION: cmpdi_technical_reports_v1</div>
            <div>VERIFIED_SIGNATURE: CMPDI-RI-VII-CERTIFIED</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetail;
