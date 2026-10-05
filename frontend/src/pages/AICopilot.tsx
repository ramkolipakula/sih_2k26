import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  History,
  BookOpen,
  ShieldCheck,
  ExternalLink,
  FileText,
  Layers,
  Database,
  Building2,
  ChevronRight,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  Table,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import {
  DOMAIN_PROJECTS,
  DOMAIN_DOCUMENTS,
  DEMO_COPILOT_SUGGESTIONS
} from '../data/domainData';

interface FindingMetric {
  title: string;
  current: string;
  historical: string;
  observedChange: string;
  isPositive?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  structuredResponse?: {
    summary: string;
    keyFindings: FindingMetric[];
    comparisonTable?: {
      headers: string[];
      rows: (string | number)[][];
    };
    sources: { docName: string; page: number; docId: string; confidence: number; validationStatus: string }[];
    confidence: number;
    recommendedActions?: string[];
  };
}

export const AICopilot: React.FC = () => {
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected Project Context
  const [selectedProjectId, setSelectedProjectId] = useState('CMPDI-2026-014');
  const activeProject = DOMAIN_PROJECTS.find(p => p.id === selectedProjectId) || DOMAIN_PROJECTS[0];

  // Inspector panel state (Right Pane)
  const [inspectorEvidence, setInspectorEvidence] = useState<EvidenceData | null>({
    claim: "Barakar formation coal seam thickness in Sector B averages 4.80m, representing a +14.3% increase over the 2018 historical benchmark.",
    sourceDocument: "Talcher Coalfield - Geological Report (DOC-TAL-001)",
    documentId: "DOC-TAL-001",
    pageNumber: 32,
    section: "Chapter 3: Stratigraphy & Borehole Evaluation",
    extractedValue: "4.80 m",
    historicalBenchmark: "4.20 m (2018 Baseline)",
    variance: "+0.60 m (+14.3%)",
    confidenceScore: 94,
    verificationStatus: "Verified",
    verifyingOfficer: "Dr. Sharma (Technical Officer, CMPDI)",
    citationSnippet: "Analysis of 18 exploratory boreholes (BH-TAL-01 to BH-TAL-08) in Sector B confirms composite coal seam intersection thickness averaging 4.80 meters with standard deviation of 0.32m."
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chat message thread
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '10:14 AM',
      text: 'Compare current geological findings with historical reports for Sector B and identify any structural anomalies.'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      timestamp: '10:15 AM',
      structuredResponse: {
        summary: 'Cross-referencing the 2024 Geological Report (DOC-TAL-001) and Exploration Dataset (DOC-TAL-002) against the 2018 Master Baseline indicates favorable coal seam development alongside an unrecognized fault offset in Sector B.',
        keyFindings: [
          {
            title: '1. Coal Seam Thickness',
            current: '4.80 m',
            historical: '4.20 m',
            observedChange: '+14.3% (Favorable)',
            isPositive: true
          },
          {
            title: '2. Proved Coal Reserves',
            current: '118.2 Mt',
            historical: '124.5 Mt',
            observedChange: '-5.1% (Tectonic Re-eval)',
            isPositive: false
          },
          {
            title: '3. Proximate Ash Content',
            current: '34.1%',
            historical: '32.5%',
            observedChange: '+1.6% (Thermal Grade G-11)',
            isPositive: false
          },
          {
            title: '4. Exploration Drilling Density',
            current: '18 /km²',
            historical: '12 /km²',
            observedChange: '+50.0% (ISP Category 111)',
            isPositive: true
          }
        ],
        comparisonTable: {
          headers: ['Parameter', 'Historical (2018)', 'Current (2024)', 'Observed Difference'],
          rows: [
            ['Coal Seam Thickness', '4.20 m', '4.80 m', '+14.3%'],
            ['Proved Reserves', '124.5 Mt', '118.2 Mt', '-5.1%'],
            ['Proximate Ash Content', '32.5%', '34.1%', '+1.6%'],
            ['Drilling Density', '12 /km²', '18 /km²', '+6 /km² (+50%)']
          ]
        },
        sources: [
          { docName: 'Talcher Coalfield - Geological Report', page: 32, docId: 'DOC-TAL-001', confidence: 94, validationStatus: 'Verified' },
          { docName: 'Exploration_Data_Q1_2024.xlsx', page: 18, docId: 'DOC-TAL-002', confidence: 92, validationStatus: 'Verified' },
          { docName: 'CMPDI Historical Baseline Archive', page: 78, docId: 'ARCH-2018-TAL', confidence: 96, validationStatus: 'Verified' }
        ],
        confidence: 94,
        recommendedActions: [
          'Submit structural fault F1-F1\' coordinates to mine planning division for opencast pit realignment.',
          'Reconcile appendix borehole counts (18 vs 15 /km²) prior to final Technical Officer sign-off.'
        ]
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Check URL query parameter if launched from search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      handleUserSubmit(q);
    }
  }, [location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleUserSubmit = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiMsg: Message;

      if (queryText.toLowerCase().includes('inconsistenc') || queryText.toLowerCase().includes('validation') || queryText.toLowerCase().includes('discrepan')) {
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: {
            summary: 'Automated validation check detected two numerical and compliance flags across active project documentation.',
            keyFindings: [
              {
                title: '1. Borehole Density Variance',
                current: '18 /km² (Section 2, p. 12)',
                historical: '15 /km² (Appendix Table 3.2, p. 118)',
                observedChange: 'Unresolved discrepancy of 3 infill boreholes',
                isPositive: false
              },
              {
                title: '2. Reviewer Verification',
                current: 'Pending Sign-off',
                historical: 'Mandatory CIL Guideline',
                observedChange: 'Action Required before publication',
                isPositive: false
              },
              {
                title: '3. Specific Gravity Correlation',
                current: '1.48 g/cm³',
                historical: '1.47 g/cm³ Empirical Model',
                observedChange: '0.01 tolerance (Passed)',
                isPositive: true
              }
            ],
            sources: [
              { docName: 'DOC-TAL-001 (Section 2 vs Table 3.2)', page: 118, docId: 'VAL-002', confidence: 91, validationStatus: 'Action Required' },
              { docName: 'CIL Standard Operating Procedure (2024)', page: 5, docId: 'SOP-2024', confidence: 98, validationStatus: 'Verified' }
            ],
            confidence: 93,
            recommendedActions: ['Harmonize appendix borehole counts to incorporate 3 infill peripheral boreholes.']
          }
        };
      } else if (queryText.toLowerCase().includes('outline') || queryText.toLowerCase().includes('report')) {
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: {
            summary: `Compiled standardized technical report outline for ${activeProject.name} conforming to CMPDI standard v4.2.`,
            keyFindings: [
              {
                title: '1. Executive Summary & Leasehold Boundary',
                current: `${activeProject.targetReserves} Proved`,
                historical: '124.5 Mt (2018)',
                observedChange: 'Updated ISP categorization',
                isPositive: true
              },
              {
                title: '2. Stratigraphy & Borehole Analysis',
                current: '4.80m Avg Seam Thickness',
                historical: '4.20m (2018)',
                observedChange: '+14.3% thickness expansion',
                isPositive: true
              },
              {
                title: '3. Structural Fault Implications',
                current: 'Fault F1-F1\' +12m offset',
                historical: '0m offset (2018 Base)',
                observedChange: 'Requires 180m pit boundary shift',
                isPositive: false
              }
            ],
            sources: [
              { docName: 'CMPDI Reporting Standard Template v4.2', page: 1, docId: 'TMPL-2026', confidence: 99, validationStatus: 'Verified' }
            ],
            confidence: 96,
            recommendedActions: ['Proceed to Reports module to generate full publishable PDF report draft.']
          }
        };
      } else {
        aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: {
            summary: `Technical intelligence summary for ${activeProject.name} based on verified vector embeddings.`,
            keyFindings: [
              {
                title: '1. Target Resource Estimation',
                current: activeProject.targetReserves,
                historical: '124.5 Mt',
                observedChange: 'UNFC 111 category compliant',
                isPositive: true
              },
              {
                title: '2. Exploration Drilling Density',
                current: activeProject.drillingDensity,
                historical: '12 /km²',
                observedChange: '+50% exploration coverage',
                isPositive: true
              }
            ],
            sources: [
              { docName: 'Talcher Coalfield - Geological Report (DOC-TAL-001)', page: 32, docId: 'DOC-TAL-001', confidence: 94, validationStatus: 'Verified' }
            ],
            confidence: 94
          }
        };
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleInspectorSelect = (src: { docName: string; page: number; docId: string; confidence: number }) => {
    setInspectorEvidence({
      claim: "Verified citation extracted from ingested technical documentation.",
      sourceDocument: src.docName,
      documentId: src.docId,
      pageNumber: src.page,
      extractedValue: "4.80m seam thickness / 118.2 Mt reserves",
      historicalBenchmark: "4.20m (2018 Baseline)",
      confidenceScore: src.confidence,
      verificationStatus: "Verified",
      verifyingOfficer: "Dr. Sharma (Technical Officer, CMPDI)",
      citationSnippet: "Cross-correlated with Qdrant vector index across 18 exploratory boreholes in Barakar beds."
    });
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0" style={{ height: 'calc(100vh - 180px)', minHeight: '560px' }}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="page-title text-xl">AI Copilot</h1>
          <p className="page-subtitle text-xs">
            Context-aware technical intelligence for geological and mining workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Context Selector */}
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-md border border-light">
            <span className="text-xs font-semibold text-muted">Project:</span>
            <select
              className="text-xs font-semibold text-primary bg-transparent outline-none cursor-pointer"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
            >
              {DOMAIN_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id}: {p.name.split('-')[1] || p.name}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-outline btn-sm flex items-center gap-1.5"
            onClick={() => {
              setMessages([]);
              setTimeout(() => {
                setMessages([
                  {
                    id: 'msg-init',
                    sender: 'assistant',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: `STRATA Copilot ready. Active workspace: ${activeProject.name}. How can I assist with your geological investigation or technical report today?`
                  }
                ]);
              }, 100);
            }}
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* 3-Pane Technical Intelligence Workbench */}
      <div className="flex gap-4 flex-1 min-h-0 min-w-0" style={{ minHeight: 0 }}>
        {/* Pane 1 (Left): Context and Recent Analysis (280px to 320px) */}
        <div
          className="card flex flex-col p-3 flex-shrink-0 h-full"
          style={{ width: '280px', minWidth: '280px', maxWidth: '300px', minHeight: 0 }}
        >
          <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-light flex-shrink-0">
            <History size={15} className="text-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Project Contexts</span>
          </div>

          <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
            {DOMAIN_PROJECTS.map(p => (
              <div
                key={p.id}
                className={`p-2.5 rounded-md cursor-pointer text-xs transition-colors ${selectedProjectId === p.id ? 'bg-blue-50 border border-blue-200 text-accent-primary font-semibold' : 'hover:bg-hover text-secondary'}`}
                onClick={() => setSelectedProjectId(p.id)}
              >
                <div className="font-mono text-[10px] text-muted">{p.id}</div>
                <div className="mt-0.5 truncate">{p.name}</div>
                <div className="text-[10px] text-muted mt-1">{p.subsidiary.split(' ')[0]} • {p.targetReserves}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-light mt-auto">
            <div className="text-[11px] text-muted flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-success" />
              <span>Vector Lineage: Verified</span>
            </div>
          </div>
        </div>

        {/* Pane 2 (Center): Main Intelligence Workspace (Flexible, min-width: 0) */}
        <div
          className="card flex-1 flex flex-col p-0 h-full"
          style={{ minWidth: 0, minHeight: 0 }}
        >
          {/* Active Context Banner */}
          <div className="p-3 border-b border-light bg-muted flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles size={14} className="text-accent-primary" />
              <span className="font-semibold text-primary">Active Focus: {activeProject.name}</span>
              <span className="text-muted">(2 Documents Ingested, 160 Pages)</span>
            </div>
            <StatusBadge status="Validated" />
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 min-h-0" style={{ minWidth: 0 }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ minWidth: 0 }}
              >
                {msg.sender === 'user' ? (
                  <div
                    style={{
                      maxWidth: '80%',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      borderTopRightRadius: '2px',
                      fontSize: '0.84375rem',
                      lineHeight: 1.5
                    }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div
                    style={{
                      maxWidth: '94%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      padding: '16px',
                      borderRadius: '12px',
                      borderTopLeftRadius: '2px',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    {/* Plain response if present */}
                    {msg.text && (
                      <p className="text-sm text-secondary leading-relaxed">{msg.text}</p>
                    )}

                    {/* Structured Technical Intelligence Response */}
                    {msg.structuredResponse && (
                      <div className="flex flex-col gap-4">
                        {/* Summary */}
                        <div>
                          <div className="text-xs font-semibold text-accent-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Sparkles size={13} /> Summary
                          </div>
                          <p className="text-sm text-primary leading-relaxed font-medium">
                            {msg.structuredResponse.summary}
                          </p>
                        </div>

                        {/* Structured Key Findings with Visual Hierarchy */}
                        <div>
                          <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                            Key Findings
                          </span>
                          <div className="grid grid-cols-2 gap-2.5">
                            {msg.structuredResponse.keyFindings.map((f, i) => (
                              <div key={i} className="p-2.5 rounded bg-muted border border-light text-xs flex flex-col justify-between">
                                <span className="font-semibold text-primary block mb-1">{f.title}</span>
                                <div className="flex justify-between items-center text-[11px] text-muted">
                                  <span>Current: <strong className="text-secondary">{f.current}</strong></span>
                                  <span>Hist: <strong className="text-secondary">{f.historical}</strong></span>
                                </div>
                                <div className="mt-1 pt-1 border-t border-slate-200 text-[11px] font-bold" style={{ color: f.isPositive ? 'var(--status-success)' : 'var(--status-warning)' }}>
                                  Observed change: {f.observedChange}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Empirical Comparison Table (No horizontal scrolling) */}
                        {msg.structuredResponse.comparisonTable && (
                          <div>
                            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                              Historical Comparison
                            </span>
                            <div className="table-container">
                              <table>
                                <thead>
                                  <tr>
                                    {msg.structuredResponse.comparisonTable.headers.map((h, i) => (
                                      <th key={i}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {msg.structuredResponse.comparisonTable.rows.map((row, i) => (
                                    <tr key={i}>
                                      <td className="font-semibold text-primary">{row[0]}</td>
                                      <td className="font-mono text-xs">{row[1]}</td>
                                      <td className="font-mono font-bold text-secondary">{row[2]}</td>
                                      <td className="font-semibold text-xs text-success">{row[3]}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Source Evidence Section */}
                        <div className="pt-2 border-t border-light flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted">Source Evidence:</span>
                            {msg.structuredResponse.sources.map((s, i) => (
                              <button
                                key={i}
                                className="btn btn-outline btn-sm py-0.5 px-2 text-[11px] flex items-center gap-1 hover:border-accent-primary hover:text-accent-primary"
                                onClick={() => handleInspectorSelect(s)}
                              >
                                <BookOpen size={11} /> {s.docId} (p. {s.page}) • {s.confidence}%
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-muted">Validation:</span>
                            <span className="badge badge-green">Verified</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted border border-light text-xs text-muted flex items-center gap-2">
                  <Sparkles size={14} className="text-accent-primary animate-spin" />
                  <span>Synthesizing vector embeddings across project documents...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Suggested Prompt Chips & Input Form */}
          <div className="p-3 border-t border-light bg-card flex-shrink-0">
            {/* Suggested Prompt Chips (Wrapping naturally) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5 text-xs">
              <span className="text-muted font-semibold flex-shrink-0">Suggested prompts:</span>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Compare with historical reports')}
              >
                Compare with historical reports
              </button>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Identify inconsistencies')}
              >
                Identify inconsistencies
              </button>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Summarize project findings')}
              >
                Summarize project findings
              </button>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Show supporting evidence')}
              >
                Show supporting evidence
              </button>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Find missing information')}
              >
                Find missing information
              </button>
              <button
                className="px-2.5 py-1 rounded bg-muted hover:bg-hover border border-light text-secondary text-xs transition-colors"
                onClick={() => handleUserSubmit('Generate report outline')}
              >
                Generate report outline
              </button>
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSubmit(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                className="form-control flex-1"
                placeholder="Ask about geological findings, production data, inconsistencies, or evidence..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-md flex items-center gap-1.5"
                disabled={!inputQuery.trim() || isTyping}
              >
                <Send size={15} /> Analyze
              </button>
            </form>
          </div>
        </div>

        {/* Pane 3 (Right): Evidence Inspector (320px to 380px) */}
        <div
          className="card flex flex-col p-3 flex-shrink-0 h-full"
          style={{ width: '340px', minWidth: '320px', maxWidth: '360px', minHeight: 0 }}
        >
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-light flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Evidence Inspector</span>
            </div>
            {inspectorEvidence && <StatusBadge status={inspectorEvidence.verificationStatus || 'Verified'} />}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col">
            {inspectorEvidence ? (
              <div className="flex flex-col gap-3 text-xs">
                {/* Visual Lineage Connection Flow: CLAIM -> EVIDENCE -> SOURCE -> VALIDATION */}
                <div className="p-2 rounded bg-muted border border-light">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                    <span>Lineage Trace</span>
                    <span className="text-accent-primary">4-Step Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-secondary">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Claim</span>
                    <ArrowRight size={10} className="text-muted" />
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Evidence</span>
                    <ArrowRight size={10} className="text-muted" />
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Source</span>
                    <ArrowRight size={10} className="text-muted" />
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Validated</span>
                  </div>
                </div>

                {/* Claim Box */}
                <div className="p-2.5 rounded bg-muted border border-light">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Inspected Claim
                  </span>
                  <p className="font-semibold text-primary leading-relaxed text-xs">
                    "{inspectorEvidence.claim}"
                  </p>
                </div>

                {/* Extracted vs Historical Numerical Trace */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-muted border border-light">
                    <span className="text-[10px] text-muted block mb-0.5">Extracted Value</span>
                    <span className="font-bold text-primary">{inspectorEvidence.extractedValue}</span>
                  </div>
                  <div className="p-2 rounded bg-muted border border-light">
                    <span className="text-[10px] text-muted block mb-0.5">Historical Value</span>
                    <span className="font-bold text-secondary">{inspectorEvidence.historicalBenchmark}</span>
                  </div>
                </div>

                {/* Source Document Details */}
                <div className="p-2.5 rounded border border-light flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <FileText size={12} className="text-accent-primary" /> {inspectorEvidence.sourceDocument}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted flex justify-between">
                    <span>Document ID: <strong className="text-secondary">{inspectorEvidence.documentId}</strong></span>
                    <span>Page: <strong className="text-secondary">{inspectorEvidence.pageNumber}</strong></span>
                  </div>
                  <div className="text-[11px] text-muted flex justify-between">
                    <span>Section: <strong className="text-secondary">{inspectorEvidence.section || 'General'}</strong></span>
                    <span>Confidence: <strong className="text-accent-primary">{inspectorEvidence.confidenceScore}%</strong></span>
                  </div>
                  <div className="text-[11px] text-secondary border-t border-slate-100 pt-1">
                    Verifying Officer: {inspectorEvidence.verifyingOfficer}
                  </div>
                </div>

                {/* Citation Excerpt */}
                {inspectorEvidence.citationSnippet && (
                  <div className="p-2.5 bg-muted rounded border border-light leading-relaxed text-secondary text-[11px]">
                    <span className="font-bold text-muted block mb-1">Verbatim Extracted Context:</span>
                    "{inspectorEvidence.citationSnippet}"
                  </div>
                )}

                <button
                  className="btn btn-outline btn-sm w-full mt-1 flex items-center justify-center gap-1.5"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Maximize2 size={13} /> Expand Full Evidence Trace
                </button>
              </div>
            ) : (
              <div className="text-center p-8 text-muted text-xs flex flex-col items-center justify-center flex-1">
                <Info size={24} className="text-subtle mb-2" />
                <span className="font-medium text-secondary">Select a claim to inspect its supporting evidence.</span>
                <span className="text-[11px] text-subtle mt-1">Click on any cited source or finding pill to trace its origin and confidence.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Full Evidence Modal */}
      <EvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evidence={inspectorEvidence}
      />
    </div>
  );
};

export default AICopilot;
