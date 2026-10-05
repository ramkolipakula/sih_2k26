import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Sliders,
  ShieldCheck,
  FileText,
  Bell,
  CheckCircle2,
  Save
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';

export const Settings: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'profile' | 'organization' | 'ai' | 'validation' | 'templates'>('profile');
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states
  const [similarityThreshold, setSimilarityThreshold] = useState('0.82');
  const [ashVarianceTolerance, setAshVarianceTolerance] = useState('1.5');
  const [thicknessAlertThreshold, setThicknessAlertThreshold] = useState('10.0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage user credentials, organization metadata, AI retrieval thresholds, and validation rules."
        actions={
          savedNotice && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-green-50 px-3 py-1.5 rounded border border-green-200">
              <CheckCircle2 size={14} /> Configuration saved successfully
            </div>
          )
        }
      />

      {/* Settings Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeCategory === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveCategory('profile')}
        >
          <User size={15} /> User Profile
        </button>

        <button
          className={`tab-button ${activeCategory === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveCategory('organization')}
        >
          <Building2 size={15} /> Organization & Subsidiary
        </button>

        <button
          className={`tab-button ${activeCategory === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveCategory('ai')}
        >
          <Sliders size={15} /> AI & Vector Model Config
        </button>

        <button
          className={`tab-button ${activeCategory === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveCategory('validation')}
        >
          <ShieldCheck size={15} /> Validation Rules & Thresholds
        </button>

        <button
          className={`tab-button ${activeCategory === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveCategory('templates')}
        >
          <FileText size={15} /> Report Templates
        </button>
      </div>

      {/* Main Settings Form Container */}
      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          {/* Category 1: Profile */}
          {activeCategory === 'profile' && (
            <div className="flex flex-col gap-4 text-xs">
              <h3 className="section-title text-base mb-1">User Account Profile</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label text-xs">Full Name</label>
                  <input type="text" className="form-control" defaultValue="Dr. Sharma" />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Designation / Role</label>
                  <input type="text" className="form-control" defaultValue="Technical Officer" disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label text-xs">Official Email Address</label>
                  <input type="email" className="form-control" defaultValue="sharma.geo@cmpdi.gov.in" />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Employee Identification Code</label>
                  <input type="text" className="form-control font-mono" defaultValue="CIL-EMP-40892" disabled />
                </div>
              </div>
            </div>
          )}

          {/* Category 2: Organization */}
          {activeCategory === 'organization' && (
            <div className="flex flex-col gap-4 text-xs">
              <h3 className="section-title text-base mb-1">CMPDI / CIL Entity Affiliation</h3>

              <div className="form-group mb-0">
                <label className="form-label text-xs">Parent Public Sector Undertaking</label>
                <input type="text" className="form-control" defaultValue="Coal India Limited (CIL) • Ministry of Coal" disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label text-xs">Primary Institute</label>
                  <input type="text" className="form-control" defaultValue="Central Mine Planning & Design Institute" disabled />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Regional Office</label>
                  <input type="text" className="form-control" defaultValue="Regional Institute VII (Bhubaneswar, Odisha)" />
                </div>
              </div>
            </div>
          )}

          {/* Category 3: AI Configuration */}
          {activeCategory === 'ai' && (
            <div className="flex flex-col gap-4 text-xs">
              <h3 className="section-title text-base mb-1">AI Copilot & Vector Database Parameters</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label text-xs">Cosine Similarity Retrieval Threshold</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="0.99"
                    className="form-control font-mono"
                    value={similarityThreshold}
                    onChange={e => setSimilarityThreshold(e.target.value)}
                  />
                  <span className="text-[11px] text-muted mt-1 block">Higher thresholds prevent hallucinated citations (default: 0.82)</span>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Model Temperature (Deterministic Reasoning)</label>
                  <input type="text" className="form-control font-mono" defaultValue="0.10 (High Precision / Low Creativity)" disabled />
                </div>
              </div>

              <div className="p-3 bg-muted rounded border border-light">
                <span className="font-semibold text-primary block mb-1">Local Sovereign Embedding Model:</span>
                <span className="text-secondary text-[11px]">
                  Sentence-Transformers / all-MiniLM-L6-v2 running on secure local worker (1536-dimensional embeddings with zero data egress).
                </span>
              </div>
            </div>
          )}

          {/* Category 4: Validation Rules */}
          {activeCategory === 'validation' && (
            <div className="flex flex-col gap-4 text-xs">
              <h3 className="section-title text-base mb-1">Automated Integrity Check Thresholds</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label text-xs">Ash Content Discrepancy Tolerance (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control font-mono"
                    value={ashVarianceTolerance}
                    onChange={e => setAshVarianceTolerance(e.target.value)}
                  />
                  <span className="text-[11px] text-muted mt-1 block">Trigger warning if proximate ash variance exceeds this value</span>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Coal Seam Thickness Variance Alert (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control font-mono"
                    value={thicknessAlertThreshold}
                    onChange={e => setThicknessAlertThreshold(e.target.value)}
                  />
                  <span className="text-[11px] text-muted mt-1 block">Flag geological anomaly if seam thickness changes by &gt; 10%</span>
                </div>
              </div>
            </div>
          )}

          {/* Category 5: Report Templates */}
          {activeCategory === 'templates' && (
            <div className="flex flex-col gap-4 text-xs">
              <h3 className="section-title text-base mb-1">Standard Report Formatting Guidelines</h3>
              <div className="p-3.5 bg-muted rounded border border-light flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary block">CMPDI Technical Report Standard v4.2</span>
                  <span className="text-muted text-[11px]">Standard template conforming to CIL Board and Ministry of Coal reporting specifications.</span>
                </div>
                <span className="badge badge-green">Active Default</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-light mt-6 flex justify-end">
            <button type="submit" className="btn btn-primary btn-md flex items-center gap-1.5">
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
