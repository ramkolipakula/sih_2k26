import { Folder, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const navigate = useNavigate();
  const projects = [
    { id: 'CMPDI-2026-014', name: 'Geological Investigation - Talcher Coalfield', org: 'CMPDI RI-I', status: 'Active', updated: '2 hours ago' },
    { id: 'CMPDI-2026-015', name: 'Jharia Block II Exploration', org: 'BCCL', status: 'Pending Review', updated: '1 day ago' },
    { id: 'CMPDI-2026-016', name: 'Singrauli Environmental Clearance', org: 'NCL', status: 'Completed', updated: '3 days ago' },
    { id: 'CMPDI-2026-017', name: 'Ib Valley Production Summary', org: 'MCL', status: 'Active', updated: '5 days ago' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Projects Workspace</h1>
          <p className="page-subtitle">Manage intelligence gathering and reporting for active projects.</p>
        </div>
        <button className="btn btn-primary">+ New Project</button>
      </div>

      <div className="card mb-6 p-4 flex gap-4">
        <div className="global-search flex-1" style={{ width: 'auto' }}>
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search projects by name, ID, or location..." />
        </div>
        <button className="btn btn-outline"><Filter size={16} /> Filter</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Subsidiary/Org</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td className="font-medium text-accent-primary">{p.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Folder size={16} className="text-muted" /> {p.name}
                    </div>
                  </td>
                  <td>{p.org}</td>
                  <td>
                    <span className={`badge ${p.status === 'Active' ? 'badge-blue' : p.status === 'Completed' ? 'badge-green' : 'badge-amber'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-muted">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
