import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { AdminProposal } from '../../types'

export default function AdminReviewQueue() {
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

  const reviewQueue = proposals
    .filter(p => p.human_decision === 'PENDING' && p.ai_decision !== 'PENDING')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div>
      <div className="page-header">
        <h1>Review Queue</h1>
        <p>Proposals awaiting final organizational decision</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Submitted</th>
              <th>AI Recommendation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviewQueue.map(p => (
              <tr key={p.id} onClick={() => navigate(`/admin/proposals/${p.id}/decision`)}>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.title || 'Untitled Proposal'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.id.slice(0, 8)}...</div>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${p.ai_decision.toLowerCase()}`}>
                    {p.ai_decision} {(p.ai_confidence ? Math.round(p.ai_confidence * 100) + '%' : '')}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/proposals/${p.id}/decision`) }}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviewQueue.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⚖️</div>
            <p>Queue is empty. No proposals currently require review.</p>
          </div>
        )}
      </div>
    </div>
  )
}
