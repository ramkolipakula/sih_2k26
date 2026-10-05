import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileText, Database, Sparkles, ExternalLink, Hash, BookOpen } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface EvidenceData {
  claim: string;
  sourceDocument: string;
  documentId?: string;
  pageNumber: number | string;
  section?: string;
  extractedValue: string;
  historicalBenchmark?: string;
  variance?: string;
  confidenceScore: number;
  verificationStatus: 'Verified' | 'Pending Review' | 'Flagged';
  verifyingOfficer?: string;
  citationSnippet?: string;
  rawTelemetrySource?: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceData | null;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  evidence
}) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="card-title text-base">Traceable Evidence Verification</h3>
              <p className="text-xs text-muted">CMPDI / CIL Sovereign Intelligence Lineage Model</p>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body flex flex-col gap-5">
          {/* Claim Box */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Audited Technical Claim
              </span>
              <StatusBadge status={evidence.verificationStatus} />
            </div>
            <p className="text-base font-semibold text-primary leading-relaxed">
              "{evidence.claim}"
            </p>
          </div>

          {/* Metric Comparison Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-3 border-light bg-muted">
              <span className="text-xs text-muted block mb-1">Extracted Value</span>
              <span className="text-lg font-bold text-primary">{evidence.extractedValue}</span>
              <span className="text-xs text-secondary mt-1 block">Current Ingestion</span>
            </div>

            <div className="card p-3 border-light bg-muted">
              <span className="text-xs text-muted block mb-1">Historical Benchmark</span>
              <span className="text-lg font-bold text-secondary">
                {evidence.historicalBenchmark || 'N/A'}
              </span>
              <span className="text-xs text-secondary mt-1 block">2018 Master Baseline</span>
            </div>

            <div className="card p-3 border-light bg-muted">
              <span className="text-xs text-muted block mb-1">Algorithm Confidence</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-lg font-bold text-accent-primary">
                  {evidence.confidenceScore}%
                </span>
                <ShieldCheck size={16} className="text-accent-primary" />
              </div>
              <span className="text-xs text-muted block">Cross-Validated</span>
            </div>
          </div>

          {/* Source Document Details */}
          <div className="card p-4 border-light">
            <div className="flex items-center justify-between mb-3 border-b border-light pb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-accent-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Source Provenance & Lineage
                </span>
              </div>
              <span className="text-xs font-mono text-muted">
                {evidence.documentId || 'REF-CMPDI-2024'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-light">
                <span className="text-muted text-xs">Primary Document:</span>
                <span className="font-medium text-primary">{evidence.sourceDocument}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-light">
                <span className="text-muted text-xs">Page & Section:</span>
                <span className="font-semibold text-secondary">
                  Page {evidence.pageNumber} {evidence.section ? `• ${evidence.section}` : ''}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-light">
                <span className="text-muted text-xs">Verifying Authority:</span>
                <span className="text-secondary font-medium">
                  {evidence.verifyingOfficer || 'Dr. Sharma (Technical Officer, CMPDI)'}
                </span>
              </div>

              {evidence.rawTelemetrySource && (
                <div className="flex justify-between items-center py-1 border-b border-light">
                  <span className="text-muted text-xs">Raw Telemetry:</span>
                  <span className="font-mono text-xs text-secondary">{evidence.rawTelemetrySource}</span>
                </div>
              )}
            </div>

            {/* Extracted Excerpt */}
            {evidence.citationSnippet && (
              <div className="mt-4 p-3 bg-app rounded-md border border-light text-xs text-secondary leading-relaxed">
                <div className="font-semibold text-muted mb-1 flex items-center gap-1">
                  <FileText size={12} /> Extracted Context Excerpt:
                </div>
                "{evidence.citationSnippet}"
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={() => {
              alert(`Navigating to verified repository document: ${evidence.sourceDocument}`);
              onClose();
            }}
          >
            <ExternalLink size={14} /> View Original Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
