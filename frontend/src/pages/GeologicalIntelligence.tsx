import React, { useState } from 'react';
import {
  Map,
  Layers,
  Database,
  AlertTriangle,
  CheckCircle2,
  Compass,
  ExternalLink,
  Filter,
  FileSpreadsheet,
  Maximize2,
  ShieldCheck,
  Eye
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceModal, EvidenceData } from '../components/common/EvidenceModal';
import {
  DOMAIN_STRATIGRAPHY,
  DOMAIN_BOREHOLES,
  DOMAIN_ANOMALIES,
  GeologicalAnomaly
} from '../data/domainData';

export const GeologicalIntelligence: React.FC = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<GeologicalAnomaly | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);

  // Active map layers
  const [activeLayers, setActiveLayers] = useState({
    faultLines: true,
    boreholes: true,
    barakarOutcrop: true,
    seamContours: true
  });

  const openAnomalyEvidence = (anomaly: GeologicalAnomaly) => {
    setSelectedAnomaly(anomaly);
    setEvidenceData({
      claim: `${anomaly.title} identified in ${anomaly.location}. ${anomaly.evidence}`,
      sourceDocument: anomaly.detectedIn,
      pageNumber: 42,
      section: 'Structural Geology & Fault Demarcation',
      extractedValue: '12m vertical throw offset',
      historicalBenchmark: 'Zero displacement in 2018 base map',
      variance: '+12.0m vertical displacement',
      confidenceScore: 92,
      verificationStatus: anomaly.reviewStatus as any,
      verifyingOfficer: 'Dr. Sharma (Technical Officer)',
      citationSnippet: anomaly.evidence
    });
    setIsEvidenceOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Geological Intelligence"
        subtitle="Exploration stratigraphy, borehole core logging, geospatial extent, and structural anomaly governance."
        actions={
          <div className="flex items-center gap-3">
            <span className="badge badge-blue">Talcher Basin • Sector B</span>
            <button className="btn btn-outline btn-md flex items-center gap-1.5" onClick={() => alert("Exporting ISP borehole telemetry (.csv)")}>
              <FileSpreadsheet size={15} /> Export Core Logs
            </button>
          </div>
        }
      />

      {/* Geospatial Intelligence & Survey Extent Workbench (No fake GIS placeholder!) */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-accent-primary" />
            <div>
              <h3 className="section-title text-base">Geospatial Intelligence & Exploration Boundary</h3>
              <p className="text-xs text-muted mt-0.5">
                Cartographic coordinates: 20°55'40"N to 20°58'20"N | 85°08'15"E to 85°12'30"E • Datum: WGS 84 / UTM Zone 45N
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Active Data Layers:</span>
            <button
              className={`btn btn-sm ${activeLayers.boreholes ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveLayers(p => ({ ...p, boreholes: !p.boreholes }))}
            >
              18 Boreholes
            </button>
            <button
              className={`btn btn-sm ${activeLayers.faultLines ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveLayers(p => ({ ...p, faultLines: !p.faultLines }))}
            >
              Fault F1-F1'
            </button>
            <button
              className={`btn btn-sm ${activeLayers.barakarOutcrop ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveLayers(p => ({ ...p, barakarOutcrop: !p.barakarOutcrop }))}
            >
              Barakar Bed
            </button>
          </div>
        </div>

        {/* Technical Spatial Coordinate Visualizer */}
        <div
          style={{
            position: 'relative',
            height: '260px',
            backgroundColor: '#0F172A',
            borderRadius: '8px',
            overflow: 'hidden',
            padding: '20px',
            color: '#94A3B8',
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #1E293B'
          }}
        >
          {/* Subtle Grid Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.12) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none'
            }}
          />

          {/* Top coordinate bar */}
          <div className="flex justify-between items-center z-10 text-xs">
            <span className="flex items-center gap-1.5 text-blue-400 font-sans font-semibold">
              <Map size={14} /> CMPDI REGIONAL GRID SURVEY - SECTOR B (TALCHER)
            </span>
            <span className="text-slate-400 font-mono text-xs">SCALE: 1:10,000 • CONTOUR INTERVAL: 5m</span>
          </div>

          {/* Graphical Borehole Plot Nodes */}
          <div className="relative w-full h-32 z-10">
            {/* Fault Line F1-F1' */}
            {activeLayers.faultLines && (
              <div
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  width: '70%',
                  height: '2px',
                  backgroundColor: '#DC2626',
                  transform: 'rotate(-8deg)',
                  boxShadow: '0 0 8px rgba(220, 38, 38, 0.6)'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '50%',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#F87171',
                    fontFamily: 'sans-serif'
                  }}
                >
                  FAULT F1-F1' (+12m THROW OFFSET)
                </span>
              </div>
            )}

            {/* Borehole nodes */}
            {activeLayers.boreholes && DOMAIN_BOREHOLES.map((bh, i) => {
              const leftPercent = 12 + (i * 11);
              const topPercent = 25 + ((i % 3) * 28);
              return (
                <div
                  key={bh.boreholeId}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer'
                  }}
                  title={`${bh.boreholeId} (Elevation: ${bh.collarElevation}m, Depth: ${bh.totalDepth}m, Seam: ${bh.seamThickness}m)`}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: bh.status === 'Anomaly Detected' ? '#EF4444' : '#3B82F6',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 0 6px rgba(59, 130, 246, 0.8)'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#E2E8F0',
                      position: 'absolute',
                      top: '14px',
                      left: '-16px',
                      whiteSpace: 'nowrap',
                      fontWeight: 600
                    }}
                  >
                    {bh.boreholeId}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom telemetry readout */}
          <div className="flex justify-between items-center z-10 text-xs border-t border-slate-800 pt-2 font-mono">
            <span>AREA: 4.82 KM² | LEASEHOLD BOUNDARY: MINING LEASE NO. ML-2016-TAL</span>
            <span className="text-emerald-400">ISP UNFC 111 COMPLIANT (18 DRILLHOLES/KM²)</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Stratigraphy & Anomaly Governance */}
      <div className="grid grid-cols-2 mb-6">
        {/* Stratigraphic Succession Table */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-accent-primary" />
              <h3 className="section-title text-base">Stratigraphic Summary (Talcher Basin)</h3>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Lithology</th>
                  <th>Depth (m)</th>
                  <th>Economic Value</th>
                </tr>
              </thead>
              <tbody>
                {DOMAIN_STRATIGRAPHY.map((s, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-primary">{s.formation}</td>
                    <td className="text-secondary text-xs">{s.lithology}</td>
                    <td className="font-mono text-xs">{s.depthRange}</td>
                    <td>
                      <span className={`badge ${s.economicSignificance.includes('Primary') ? 'badge-green' : 'badge-gray'}`}>
                        {s.economicSignificance.split(' ')[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Structured Anomaly Review Component */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              <h3 className="section-title text-base">Extracted Geological Anomalies Review</h3>
            </div>
            <span className="badge badge-amber">3 Anomalies Flagged</span>
          </div>

          <div className="flex flex-col gap-3">
            {DOMAIN_ANOMALIES.map((anomaly) => (
              <div
                key={anomaly.id}
                className="p-3.5 border rounded-md"
                style={{
                  backgroundColor: anomaly.severity === 'High' ? '#FEE2E220' : anomaly.severity === 'Moderate' ? '#FEF3C720' : 'var(--bg-muted)',
                  borderColor: anomaly.severity === 'High' ? '#FECACA' : anomaly.severity === 'Moderate' ? '#FDE68A' : 'var(--border-light)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-primary">{anomaly.title}</span>
                      <StatusBadge status={anomaly.severity === 'High' ? 'Critical' : anomaly.severity === 'Moderate' ? 'Warning' : 'Passed'} />
                    </div>
                    <span className="text-xs text-muted block mt-0.5">Location: {anomaly.location}</span>
                  </div>

                  <button
                    className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                    onClick={() => openAnomalyEvidence(anomaly)}
                  >
                    <Eye size={12} /> Inspect Evidence
                  </button>
                </div>

                <div className="text-xs text-secondary mt-2 bg-card p-2 rounded border border-light">
                  <span className="font-semibold text-muted block mb-0.5">Detected Evidence:</span>
                  {anomaly.evidence}
                </div>

                <div className="flex justify-between items-center mt-2.5 text-xs">
                  <span className="text-muted">Detected in: <span className="font-medium text-secondary">{anomaly.detectedIn}</span></span>
                  <span className="badge badge-gray">{anomaly.reviewStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Borehole Telemetry Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">Borehole Exploration Telemetry (Sector B)</h3>
            <p className="text-xs text-muted mt-0.5">ISP compliant collar coordinates, core recoveries, and proximate ash analysis</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Borehole ID</th>
                <th>Collar Elev (m)</th>
                <th>Total Depth (m)</th>
                <th>Seam Intersected</th>
                <th>Seam Thickness (m)</th>
                <th>Core Recovery</th>
                <th>Ash Content</th>
                <th>Coal Grade</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {DOMAIN_BOREHOLES.map((bh) => (
                <tr key={bh.boreholeId}>
                  <td className="font-mono font-semibold text-accent-primary">{bh.boreholeId}</td>
                  <td className="font-mono text-xs">{bh.collarElevation} m</td>
                  <td className="font-mono text-xs">{bh.totalDepth} m</td>
                  <td className="text-secondary font-medium">{bh.coalSeamIntersected}</td>
                  <td className="font-bold text-primary">{bh.seamThickness} m</td>
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

      {/* Signature Evidence Trace Modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={evidenceData}
      />
    </div>
  );
};

export default GeologicalIntelligence;
