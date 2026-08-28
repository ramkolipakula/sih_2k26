import { useEffect, useState } from 'react'
import { api } from '../../api'
import { KnowledgeDocument } from '../../types'

export default function AdminKnowledgeBase() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDocs = () => {
    setLoading(true)
    api.getAdminKnowledge().then(res => {
      setDocs(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleVerify = async (id: string, currentVerified: boolean) => {
    try {
      await api.verifyKnowledge(id, currentVerified ? 'UNVERIFY' : 'VERIFY')
      fetchDocs()
    } catch (err) {
      alert('Failed to update verification status')
    }
  }

  if (loading) return <div className="spinner" />

  return (
    <div>
      <div className="page-header">
        <h1>Knowledge Base</h1>
        <p>Manage and verify organizational knowledge sources</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Source Type</th>
              <th>Status</th>
              <th>Trust Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.organization} • {d.version || 'v1.0'}</div>
                </td>
                <td>{d.source_type}</td>
                <td>
                  <span className={`badge badge-${d.status.toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  {d.verified ? (
                    <span className="badge badge-approve">✓ VERIFIED OFFICIAL SOURCE</span>
                  ) : (
                    <span className="badge badge-queued">⚠ UNVERIFIED SOURCE</span>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleVerify(d.id, d.verified)}
                  >
                    {d.verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {docs.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>No knowledge documents found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
