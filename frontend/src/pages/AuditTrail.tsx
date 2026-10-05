import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  User,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  FileText
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DOMAIN_AUDIT_TRAIL, AuditRecord } from '../data/domainData';

export const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const roles = ['All', 'Technical Officer', 'Geologist', 'Senior Reviewer', 'Automated Agent'];

  const filteredAudits = DOMAIN_AUDIT_TRAIL.filter(a => {
    const matchesSearch =
      a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetObject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || a.role.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="System Audit Trail"
        subtitle="Immutable governance ledger recording technical evaluations, AI model inferences, and administrative sign-offs."
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-gray font-mono">APPEND-ONLY SECURE LEDGER</span>
            <button
              className="btn btn-outline btn-md flex items-center gap-1.5"
              onClick={() => alert("Exporting cryptographic audit log (.json)")}
            >
              <Download size={14} /> Export Audit Log
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="global-search flex-1" style={{ minWidth: '280px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search audit trail by user, action, project ID, or target object..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ width: '190px' }}>
            <select
              className="form-control"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="All">All User Roles</option>
              {roles.filter(r => r !== 'All').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enterprise Audit Log Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">Recorded Governance Events ({filteredAudits.length})</h3>
            <p className="text-xs text-muted mt-0.5">
              Click any event row to expand cryptographic lineage and metadata payload
            </p>
          </div>
          <span className="text-xs text-muted font-medium">
            Showing {filteredAudits.length} events
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Timestamp</th>
                <th>User / Agent</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Target Project / Asset</th>
                <th>Governance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted">
                    No audit records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((a) => {
                  const isExpanded = expandedId === a.id;
                  return (
                    <React.Fragment key={a.id}>
                      <tr
                        className="cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : a.id)}
                      >
                        <td className="text-center text-muted">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td className="font-mono text-xs text-muted whitespace-nowrap">
                          {a.timestamp}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {a.role.includes('Automated') ? (
                              <Bot size={15} className="text-accent-primary" />
                            ) : (
                              <User size={15} className="text-secondary" />
                            )}
                            <span className="font-semibold text-primary">{a.user}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${a.role.includes('Automated') ? 'badge-blue' : 'badge-gray'}`}>
                            {a.role}
                          </span>
                        </td>
                        <td className="font-medium text-secondary text-xs">
                          {a.action}
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-accent-primary font-bold">{a.projectId}</span>
                            <span className="text-[11px] text-muted truncate max-w-xs">{a.targetObject}</span>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>

                      {/* Expandable Metadata Payload */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                          <td></td>
                          <td colSpan={6} style={{ padding: '16px 20px' }}>
                            <div className="p-3 bg-card rounded border border-light text-xs flex flex-col gap-2">
                              <div className="flex items-center justify-between border-b pb-2">
                                <span className="font-bold text-primary">Audit Event Metadata - {a.id}</span>
                                <span className="font-mono text-muted">HASH: e89a...4b12</span>
                              </div>
                              <div className="text-secondary leading-relaxed">
                                <span className="font-semibold text-muted">Action Details:</span> {a.details || 'Standard verification action logged.'}
                              </div>
                              <div className="font-mono text-[11px] text-muted pt-1">
                                SENDER_ID: {a.user.toLowerCase().replace(' ', '_')} • OBJECT: {a.targetObject} • PROJECT: {a.projectId}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
