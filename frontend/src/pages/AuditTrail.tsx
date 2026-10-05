import { List, Search, Filter } from 'lucide-react';

export default function AuditTrail() {
  const events = [
    { time: '10:42 AM, Oct 5', user: 'Dr. Sharma', action: 'Approved report', project: 'CMPDI-2026-014', role: 'Technical Officer' },
    { time: '09:15 AM, Oct 5', user: 'System (AI)', action: 'Generated Draft Report', project: 'CMPDI-2026-014', role: 'Automated' },
    { time: '09:10 AM, Oct 5', user: 'S. Kumar', action: 'Uploaded Document', project: 'Exploration_Data_Q1.xlsx', role: 'Geologist' },
    { time: '04:30 PM, Oct 4', user: 'A. Patel', action: 'Requested Changes', project: 'CMPDI-2026-012', role: 'Reviewer' },
    { time: '11:20 AM, Oct 4', user: 'System (Validation)', action: 'Flagged Anomaly', project: 'Jharia Block II', role: 'Automated' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">System Audit Trail</h1>
        <p className="page-subtitle">Immutable log of system actions, AI generation, and human reviews.</p>
      </div>

      <div className="card mb-6 p-4 flex gap-4">
        <div className="global-search flex-1" style={{ width: 'auto' }}>
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search audit logs..." />
        </div>
        <button className="btn btn-outline"><Filter size={16} /> Filter by User/Role</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Agent</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target / Project</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={i}>
                  <td className="text-muted">{e.time}</td>
                  <td className="font-medium">{e.user}</td>
                  <td><span className={`badge ${e.role === 'Automated' ? 'badge-blue' : 'badge-gray'}`}>{e.role}</span></td>
                  <td>{e.action}</td>
                  <td className="font-medium text-text-secondary">{e.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
