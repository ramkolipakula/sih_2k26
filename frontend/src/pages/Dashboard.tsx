import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard() {
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getProposals()
      .then(res => setProposals(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      UPLOADED: 'badge-queued', PROCESSING: 'badge-processing',
      EXTRACTED: 'badge-completed', FAILED: 'badge-failed',
    }
    return <span className={`badge ${map[status] || 'badge-queued'}`}>{status}</span>
  }

  return (
    <div>
      <div className="page-header">
        <h1>Proposals Dashboard</h1>
        <p>AI-powered evaluation of R&D proposals with multi-agent tribunal</p>
      </div>

      <div className="grid-4" style={{marginBottom: 32}}>
        <div className="stat-card">
          <div className="stat-value">{proposals.length}</div>
          <div className="stat-label">Total Proposals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{proposals.filter(p => p.status === 'EXTRACTED').length}</div>
          <div className="stat-label">Extracted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{proposals.filter(p => p.status === 'PROCESSING').length}</div>
          <div className="stat-label">Processing</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{proposals.filter(p => p.status === 'FAILED').length}</div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Proposals</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/proposals/new')}>
            + Upload Proposal
          </button>
        </div>

        {loading ? <div className="spinner" /> : proposals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p>No proposals yet. Upload your first R&D proposal to begin evaluation.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title / File</th>
                <th>Status</th>
                <th>Type</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p: any) => (
                <tr key={p.id} onClick={() => navigate(`/proposals/${p.id}`)}>
                  <td style={{fontWeight: 500}}>{p.title || p.uploaded_file_name}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td><span className="evidence-tag">{p.file_type?.toUpperCase()}</span></td>
                  <td style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
