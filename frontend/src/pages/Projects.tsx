import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Building2,
  MapPin,
  User,
  X,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DOMAIN_PROJECTS, Project } from '../data/domainData';

export const Projects: React.FC = () => {
  const navigate = useNavigate();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter options derived from domain data
  const subsidiaries = ['All', 'MCL', 'BCCL', 'NCL', 'ECL'];
  const statuses = ['All', 'Active', 'Pending Review', 'Completed', 'Validated', 'AI Draft'];
  const projectTypes = ['All', 'Detailed Exploration', 'Resource Modeling', 'Environmental', 'Mining Analytics'];

  // Filtered dataset
  const filteredProjects = DOMAIN_PROJECTS.filter(project => {
    const matchesSearch =
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subsidiary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubsidiary = selectedSubsidiary === 'All' || project.subsidiary.includes(selectedSubsidiary);
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    const matchesType = selectedType === 'All' || project.projectType.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesSubsidiary && matchesStatus && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubsidiary('All');
    setSelectedStatus('All');
    setSelectedType('All');
  };

  const hasActiveFilters = searchTerm !== '' || selectedSubsidiary !== 'All' || selectedStatus !== 'All' || selectedType !== 'All';

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Projects Workspace"
        subtitle="Centralized management of geological investigations, exploration blocks, and subsidiary reporting units."
        actions={
          <button
            className="btn btn-primary btn-md flex items-center gap-2"
            onClick={() => alert("Initiating CMPDI Project Ingestion Wizard")}
          >
            <Plus size={16} /> New Project Ingestion
          </button>
        }
      />

      {/* Filter and Control Bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="global-search flex-1" style={{ minWidth: '260px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search projects by ID, name, basin, or mineral block..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Subsidiary Filter */}
          <div style={{ width: '160px' }}>
            <select
              className="form-control"
              value={selectedSubsidiary}
              onChange={e => setSelectedSubsidiary(e.target.value)}
            >
              <option value="All">All Subsidiaries</option>
              {subsidiaries.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ width: '160px' }}>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.filter(st => st !== 'All').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              className="btn btn-outline btn-md flex items-center gap-1.5"
              onClick={clearFilters}
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Master Data Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">
              Active Geological & Mining Projects ({filteredProjects.length})
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Click any project row to enter the dedicated Project Intelligence Workspace
            </p>
          </div>
          <span className="text-xs text-muted font-medium">
            Showing {filteredProjects.length} of {DOMAIN_PROJECTS.length} records
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name & Scope</th>
                <th>Subsidiary</th>
                <th>Location</th>
                <th>Target Reserves</th>
                <th>Status</th>
                <th>Review Owner</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-muted">
                    No projects found matching the specified filters. Try adjusting your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/projects/${p.id}`)}
                  >
                    <td>
                      <span className="font-mono text-xs font-bold text-accent-primary bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        {p.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FolderKanban size={16} className="text-muted flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-primary block">{p.name}</span>
                          <span className="text-xs text-muted">{p.projectType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-medium text-secondary">
                        {p.subsidiary.split(' ')[0]}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-secondary flex items-center gap-1">
                        <MapPin size={12} className="text-subtle" /> {p.location}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-primary text-xs">
                        {p.targetReserves}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <span className="text-xs text-secondary flex items-center gap-1">
                        <User size={12} className="text-subtle" /> {p.owner.split(' ')[0]} {p.owner.split(' ')[1]}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-muted">{p.lastUpdated}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1 hover:border-accent-primary hover:text-accent-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${p.id}`);
                        }}
                      >
                        Open Workspace <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
