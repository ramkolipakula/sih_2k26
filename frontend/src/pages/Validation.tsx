import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  ArrowRight,
  Clock,
  UserCheck,
  ExternalLink,
  Filter,
  RotateCcw,
  Split,
  Lock,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Cpu,
  User
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import { DOMAIN_VALIDATION_CHECKS, ValidationCheck } from '../data/domainData';

interface ReconciliationRecord {
  reviewer: string;
  timestamp: string;
  acceptedValue: string;
  justification: string;
}

export const Validation: React.FC = () => {
  // Checks State
  const [checks, setChecks] = useState<ValidationCheck[]>(DOMAIN_VALIDATION_CHECKS);
  const [selectedCheckId, setSelectedCheckId] = useState<string>('VAL-002');
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNINGS' | 'PASSED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassedChecks, setShowPassedChecks] = useState(false);

  // Reconciliation State
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconcileChoice, setReconcileChoice] = useState<'SOURCE_A' | 'SOURCE_B'>('SOURCE_A');
  const [reconcileJustification, setReconcileJustification] = useState(
    'Appendix value reconciled to 18 boreholes/km² based on Q1 2024 infill borehole records.'
  );
  const [reconciliationRecord, setReconciliationRecord] = useState<ReconciliationRecord | null>(null);

  // Critical Issue (VAL-003) Resolution State
  const [criticalResolved, setCriticalResolved] = useState(false);

  // Review Workflow State
  const [officerNotes, setOfficerNotes] = useState(
    'Borehole density discrepancy inspected and reconciled with master appendix. Barakar reserve calculations confirmed against core recovery logs.'
  );
  const [isSignedOff, setIsSignedOff] = useState(false);

  // Evidence Modal State
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceData | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const selectedCheck = checks.find(c => c.id === selectedCheckId) || checks[0];

  // Open Evidence Modal
  const openCheckEvidence = (chk: ValidationCheck) => {
    setSelectedEvidence({
      claim: chk.description,
      sourceDocument: chk.evidenceSource,
      pageNumber: chk.id === 'VAL-002' ? 12 : 118,
      section: 'Validation & Technical Governance Audit',
      extractedValue: chk.id === 'VAL-002' ? '18 boreholes/km² (Section 2) vs 15 boreholes/km² (Appendix Table 3.2)' : 'Mandatory Statutory Requirement',
      historicalBenchmark: 'CMPDI ISP Exploration Guidelines',
      confidenceScore: 96,
      verificationStatus: chk.severity === 'Passed' ? 'Verified' : 'Pending Review',
      verifyingOfficer: 'Dr. Sharma (Technical Officer)',
      citationSnippet: chk.actionRecommendation
    });
    setIsEvidenceOpen(true);
  };

  // Confirm Reconciliation
  const handleConfirmReconciliation = () => {
    const record: ReconciliationRecord = {
      reviewer: 'Dr. Sharma (Technical Officer)',
      timestamp: '05 Oct 2026, 11:24 AM',
      acceptedValue: reconcileChoice === 'SOURCE_A' ? '18 boreholes/km² (Source A)' : '15 boreholes/km² (Source B)',
      justification: reconcileJustification.trim() || 'Appendix harmonized with verified exploration drilling dataset.'
    };
    setReconciliationRecord(record);
    setIsReconciling(false);

    setChecks(prev => prev.map(c => {
      if (c.id === 'VAL-002') {
        return {
          ...c,
          severity: 'Passed',
          status: 'Passed',
          actionRecommendation: `Reconciled to ${record.acceptedValue}. ${record.justification}`
        };
      }
      return c;
    }));
  };

  // Resolve Critical Compliance Check (VAL-003)
  const handleResolveCritical = () => {
    setCriticalResolved(true);
    setChecks(prev => prev.map(c => {
      if (c.id === 'VAL-003') {
        return {
          ...c,
          severity: 'Passed',
          status: 'Passed',
          actionRecommendation: 'Technical Officer sign-off verified and logged in sovereign audit register.'
        };
      }
      return c;
    }));
  };

  // Sign off & Authorize
  const handleSignOff = () => {
    if (!criticalResolved) return;
    setIsSignedOff(true);
  };

  // Reopen Validation
  const handleReopen = () => {
    setIsSignedOff(false);
  };

  // Metrics
  const criticalCount = criticalResolved ? 0 : checks.filter(c => c.severity === 'Critical').length;
  const warningCount = reconciliationRecord ? 0 : checks.filter(c => c.severity === 'Warning').length;
  const passedCount = 14 + checks.filter(c => c.severity === 'Passed').length; // 14 baseline checks + dynamic passed

  // Filter checks
  const filteredUnresolvedChecks = checks.filter(chk => {
    if (chk.severity === 'Passed') return false;
    if (filter === 'CRITICAL' && chk.severity !== 'Critical') return false;
    if (filter === 'WARNINGS' && chk.severity !== 'Warning') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return chk.name.toLowerCase().includes(q) || chk.id.toLowerCase().includes(q) || chk.description.toLowerCase().includes(q);
    }
    return true;
  });

  const passedChecksList = checks.filter(chk => chk.severity === 'Passed');

  return (
    <div className="flex flex-col gap-5 min-w-0">
      {/* 1. Page Header */}
      <div className="page-header-container mb-0 pb-1">
        <div>
          <div className="breadcrumb-nav">
            <span>Governance</span>
            <span>/</span>
            <span>Review & Validation</span>
          </div>
          <h1 className="page-title text-xl">Review & Validation</h1>
          <p className="page-subtitle text-xs">
            Verify AI-generated findings, reconcile discrepancies, and complete technical review before publication.
          </p>
        </div>

        {/* Right-side Context */}
        <div className="flex items-center gap-3 bg-card px-3 py-2 rounded-lg border border-light shadow-xs">
          <div className="text-right">
            <div className="text-xs font-bold text-primary">Project: CMPDI-2026-014</div>
            <div className="text-[11px] text-muted">Talcher Coalfield</div>
          </div>
          <div className="h-6 w-[1px] bg-slate-200" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Review Stage</span>
            <span className={`badge ${isSignedOff ? 'badge-green' : 'badge-amber'} text-[11px]`}>
              {isSignedOff ? 'Approved' : 'Technical Review'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Compact Validation Summary (4 Clean Metric Blocks) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">Checks Passed</span>
            <span className="text-xl font-bold text-primary mt-0.5 block">{passedCount}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">Warnings</span>
            <span className={`text-xl font-bold mt-0.5 block ${warningCount > 0 ? 'text-amber-600' : 'text-primary'}`}>
              {warningCount}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${warningCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">Critical Issues</span>
            <span className={`text-xl font-bold mt-0.5 block ${criticalCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {criticalCount}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${criticalCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {criticalCount > 0 ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">Review Status</span>
            <span className="text-sm font-bold text-primary mt-1 block">
              {isSignedOff ? 'Approved' : 'In Review'}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSignedOff ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            <UserCheck size={18} />
          </div>
        </div>
      </div>

      {/* 3. Compact Horizontal Lifecycle Stepper */}
      <div className="card p-2.5 bg-slate-50 border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {/* Step 1: AI Analysis */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              <Check size={12} strokeWidth={3} />
            </span>
            <div>
              <span className="font-bold text-[11px] text-slate-800 block">01 AI Analysis</span>
              <span className="text-[10px] text-emerald-700 font-medium">Completed</span>
            </div>
          </div>

          {/* Step 2: Technical Review (Active) */}
          <div className={`flex items-center gap-2 p-1.5 rounded border ${isSignedOff ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-300 ring-1 ring-blue-400'}`}>
            <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${isSignedOff ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {isSignedOff ? <Check size={12} strokeWidth={3} /> : '02'}
            </span>
            <div>
              <span className="font-bold text-[11px] text-slate-900 block">02 Technical Review</span>
              <span className={`text-[10px] font-semibold ${isSignedOff ? 'text-emerald-700' : 'text-blue-700'}`}>
                {isSignedOff ? 'Completed' : 'Current'}
              </span>
            </div>
          </div>

          {/* Step 3: Final Validation */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
            <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${isSignedOff ? 'bg-emerald-600' : 'bg-slate-300 text-slate-600'}`}>
              {isSignedOff ? <Check size={12} strokeWidth={3} /> : '03'}
            </span>
            <div>
              <span className="font-bold text-[11px] text-slate-800 block">03 Final Validation</span>
              <span className={`text-[10px] ${isSignedOff ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                {isSignedOff ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Step 4: Publication */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
            <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${isSignedOff ? 'bg-emerald-600' : 'bg-slate-300 text-slate-600'}`}>
              {isSignedOff ? <Check size={12} strokeWidth={3} /> : <Lock size={10} />}
            </span>
            <div>
              <span className="font-bold text-[11px] text-slate-800 block">04 Publication</span>
              <span className={`text-[10px] ${isSignedOff ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {isSignedOff ? 'Ready to Publish' : 'Locked'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Two-Column Review Workspace (Left 62%, Right 38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Validation Findings (lg:col-span-7) */}
        <div className="lg:col-span-7 card p-4">
          {/* Header & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-light gap-2">
            <div>
              <h2 className="section-title text-base">Validation Findings</h2>
              <p className="text-xs text-muted">
                Automated checks requiring attention before report approval.
              </p>
            </div>

            {/* Compact Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs self-start sm:self-auto">
              {(['ALL', 'CRITICAL', 'WARNINGS', 'PASSED'] as const).map(f => (
                <button
                  key={f}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${filter === f ? 'bg-white shadow-xs text-primary font-bold' : 'text-muted hover:text-primary'}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'ALL' ? 'All' : f === 'CRITICAL' ? 'Critical' : f === 'WARNINGS' ? 'Warnings' : 'Passed'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 mb-3">
            <div className="global-search w-full" style={{ padding: '5px 10px' }}>
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Search rule ID, title, or keyword..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.75rem' }}
              />
            </div>
          </div>

          {/* Unresolved Issues List */}
          <div className="flex flex-col gap-2.5">
            {filteredUnresolvedChecks.length === 0 && filter !== 'PASSED' && (
              <div className="p-4 rounded border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span>All priority discrepancies and critical requirements have been reviewed and resolved.</span>
              </div>
            )}

            {filteredUnresolvedChecks.map(chk => {
              const isSelected = selectedCheckId === chk.id;
              const isVal002 = chk.id === 'VAL-002';
              const isVal003 = chk.id === 'VAL-003';

              return (
                <div
                  key={chk.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' : 'bg-white hover:border-slate-300'
                  }`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: chk.severity === 'Critical' ? '#DC2626' : chk.severity === 'Warning' ? '#D97706' : '#16A34A'
                  }}
                  onClick={() => setSelectedCheckId(chk.id)}
                >
                  {/* Top Line: ID, Name, Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-slate-700">[{chk.id}]</span>
                        <span className="font-bold text-xs text-primary">{chk.name}</span>
                        <span className="badge badge-gray text-[9px] py-0 px-1.5">{chk.category}</span>
                        <span className="text-[10px] text-muted flex items-center gap-1 font-mono">
                          {isVal003 ? <User size={10} /> : <Cpu size={10} />}
                          {isVal003 ? 'HUMAN CHECK' : 'AUTOMATED CHECK'}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mt-1 leading-snug">
                        {chk.description}
                      </p>
                    </div>

                    <span className={`badge ${chk.severity === 'Critical' ? 'badge-red' : 'badge-amber'} text-[10px] flex-shrink-0`}>
                      {chk.severity.toUpperCase()}
                    </span>
                  </div>

                  {/* Discrepancy Breakdown for VAL-002 */}
                  {isVal002 && (
                    <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-muted block">Section 2</span>
                          <strong className="text-slate-900 font-mono">18 boreholes/km²</strong>
                        </div>
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-muted block">Appendix Table 3.2</span>
                          <strong className="text-amber-700 font-mono">15 boreholes/km²</strong>
                        </div>
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-muted block">Difference</span>
                          <strong className="text-rose-600 font-mono">3 boreholes/km²</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Row: Source, Status, and Action Buttons */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs">
                    <span className="text-muted text-[11px] truncate max-w-[260px]">
                      Source: <span className="font-mono text-secondary">{chk.evidenceSource}</span>
                    </span>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        className="btn btn-outline btn-sm py-0.5 px-2 text-[11px] text-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCheckEvidence(chk);
                        }}
                      >
                        Inspect Evidence
                      </button>

                      {isVal002 && (
                        <button
                          className="btn btn-primary btn-sm py-0.5 px-2.5 text-[11px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCheckId(chk.id);
                            setIsReconciling(true);
                          }}
                        >
                          Reconcile
                        </button>
                      )}

                      {isVal003 && (
                        <button
                          className="btn btn-outline btn-sm py-0.5 px-2 text-[11px] text-rose-700 border-rose-300 hover:bg-rose-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCheckId(chk.id);
                          }}
                        >
                          Review Requirement
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grouped Passed Checks Accordion Section */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              className="w-full flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              onClick={() => setShowPassedChecks(!showPassedChecks)}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>{passedCount} Checks Passed</span>
                <span className="text-[10px] text-muted font-normal">(Metadata, Ash ratio, UNFC boundary, Lineage mapping)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted">
                <span>{showPassedChecks ? 'Hide Passed Checks' : 'Show Passed Checks'}</span>
                {showPassedChecks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showPassedChecks && (
              <div className="flex flex-col gap-2 mt-2 pl-2">
                {passedChecksList.map(chk => (
                  <div
                    key={chk.id}
                    className="p-2.5 rounded border border-slate-200 bg-white text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-primary">{chk.name}</span>
                        <span className="font-mono text-[10px] text-muted ml-1.5">[{chk.id}]</span>
                        <p className="text-[11px] text-muted mt-0.5">{chk.description}</p>
                      </div>
                    </div>
                    <span className="badge badge-green text-[9px] py-0 px-1.5 flex-shrink-0">Passed</span>
                  </div>
                ))}
                <div className="p-2 rounded bg-slate-50 text-[11px] text-muted border border-slate-100 italic">
                  + 14 baseline empirical validation rules verified against CMPDI Standard Operating Procedures 2024.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reviewer Workspace (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card 1: Selected Issue & Numerical Conflict Detail */}
          <div className="card p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-light">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-accent-primary" />
                <h3 className="section-title text-sm">Discrepancy Inspector</h3>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700">[{selectedCheck.id}]</span>
            </div>

            {/* Selected Issue Summary */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary">{selectedCheck.name}</span>
                <span className={`badge ${selectedCheck.severity === 'Passed' ? 'badge-green' : selectedCheck.severity === 'Critical' ? 'badge-red' : 'badge-amber'} text-[10px]`}>
                  {selectedCheck.severity}
                </span>
              </div>
              <p className="text-xs text-secondary mt-1 leading-normal">
                {selectedCheck.description}
              </p>
            </div>

            {/* When VAL-002 is selected: Explicit Numerical Conflict View */}
            {selectedCheck.id === 'VAL-002' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-3">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
                  <span className="font-bold text-[10px] uppercase text-slate-600 tracking-wider">
                    Numerical Conflict Comparison
                  </span>
                  <span className={`badge ${reconciliationRecord ? 'badge-green' : 'badge-amber'} text-[9px]`}>
                    {reconciliationRecord ? 'Reconciled' : 'Unresolved discrepancy'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-2">
                  {/* SOURCE A */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">SOURCE A</span>
                    <span className="text-[11px] text-slate-600 font-medium block">Drilling Summary (Pg 12)</span>
                    <strong className="text-base font-bold text-slate-900 block mt-1">18 boreholes/km²</strong>
                  </div>

                  {/* SOURCE B */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">SOURCE B</span>
                    <span className="text-[11px] text-slate-600 font-medium block">Appendix Table 3.2 (Pg 118)</span>
                    <strong className={`text-base font-bold block mt-1 ${reconciliationRecord ? 'text-slate-900' : 'text-rose-600'}`}>
                      {reconciliationRecord ? '18 boreholes/km²' : '15 boreholes/km²'}
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                  <span>
                    Observed Difference: <strong className="font-mono text-rose-600">3 boreholes/km²</strong>
                  </span>
                  <span className="text-muted text-[10px]">Dual Citation Conflict</span>
                </div>

                {/* Deliberate Reconciliation Panel */}
                {!reconciliationRecord ? (
                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    {!isReconciling ? (
                      <button
                        className="btn btn-primary btn-sm w-full py-1 text-xs font-semibold"
                        onClick={() => setIsReconciling(true)}
                      >
                        Reconcile Discrepancy
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-[11px] font-bold text-slate-800">Deliberate Reconciliation:</span>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200 cursor-pointer">
                            <input
                              type="radio"
                              name="reconcileChoice"
                              checked={reconcileChoice === 'SOURCE_A'}
                              onChange={() => setReconcileChoice('SOURCE_A')}
                            />
                            <span>Accept Source A: <strong>18 bh/km²</strong> (Include Q1 2024 infill)</span>
                          </label>
                          <label className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200 cursor-pointer">
                            <input
                              type="radio"
                              name="reconcileChoice"
                              checked={reconcileChoice === 'SOURCE_B'}
                              onChange={() => setReconcileChoice('SOURCE_B')}
                            />
                            <span>Accept Source B: <strong>15 bh/km²</strong> (Pre-infill baseline)</span>
                          </label>
                        </div>

                        <div className="mt-1">
                          <label className="text-[10px] text-muted block mb-0.5 font-semibold">Reviewer Justification</label>
                          <input
                            type="text"
                            className="form-control text-xs p-1.5"
                            value={reconcileJustification}
                            onChange={e => setReconcileJustification(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <button
                            className="btn btn-primary btn-sm flex-1 py-1 text-xs"
                            onClick={handleConfirmReconciliation}
                          >
                            Confirm Reconciliation
                          </button>
                          <button
                            className="btn btn-outline btn-sm py-1 text-xs"
                            onClick={() => setIsReconciling(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                    <div className="font-bold flex items-center gap-1 text-emerald-900">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span>Reconciled by {reconciliationRecord.reviewer}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5 font-mono">
                      Timestamp: {reconciliationRecord.timestamp}
                    </div>
                    <div className="text-[11px] text-emerald-800 mt-1">
                      Note: {reconciliationRecord.justification}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* When VAL-003 is selected: Compliance Action */}
            {selectedCheck.id === 'VAL-003' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-3">
                <span className="font-bold text-[10px] uppercase text-slate-600 tracking-wider block mb-1">
                  Compliance Sign-off Requirement
                </span>
                <p className="text-[11px] text-slate-700 mb-2">
                  CIL Standard Operating Procedure mandates verified digital credentials from the designated Technical Review Officer before final report authorization.
                </p>
                {!criticalResolved ? (
                  <button
                    className="btn btn-primary btn-sm w-full py-1 text-xs font-semibold"
                    onClick={handleResolveCritical}
                  >
                    Verify & Complete Requirement
                  </button>
                ) : (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Digital credential verification validated for Dr. Sharma</span>
                  </div>
                )}
              </div>
            )}

            {/* Evidence Modal Button */}
            <button
              className="btn btn-outline btn-sm w-full text-xs flex items-center justify-center gap-1.5"
              onClick={() => openCheckEvidence(selectedCheck)}
            >
              <ExternalLink size={12} /> Inspect Source Evidence
            </button>
          </div>

          {/* Card 2: Human Review Workflow & Official Sign-off */}
          <div className="card p-4">
            <h3 className="section-title text-sm mb-3 flex items-center gap-1.5">
              <UserCheck size={16} className="text-secondary" />
              Human Review Workflow
            </h3>

            {/* Compact Vertical Stepper */}
            <div className="flex flex-col gap-2.5 text-xs pl-2 border-l-2 border-slate-200 mb-4 ml-1">
              <div className="relative pl-3">
                <span className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                <span className="font-bold text-slate-800 block text-xs">01 AI Analysis</span>
                <span className="text-[10px] text-muted">Completed (05 Oct 2026, 09:30 AM)</span>
              </div>

              <div className="relative pl-3">
                <span className={`absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${isSignedOff ? 'bg-emerald-600' : 'bg-blue-600 animate-pulse'}`} />
                <span className="font-bold text-primary block text-xs">02 Technical Review</span>
                <span className="text-[10px] text-muted">Current • Assigned to Dr. Sharma</span>
              </div>

              <div className="relative pl-3">
                <span className={`absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${isSignedOff ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span className="font-bold text-slate-700 block text-xs">03 Final Validation</span>
                <span className="text-[10px] text-muted">{isSignedOff ? 'Completed' : 'Pending prior review'}</span>
              </div>

              <div className="relative pl-3">
                <span className={`absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${isSignedOff ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span className="font-bold text-slate-700 block text-xs">04 Publication</span>
                <span className="text-[10px] text-muted">{isSignedOff ? 'Authorized for release' : 'Locked'}</span>
              </div>
            </div>

            {/* Official Review Notes Textarea (~120px) */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-primary block mb-1">
                Official Review Notes
              </label>
              <textarea
                className="form-control text-xs"
                style={{ height: '120px' }}
                placeholder="Record verification comments, reconciliation decisions, or approval conditions."
                value={officerNotes}
                onChange={e => setOfficerNotes(e.target.value)}
                disabled={isSignedOff}
              />
            </div>

            {/* Approval Guardrail & Action Bar */}
            {!isSignedOff ? (
              <div className="flex flex-col gap-2">
                {/* Critical Issue Guardrail Alert */}
                {!criticalResolved && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-amber-700 flex-shrink-0" />
                      <span>Approval unavailable: 1 critical issue requires resolution.</span>
                    </div>
                    <button
                      className="btn btn-outline btn-sm py-0.5 px-2 text-[11px] font-bold bg-white text-amber-900 border-amber-400 hover:bg-amber-100"
                      onClick={() => setSelectedCheckId('VAL-003')}
                    >
                      View Issue
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-outline btn-sm text-xs flex-1 text-secondary"
                    onClick={() => alert("Revisions requested from field geologists.")}
                  >
                    Request Changes
                  </button>
                  <button
                    className={`btn btn-primary btn-sm flex-1 py-1.5 text-xs font-semibold ${
                      !criticalResolved ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSignOff}
                    disabled={!criticalResolved}
                    title={!criticalResolved ? "Clear critical issue VAL-003 first" : "Authorize report"}
                  >
                    Sign-off & Authorize Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                <div className="text-xs text-emerald-900 font-bold flex items-center gap-1.5 mb-0.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Report Authorized by Dr. Sharma</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Digital Sign-off Timestamp: 05 Oct 2026, 11:32 AM
                </div>
                <button
                  className="btn btn-ghost btn-sm text-[11px] text-slate-600 mt-2 p-0 underline hover:text-slate-900 flex items-center gap-1"
                  onClick={handleReopen}
                >
                  <RotateCcw size={11} /> Reopen Validation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Full Evidence Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
};

export default Validation;
