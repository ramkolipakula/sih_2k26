import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  UploadCloud,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  ArrowRight,
  Database
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DOMAIN_DOCUMENTS, DocumentRecord, DOMAIN_PROJECTS } from '../data/domainData';
import DocumentDetail from './DocumentDetail';
import { fetchDocuments } from '../api';

export const Documents: React.FC = () => {
  const [docs, setDocs] = useState<DocumentRecord[]>(DOMAIN_DOCUMENTS);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterOrg, setFilterOrg] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Upload modal & pipeline state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'indexing' | 'complete'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState('Geological Report');
  const [newDocProject, setNewDocProject] = useState('CMPDI-2026-014');

  useEffect(() => {
    fetchDocuments()
      .then(res => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge with domain documents for richer UI fields
          const merged = res.data.map((d: any, i: number) => ({
            id: d.id || `DOC-SYNC-${i}`,
            projectId: d.project_id || 'CMPDI-2026-014',
            title: d.title || 'Technical Document',
            documentType: (d.document_type as any) || 'Geological Report',
            organization: d.organization || 'CMPDI',
            year: d.year || 2024,
            fileType: (d.file_type as any) || 'PDF',
            fileSize: '6.4 MB',
            pageCount: d.page_count || 48,
            status: (d.status as any) || 'INDEXED',
            uploadedAt: d.uploaded_at || new Date().toISOString(),
            verified: true,
            description: d.description || 'Verified technical mining document.',
            keyFindings: ['Exploration findings confirmed.', 'Compliant with CMPDI data standards.'],
            majorTopics: ['Coal Reserves', 'Exploration Data']
          }));
          setDocs(merged);
        }
      })
      .catch(() => {
        // Fallback to domain store
        setDocs(DOMAIN_DOCUMENTS);
      });
  }, []);

  // Filter options
  const docTypes = ['All', 'Geological Report', 'Exploration Data', 'Mine Plan', 'Environmental Clearance'];
  const orgs = ['All', 'CMPDI RI-VII (Bhubaneswar)', 'BCCL (Dhanbad)', 'NCL (Singrauli)', 'MCL (Jharsuguda)'];
  const years = ['All', '2024', '2023', '2022'];
  const statuses = ['All', 'INDEXED', 'PROCESSING', 'NEEDS REVIEW'];

  const filteredDocs = docs.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || d.documentType === filterType;
    const matchesOrg = filterOrg === 'All' || d.organization === filterOrg;
    const matchesYear = filterYear === 'All' || String(d.year) === filterYear;
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;

    return matchesSearch && matchesType && matchesOrg && matchesYear && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterOrg('All');
    setFilterYear('All');
    setFilterStatus('All');
  };

  const hasActiveFilters = searchTerm !== '' || filterType !== 'All' || filterOrg !== 'All' || filterYear !== 'All' || filterStatus !== 'All';

  // Handle Document Ingestion Simulation
  const handleStartUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setUploadStep('uploading');
    setUploadProgress(25);

    setTimeout(() => {
      setUploadStep('processing');
      setUploadProgress(55);
    }, 1000);

    setTimeout(() => {
      setUploadStep('indexing');
      setUploadProgress(85);
    }, 2200);

    setTimeout(() => {
      setUploadStep('complete');
      setUploadProgress(100);

      // Add to document store
      const createdDoc: DocumentRecord = {
        id: `DOC-NEW-${Date.now().toString().slice(-3)}`,
        projectId: newDocProject,
        title: newDocTitle,
        documentType: newDocType as any,
        organization: 'CMPDI RI-VII',
        year: 2024,
        fileType: 'PDF',
        fileSize: '5.2 MB',
        pageCount: 38,
        status: 'INDEXED',
        uploadedAt: new Date().toISOString(),
        verified: true,
        description: `Newly ingested ${newDocType.toLowerCase()} covering project ${newDocProject}. Vector embeddings synchronized with Qdrant.`,
        keyFindings: [
          'Document structure, headings, and numerical tables extracted successfully.',
          'Lineage references verified against sovereign CMPDI repository.',
          'Cross-correlation confirmed with 92% semantic confidence score.'
        ],
        majorTopics: ['Geological Data', 'Borehole Stratigraphy', 'Compliance Verification']
      };

      setDocs(prev => [createdDoc, ...prev]);
    }, 3400);
  };

  const resetUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadStep('idle');
    setUploadProgress(0);
    setNewDocTitle('');
  };

  // If a document is clicked for detail inspection
  if (selectedDoc) {
    return <DocumentDetail doc={selectedDoc} onBack={() => setSelectedDoc(null)} />;
  }

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Document Intelligence"
        subtitle="Ingest, extract, vector-index, and trace technical mining reports and borehole spreadsheets."
        actions={
          <button
            className="btn btn-primary btn-md flex items-center gap-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud size={16} /> Ingest Technical Document
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="global-search flex-1" style={{ minWidth: '260px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search documents by title, keyword, or organization..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-control"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="All">All Document Types</option>
              {docTypes.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '140px' }}>
            <select
              className="form-control"
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
            >
              <option value="All">All Years</option>
              {years.filter(y => y !== 'All').map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '150px' }}>
            <select
              className="form-control"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              className="btn btn-outline btn-md flex items-center gap-1.5"
              onClick={clearFilters}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Ingested Documents Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">
              Indexed Documents Repository ({filteredDocs.length})
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Select any document to review extracted text, identified entities, and evidence traces
            </p>
          </div>
          <span className="text-xs text-muted font-medium">
            Showing {filteredDocs.length} of {docs.length} documents
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Document Title & ID</th>
                <th>Type</th>
                <th>Organization</th>
                <th>Year</th>
                <th>Format & Size</th>
                <th>Pages</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted">
                    No documents found matching the applied filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-muted flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-primary block">{doc.title}</span>
                          <span className="font-mono text-xs text-muted">{doc.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary text-xs">{doc.documentType}</td>
                    <td className="text-secondary text-xs">{doc.organization}</td>
                    <td className="text-secondary font-mono text-xs">{doc.year}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs uppercase px-1.5 py-0.5 bg-muted rounded border border-light">
                          {doc.fileType}
                        </span>
                        <span className="text-xs text-muted">{doc.fileSize}</span>
                      </div>
                    </td>
                    <td className="text-secondary font-mono text-xs">{doc.pageCount}</td>
                    <td><StatusBadge status={doc.status} /></td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1 hover:border-accent-primary hover:text-accent-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                        }}
                      >
                        Inspect <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Stage Ingestion Pipeline Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={resetUploadModal}>
          <div
            className="modal-content"
            style={{ maxWidth: '620px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <UploadCloud size={20} className="text-accent-primary" />
                <h3 className="card-title text-base">Document Ingestion & Indexing Pipeline</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={resetUploadModal}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {uploadStep === 'idle' ? (
                <form onSubmit={handleStartUpload} className="flex flex-col gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Document Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Talcher Coalfield - Borehole Assay Report Q2"
                      value={newDocTitle}
                      onChange={e => setNewDocTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group mb-0">
                      <label className="form-label">Document Type</label>
                      <select
                        className="form-control"
                        value={newDocType}
                        onChange={e => setNewDocType(e.target.value)}
                      >
                        <option value="Geological Report">Geological Report</option>
                        <option value="Exploration Data">Exploration Data (Spreadsheet)</option>
                        <option value="Mine Plan">Mine Plan / Feasibility Study</option>
                        <option value="Environmental Clearance">Environmental Baseline</option>
                      </select>
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label">Associated Project</label>
                      <select
                        className="form-control"
                        value={newDocProject}
                        onChange={e => setNewDocProject(e.target.value)}
                      >
                        {DOMAIN_PROJECTS.map(p => (
                          <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      border: '2px dashed var(--border-strong)',
                      borderRadius: '8px',
                      padding: '28px',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer'
                    }}
                  >
                    <UploadCloud size={36} className="text-accent-primary mx-auto mb-2 opacity-80" />
                    <span className="font-semibold text-sm text-primary block">
                      Click to choose PDF, XLSX, or DOCX technical file
                    </span>
                    <span className="text-xs text-muted mt-1 block">
                      Supports geological logs, borehole surveys, and government clearance filings up to 100MB
                    </span>
                  </div>

                  <div className="modal-footer -mx-6 -mb-6 mt-4">
                    <button type="button" className="btn btn-outline btn-md" onClick={resetUploadModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-md">
                      Start Ingestion Pipeline
                    </button>
                  </div>
                </form>
              ) : (
                /* Multi-Stage Ingestion Pipeline Progress Display */
                <div className="flex flex-col gap-5 py-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-primary mb-2">
                      <span>Ingestion Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${uploadProgress}%`,
                          height: '100%',
                          backgroundColor: uploadStep === 'complete' ? 'var(--status-success)' : 'var(--accent-primary)',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Pipeline Steps Indicator */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-2.5 rounded bg-muted">
                      {uploadProgress >= 25 ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Clock size={18} className="text-muted" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-primary block">1. File Upload & Verification</span>
                        <span className="text-xs text-muted">Checking file signature and integrity</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded bg-muted">
                      {uploadProgress >= 55 ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Clock size={18} className="text-muted" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-primary block">2. Text & Structural Extraction</span>
                        <span className="text-xs text-muted">OCR parsing, detected tables, and geological headers</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded bg-muted">
                      {uploadProgress >= 85 ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Clock size={18} className="text-muted" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-primary block">3. Vector Chunking & Embedding</span>
                        <span className="text-xs text-muted">Generating 1536-dim semantic embeddings</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded bg-muted">
                      {uploadStep === 'complete' ? (
                        <CheckCircle2 size={18} className="text-success" />
                      ) : (
                        <Clock size={18} className="text-muted" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-primary block">4. Lineage Verification & Indexing Complete</span>
                        <span className="text-xs text-muted">Ready for Copilot search and validation rules</span>
                      </div>
                    </div>
                  </div>

                  {uploadStep === 'complete' && (
                    <div className="modal-footer -mx-6 -mb-6 mt-4">
                      <button className="btn btn-primary btn-md w-full" onClick={resetUploadModal}>
                        Done • View Document in Workspace
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
