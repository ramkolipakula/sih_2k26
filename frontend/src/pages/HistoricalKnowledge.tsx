import React, { useState } from 'react';
import {
  History,
  ArrowRight,
  Sparkles,
  ExternalLink,
  FileText,
  CheckCircle2,
  TrendingUp,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import { DOMAIN_HISTORICAL_COMPARISONS, HistoricalComparisonRecord } from '../data/domainData';

export const HistoricalKnowledge: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('Talcher Coalfield - 2024 (CMPDI-2026-014)');
  const [selectedBenchmark, setSelectedBenchmark] = useState('Talcher Basin Regional Baseline (2018)');

  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceData | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  // Normalized comparative chart data
  const comparisonChartData = [
    { parameter: 'Seam Thickness (m)', historical: 4.20, current: 4.80 },
    { parameter: 'Ash Content (%)', historical: 32.5, current: 34.1 },
    { parameter: 'Drill Density (/km²)', historical: 12.0, current: 18.0 },
    { parameter: 'Moisture (%)', historical: 6.4, current: 6.2 },
  ];

  const openTraceModal = (record: HistoricalComparisonRecord) => {
    setSelectedEvidence({
      claim: `${record.metric}: Current value of ${record.currentValue} reflects an ${record.observedDifference.toLowerCase()} compared to the ${record.historicalPeriod} benchmark of ${record.historicalValue}.`,
      sourceDocument: record.evidenceSource,
      pageNumber: record.evidencePage,
      extractedValue: record.currentValue,
      historicalBenchmark: record.historicalValue,
      variance: record.observedDifference,
      confidenceScore: record.confidence,
      verificationStatus: 'Verified',
      verifyingOfficer: 'Dr. Sharma (Technical Officer, CMPDI)',
      citationSnippet: record.explanation
    });
    setIsEvidenceOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Historical Knowledge Base"
        subtitle="Cross-temporal benchmarking, parameter variance analysis, and traceable correlation models."
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-gray font-mono">CMPDI ARCHIVE REPOSITORY</span>
          </div>
        }
      />

      {/* Benchmark Selection Bar */}
      <div className="card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="form-group mb-0 flex-1" style={{ minWidth: '240px' }}>
              <label className="form-label text-xs">Current Project Ingestion</label>
              <select
                className="form-control font-semibold text-primary"
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
              >
                <option value="Talcher Coalfield - 2024 (CMPDI-2026-014)">Talcher Coalfield - 2024 (CMPDI-2026-014)</option>
                <option value="Jharia Block II - 2024 (CMPDI-2026-015)">Jharia Block II - 2024 (CMPDI-2026-015)</option>
                <option value="Singrauli Northern Ext - 2023 (CMPDI-2026-016)">Singrauli Northern Ext - 2023 (CMPDI-2026-016)</option>
              </select>
            </div>

            <div className="flex items-center justify-center pt-5">
              <ArrowRight className="text-muted" size={20} />
            </div>

            <div className="form-group mb-0 flex-1" style={{ minWidth: '240px' }}>
              <label className="form-label text-xs">Historical Benchmark Source</label>
              <select
                className="form-control"
                value={selectedBenchmark}
                onChange={e => setSelectedBenchmark(e.target.value)}
              >
                <option value="Talcher Basin Regional Baseline (2018)">Talcher Basin Regional Baseline (2018 Master Report)</option>
                <option value="Talcher Master Survey (2010)">Talcher Master Exploration Survey (2010 Archive)</option>
                <option value="CMPDI National Coal Directory (2015)">CMPDI National Coal Inventory (2015)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button className="btn btn-primary btn-md">
              Run Comparative Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Comparative Visual Analytics & Benchmark Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">
              <TrendingUp size={18} className="text-accent-primary" />
              Observed Parameter Variance (2024 Current vs 2018 Historical Baseline)
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Direct empirical comparison of verified laboratory assays and drilling metrics
            </p>
          </div>
        </div>

        <div style={{ height: '260px', width: '100%', marginTop: '8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonChartData}
              margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis
                dataKey="parameter"
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
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }}
              />
              <Bar
                dataKey="historical"
                name="2018 Baseline Benchmark"
                fill="#CBD5E1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="current"
                name="2024 Current Exploration"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Summary Table */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">
              <History size={18} className="text-secondary" />
              Detailed Comparison Summary: Key Technical Metrics
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Parameters are evaluated under strict ISP standard guidelines with neutral empirical wording
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Geological Parameter</th>
                <th>Historical Value (2018)</th>
                <th>Current Value (2024)</th>
                <th>Observed Difference</th>
                <th>Evaluation Status</th>
                <th>Evidence & Lineage</th>
              </tr>
            </thead>
            <tbody>
              {DOMAIN_HISTORICAL_COMPARISONS.map((h, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="font-semibold text-primary block">{h.metric}</span>
                    <span className="text-xs text-muted">ISP UNFC 111 Standard</span>
                  </td>
                  <td className="font-mono text-secondary">{h.historicalValue}</td>
                  <td className="font-mono font-bold text-primary">{h.currentValue}</td>
                  <td>
                    <span
                      className="font-semibold"
                      style={{
                        color: h.observedDifference.startsWith('+') && !h.metric.includes('Ash')
                          ? 'var(--status-success)'
                          : h.metric.includes('Ash') || h.observedDifference.startsWith('-')
                            ? 'var(--status-warning)'
                            : 'var(--status-success)'
                      }}
                    >
                      {h.observedDifference}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={h.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1.5 hover:border-accent-primary hover:text-accent-primary"
                      onClick={() => openTraceModal(h)}
                    >
                      <ExternalLink size={12} /> View Evidence ({h.confidence}%)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Structured Note on Historical Trend (Strictly Neutral Technical Formulation) */}
      <div className="card border-l-4 border-accent-primary">
        <div className="card-header border-b-0 pb-0">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent-primary" />
            <h3 className="section-title text-base">AI Technical Annotation on Historical Trend</h3>
          </div>
          <span className="badge badge-blue">Cross-Temporal Synthesis</span>
        </div>

        <div className="p-4 bg-muted rounded border border-light mt-3">
          <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
            <div>
              <span className="text-muted block mb-0.5">Empirical Observation:</span>
              <span className="font-semibold text-primary">
                Observed increase of +14.3% in average coal seam thickness across Barakar beds (Sector B).
              </span>
            </div>
            <div>
              <span className="text-muted block mb-0.5">Observed Ash Content Variance:</span>
              <span className="font-semibold text-primary">
                Observed increase of +1.6% in proximate ash content (from 32.5% to 34.1%).
              </span>
            </div>
          </div>

          <div className="text-xs text-secondary leading-relaxed pt-3 border-t border-light">
            <span className="font-semibold text-muted block mb-1">Traceable Evidence Context:</span>
            Comparison with 2018 borehole records reveals that the 2024 exploration campaign drilled deeper into the Barakar Formation (280m-520m compared to 180m-360m in 2018). The observed increase in thickness corresponds with intersecting basal split seams (Seam I & II) that were unpenetrated in the earlier survey. Ash content increase is consistent with natural interbedded shale parting bands in lower split seams.
          </div>

          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-light text-xs text-muted">
            <span>Primary Source: <span className="font-medium text-secondary">DOC-TAL-001 (Page 32 & 78)</span></span>
            <span>Algorithm Confidence: <span className="font-bold text-accent-primary">94%</span></span>
            <span>Reviewed by: <span className="font-medium text-secondary">Dr. Sharma (Technical Officer)</span></span>
          </div>
        </div>
      </div>

      {/* Evidence Trace Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
};

export default HistoricalKnowledge;
