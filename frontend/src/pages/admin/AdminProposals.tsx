import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { AdminProposal } from '../../types'

export default function AdminProposals() {
  const [proposals, setProposals] = useState<AdminProposal[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getAdminProposals().then(res => {
      setProposals(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="spinner" />
  }

  return (
    <div>
      <div className="page-header">
        <h1>All Proposals</h1>
        <p>Manage and review all submitted R&D proposals</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Submitted</th>
              <th>Current Stage</th>
              <th>AI Decision</th>
              <th>Review Status</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => (
              <tr key={p.id} onClick={() => navigate(`/admin/proposals/${p.id}`)}>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.title || 'Untitled Proposal'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.id.slice(0, 8)}...</div>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${p.status.toLowerCase()}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {p.ai_decision !== 'PENDING' ? (
                    <span className={`badge badge-${p.ai_decision.toLowerCase()}`}>
                      {p.ai_decision} {(p.ai_confidence ? Math.round(p.ai_confidence * 100) + '%' : '')}
                    </span>
                  ) : (
                    <span className="badge badge-queued">PENDING</span>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${p.human_decision === 'PENDING' ? 'review' : p.human_decision.toLowerCase()}`}>
                    {p.human_decision}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {proposals.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p>No proposals found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
