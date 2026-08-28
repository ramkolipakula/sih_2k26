import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { AdminProposal } from '../../types'

export default function AdminDashboard() {
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

  if (loading) return <div className="spinner" />

  const total = proposals.length
  const pendingReview = proposals.filter(p => p.human_decision === 'PENDING' && p.status === 'READY_FOR_TRIBUNAL' || p.human_decision === 'PENDING' && p.ai_decision !== 'PENDING').length
  const processing = proposals.filter(p => p.status === 'PROCESSING' || p.status === 'EXTRACTED').length

  const reviewQueue = proposals
    .filter(p => p.human_decision === 'PENDING' && p.ai_decision !== 'PENDING')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1>Admin Overview</h1>
        <p>Operational status of the R&D Tribunal system</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Proposals</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer', borderColor: pendingReview > 0 ? 'var(--accent-amber)' : '' }} onClick={() => navigate('/admin/review')}>
          <div className="stat-value" style={{ color: pendingReview > 0 ? 'var(--accent-amber)' : '', WebkitTextFillColor: pendingReview > 0 ? 'var(--accent-amber)' : '' }}>{pendingReview}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{processing}</div>
          <div className="stat-label">Processing</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Review Queue</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/review')}>
            View All
          </button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Submitted</th>
              <th>AI Decision</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviewQueue.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.title || 'Untitled Proposal'}</div>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${p.ai_decision.toLowerCase()}`}>
                    {p.ai_decision} {(p.ai_confidence ? Math.round(p.ai_confidence * 100) + '%' : '')}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/proposals/${p.id}/decision`)}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviewQueue.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No proposals currently require human review.
          </div>
        )}
      </div>
    </div>
  )
}
