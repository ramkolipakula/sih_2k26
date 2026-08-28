import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { ProposalPipeline, PipelineStage } from '../../components/ProposalPipeline'

export default function AdminProposalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('OVERVIEW') // OVERVIEW, TRIBUNAL, EVIDENCE, ACTIVITY, REVIEW
  const [reviewNote, setReviewNote] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const pollInterval = useRef<any>(null)

  const fetchData = async () => {
    try {
      if (!id) return
      const res = await api.getFullReport(id)
      setReport(res.data)
      
      const actRes = await fetch(`/api/v1/admin/proposals/${id}/activity`).then(r => r.json())
      setActivity(actRes.data || [])

      if (['COMPLETED', 'FAILED'].includes(res.data.tribunal?.status) || res.data.pipeline_status?.EVALUATION === 'FAILED') {
        if (pollInterval.current) clearInterval(pollInterval.current)
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    pollInterval.current = setInterval(fetchData, 3000)
    return () => clearInterval(pollInterval.current)
  }, [id])

  const handleReview = async (action: string) => {
    if (!id) return
    setSubmittingReview(true)
    try {
      await api.submitAdminReview(id, action, reviewNote)
      await fetchData()
      setActiveTab('OVERVIEW')
    } catch (e: any) {
      alert('Failed to submit review: ' + e.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const triggerEvaluation = async () => {
    if (!id) return
    try {
      await api.startEvaluation(id)
      fetchData()
    } catch (e: any) {
      alert('Failed to start evaluation: ' + e.message)
    }
  }

  const triggerTribunal = async () => {
    if (!id) return
    try {
      await api.startTribunal(id)
      fetchData()
    } catch (e: any) {
      alert('Failed to start tribunal: ' + e.message)
    }
  }

  if (loading && !report) return <div className="spinner" />
  if (!report) return null

  const p = report.proposal
  const t = report.tribunal
  const hr = activity.find((a: any) => a.event_type === 'HUMAN_REVIEW_SUBMITTED')

  const getPipelineStages = (): PipelineStage[] => {
    const stages: PipelineStage[] = [
      { id: '1', name: 'Upload', state: 'COMPLETED' },
      { id: '2', name: 'Extraction', state: report.pipeline_status?.EXTRACTION === 'COMPLETED' ? 'COMPLETED' : report.pipeline_status?.EXTRACTION === 'FAILED' ? 'FAILED' : report.pipeline_status?.EXTRACTION ? 'RUNNING' : 'QUEUED', message: report.pipeline_status?.EXTRACTION === 'FAILED' ? 'Failed to extract text from document' : undefined },
      { id: '3', name: 'Evaluation', state: report.pipeline_status?.EVALUATION === 'COMPLETED' ? 'COMPLETED' : report.pipeline_status?.EVALUATION === 'FAILED' ? 'FAILED' : report.pipeline_status?.EVALUATION ? 'RUNNING' : report.pipeline_status?.EXTRACTION === 'COMPLETED' ? 'QUEUED' : 'NOT_STARTED', onRetry: report.pipeline_status?.EVALUATION === 'FAILED' ? triggerEvaluation : undefined },
      { id: '4', name: 'Tribunal', state: t?.status === 'COMPLETED' ? 'COMPLETED' : t?.status === 'FAILED' ? 'FAILED' : ['PENDING', 'EVIDENCE_RETRIEVAL', 'AI_ANALYSIS', 'ADVOCATE_RUNNING', 'CRITIC_RUNNING', 'JUDGE_RUNNING'].includes(t?.status) ? 'RUNNING' : report.pipeline_status?.EVALUATION === 'COMPLETED' ? 'QUEUED' : 'BLOCKED', message: t && t.status !== 'COMPLETED' && t.status !== 'FAILED' ? `Current step: ${t.status.replace('_', ' ')}` : undefined, onRetry: t?.status === 'FAILED' ? triggerTribunal : undefined },
      { id: '5', name: 'Human Review', state: hr ? 'COMPLETED' : t?.status === 'COMPLETED' ? 'QUEUED' : 'BLOCKED' },
      { id: '6', name: 'Final Decision', state: hr ? 'COMPLETED' : 'BLOCKED', message: hr ? `Decision: ${hr.metadata?.decision}` : undefined }
    ]
    return stages;
  }

  return (
    <div>
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1>{p.title || 'Untitled Proposal'}</h1>
          <p style={{marginTop: 4}}>ID: {p.id} • Uploaded: {new Date(p.created_at).toLocaleString()}</p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/proposals')}>
            ← Back to Proposals
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16}}>
        {['OVERVIEW', 'TRIBUNAL', 'EVIDENCE', 'ACTIVITY', 'REVIEW'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">Proposal Status</span></div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Recommendation</span>
                <span className={`badge badge-${t?.decision?.toLowerCase() || 'queued'}`}>{t?.decision || 'PENDING'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Human Decision</span>
                <span className={`badge badge-${hr ? hr.metadata?.decision?.toLowerCase() : 'queued'}`}>{hr ? hr.metadata?.decision : 'PENDING'}</span>
              </div>
            </div>
            {t?.judge_verdict && (
              <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Primary Conclusion</h4>
                <p style={{ fontSize: '0.9rem' }}>{t.judge_verdict.executive_summary}</p>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Processing Pipeline</span></div>
            <ProposalPipeline stages={getPipelineStages()} />
            
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              {!report.pipeline_status?.EVALUATION && report.pipeline_status?.EXTRACTION === 'COMPLETED' && (
                <button className="btn btn-primary btn-sm" onClick={triggerEvaluation}>Start Evaluation</button>
              )}
              {!t && report.pipeline_status?.EVALUATION === 'COMPLETED' && (
                <button className="btn btn-primary btn-sm" onClick={triggerTribunal}>Start AI Tribunal Review</button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TRIBUNAL' && (
        <div>
          {!t ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚖️</div>
              <p>Tribunal has not been convened yet.</p>
            </div>
          ) : t.status !== 'COMPLETED' && t.status !== 'FAILED' ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Tribunal is running: {t.status.replace('_', ' ')}</p>
            </div>
          ) : t.status === 'FAILED' ? (
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <p>Tribunal failed to complete.</p>
              <button className="btn btn-primary" onClick={triggerTribunal} style={{marginTop: 16}}>Retry Tribunal</button>
            </div>
          ) : (
            <>
              {t.judge_verdict && (
                <div className="tribunal-judge" style={{marginBottom: 24}}>
                  <div className="agent-role judge-role">Judge Verdict</div>
                  <div className="agent-summary">{t.judge_verdict.executive_summary}</div>
                  <div className="grid-2" style={{marginTop: 24}}>
                    <div>
                      <h4 style={{marginBottom: 12, fontSize: '0.85rem'}}>Decisive Factors</h4>
                      {t.judge_verdict.decisive_factors?.map((df: any, i: number) => (
                        <div key={i} className={`finding-item finding-${df.weight?.toLowerCase()}`}>
                          <strong>{df.factor}</strong> (Favors {df.favors})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="tribunal-container">
                <div className="tribunal-agent tribunal-advocate">
                  <div className="agent-role advocate-role">Advocate (For)</div>
                  <div className="agent-summary">{t.advocate_argument?.executive_summary}</div>
                </div>
                <div className="tribunal-agent tribunal-critic">
                  <div className="agent-role critic-role">Critic (Against)</div>
                  <div className="agent-summary">{t.critic_argument?.executive_summary}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'EVIDENCE' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Evidence Package</span></div>
          {!report.analysis ? (
             <p className="empty-state">Evidence package not generated yet.</p>
          ) : (
            <div className="grid-2">
              <div>
                <h3 className="section-header">Historical Evidence</h3>
                {report.analysis.historical_evidence?.map((h: any, i: number) => (
                  <div key={i} className="evidence-card">
                    <div style={{fontSize: '0.85rem', marginBottom: 4}}>{h.content?.substring(0, 200)}...</div>
                    <div className="evidence-meta">
                      <span className="evidence-tag">Trust: {h.trust_level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'ACTIVITY' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Audit Trail</span></div>
          {activity.map((a: any) => (
            <div key={a.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                {new Date(a.created_at).toLocaleString()} • {a.actor_id}
              </div>
              <div style={{ fontWeight: 600 }}>{a.event_type.replace(/_/g, ' ')}</div>
              {a.metadata && (
                <div style={{ fontSize: '0.85rem', marginTop: 8, color: 'var(--text-secondary)' }}>
                  {JSON.stringify(a.metadata)}
                </div>
              )}
            </div>
          ))}
          {activity.length === 0 && <p className="empty-state">No activity recorded yet.</p>}
        </div>
      )}

      {activeTab === 'REVIEW' && (
        <div className="card" style={{maxWidth: 600, margin: '0 auto'}}>
          <div className="card-header"><span className="card-title">Administrative Decision</span></div>
          {hr ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h3>Decision Recorded: {hr.metadata?.decision}</h3>
              <p>Completed on {new Date(hr.created_at).toLocaleString()}</p>
            </div>
          ) : !t || t.status !== 'COMPLETED' ? (
             <div className="empty-state">
               <p>Tribunal must complete before administrative review.</p>
             </div>
          ) : (
            <div>
              <p style={{marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                Record the final organizational decision.
              </p>
              <div style={{marginBottom: 20}}>
                <label style={{display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600}}>Reviewer Notes</label>
                <textarea 
                  className="review-textarea" 
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                />
              </div>
              <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
                <button className="btn btn-approve" disabled={submittingReview} onClick={() => handleReview('APPROVE')}>Approve</button>
                <button className="btn btn-secondary" disabled={submittingReview} onClick={() => handleReview('REVISION_REQUESTED')}>Request Revision</button>
                <button className="btn btn-reject" disabled={submittingReview} onClick={() => handleReview('REJECT')}>Reject</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
