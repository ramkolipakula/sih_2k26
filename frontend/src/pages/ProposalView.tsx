import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { ProposalPipeline, PipelineStage } from '../components/ProposalPipeline'

export default function ProposalView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('PIPELINE')
  const pollInterval = useRef<any>(null)

  const fetchData = async () => {
    try {
      if (!id) return
      const res = await api.getFullReport(id)
      setReport(res.data)
      
      const t = res.data.tribunal
      if (['COMPLETED', 'FAILED'].includes(t?.status) || res.data.pipeline_status?.EVALUATION === 'FAILED') {
        if (pollInterval.current) clearInterval(pollInterval.current)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    pollInterval.current = setInterval(fetchData, 3000)
    return () => clearInterval(pollInterval.current)
  }, [id])

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
  if (error) return <div className="empty-state"><div className="empty-state-icon">❌</div><p>{error}</p></div>
  if (!report) return null

  const p = report.proposal
  const t = report.tribunal
  const hr = report.human_review

  const getPipelineStages = (): PipelineStage[] => {
    return [
      { id: '1', name: 'Upload', state: 'COMPLETED' },
      { id: '2', name: 'Extraction', state: report.pipeline_status?.EXTRACTION === 'COMPLETED' ? 'COMPLETED' : report.pipeline_status?.EXTRACTION === 'FAILED' ? 'FAILED' : report.pipeline_status?.EXTRACTION ? 'RUNNING' : 'QUEUED', message: report.pipeline_status?.EXTRACTION === 'FAILED' ? 'Failed to extract text from document' : undefined },
      { id: '3', name: 'Evaluation', state: report.pipeline_status?.EVALUATION === 'COMPLETED' ? 'COMPLETED' : report.pipeline_status?.EVALUATION === 'FAILED' ? 'FAILED' : report.pipeline_status?.EVALUATION ? 'RUNNING' : report.pipeline_status?.EXTRACTION === 'COMPLETED' ? 'QUEUED' : 'NOT_STARTED', onRetry: report.pipeline_status?.EVALUATION === 'FAILED' ? triggerEvaluation : undefined },
      { id: '4', name: 'Tribunal', state: t?.status === 'COMPLETED' ? 'COMPLETED' : t?.status === 'FAILED' ? 'FAILED' : ['PENDING', 'EVIDENCE_RETRIEVAL', 'AI_ANALYSIS', 'ADVOCATE_RUNNING', 'CRITIC_RUNNING', 'JUDGE_RUNNING'].includes(t?.status) ? 'RUNNING' : report.pipeline_status?.EVALUATION === 'COMPLETED' ? 'QUEUED' : 'BLOCKED', message: t && t.status !== 'COMPLETED' && t.status !== 'FAILED' ? `Current step: ${t.status.replace('_', ' ')}` : undefined, onRetry: t?.status === 'FAILED' ? triggerTribunal : undefined },
      { id: '5', name: 'Human Review', state: hr ? 'COMPLETED' : t?.status === 'COMPLETED' ? 'QUEUED' : 'BLOCKED' },
      { id: '6', name: 'Final Decision', state: hr ? 'COMPLETED' : 'BLOCKED', message: hr ? `Decision: ${hr.action}` : undefined }
    ]
  }

  return (
    <div>
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1>{p.title || 'Untitled Proposal'}</h1>
          <p style={{marginTop: 4}}>
            ID: {p.id} • Uploaded: {new Date(p.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16}}>
        {['PIPELINE', 'TRIBUNAL', 'EVIDENCE'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'PIPELINE' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header">
            <span className="card-title">Processing Pipeline</span>
          </div>
          
          <ProposalPipeline stages={getPipelineStages()} />

          <div style={{marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center'}}>
            {!report.pipeline_status?.EVALUATION && report.pipeline_status?.EXTRACTION === 'COMPLETED' && (
              <button className="btn btn-primary" onClick={triggerEvaluation}>Start Evaluation</button>
            )}
            {!t && report.pipeline_status?.EVALUATION === 'COMPLETED' && (
              <button className="btn btn-primary" onClick={triggerTribunal}>Start AI Tribunal Review</button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'TRIBUNAL' && (
        <div>
          {!t ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚖️</div>
              <p>Tribunal has not been convened yet.</p>
              {report.pipeline_status?.EVALUATION === 'COMPLETED' && (
                <button className="btn btn-primary" style={{marginTop: 16}} onClick={triggerTribunal}>
                  Start AI Tribunal Review
                </button>
              )}
            </div>
          ) : t.status !== 'COMPLETED' && t.status !== 'FAILED' ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Tribunal is currently in session...</p>
              <div style={{marginTop: 12, fontSize: '0.85rem', color: 'var(--accent-cyan)'}}>
                Current Stage: {t.status.replace('_', ' ')}
              </div>
            </div>
          ) : t.status === 'FAILED' ? (
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <p>Tribunal encountered an error.</p>
              <button className="btn btn-primary" style={{marginTop: 16}} onClick={triggerTribunal}>
                Retry Tribunal
              </button>
            </div>
          ) : (
            <>
              <div className={`decision-banner ${t.decision?.toLowerCase()}`}>
                <div className="decision-text">{t.decision}</div>
                <div className="decision-confidence">
                  Judge Confidence: {(t.confidence * 100).toFixed(1)}%
                </div>
                {hr && (
                  <div style={{marginTop: 16}}>
                    <span className="badge badge-approve" style={{fontSize: '0.85rem'}}>
                      Human Review: {hr.action}
                    </span>
                  </div>
                )}
              </div>

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
                    <div>
                      <h4 style={{marginBottom: 12, fontSize: '0.85rem'}}>Assessment</h4>
                      <ul style={{listStyle: 'none', gap: 8, display: 'flex', flexDirection: 'column'}}>
                        <li><strong>Novelty:</strong> {t.judge_verdict.novelty_verdict}</li>
                        <li><strong>Progression:</strong> {t.judge_verdict.progressive_rd_verdict}</li>
                        <li><strong>Compliance:</strong> {t.judge_verdict.compliance_summary?.passed_rules} Passed, {t.judge_verdict.compliance_summary?.failed_rules} Failed</li>
                      </ul>
                      
                      <h4 style={{marginTop: 16, marginBottom: 8, fontSize: '0.85rem'}}>Unresolved Concerns</h4>
                      <ul style={{paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                        {t.judge_verdict.unresolved_concerns?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                        {(!t.judge_verdict.unresolved_concerns || t.judge_verdict.unresolved_concerns.length === 0) && <li>None</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="tribunal-container">
                <div className="tribunal-agent tribunal-advocate">
                  <div className="agent-role advocate-role">Advocate (For)</div>
                  <div className="agent-summary">{t.advocate_argument?.executive_summary}</div>
                  
                  <h4 style={{marginTop: 20, marginBottom: 12, fontSize: '0.85rem'}}>Strengths</h4>
                  {t.advocate_argument?.strengths?.map((s: any, i: number) => (
                    <div key={i} className="claim-item">
                      <div className="claim-text">✅ {s.claim}</div>
                      {s.evidence?.map((e: any, j: number) => (
                        <div key={j} className="claim-evidence">
                          ↳ [{e.document_id?.substring(0,8)}] "{e.quote}"
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {t.advocate_argument?.acknowledged_weaknesses?.length > 0 && (
                    <>
                      <h4 style={{marginTop: 20, marginBottom: 12, fontSize: '0.85rem'}}>Acknowledged Weaknesses</h4>
                      <ul style={{paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                        {t.advocate_argument.acknowledged_weaknesses.map((w: any, i: number) => (
                          <li key={i}>{w.weakness} <br/><span style={{opacity: 0.7}}>Mitigation: {w.mitigation}</span></li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="tribunal-agent tribunal-critic">
                  <div className="agent-role critic-role">Critic (Against)</div>
                  <div className="agent-summary">{t.critic_argument?.executive_summary}</div>
                  
                  <h4 style={{marginTop: 20, marginBottom: 12, fontSize: '0.85rem'}}>Challenges</h4>
                  {t.critic_argument?.challenges?.map((c: any, i: number) => (
                    <div key={i} className="claim-item">
                      <div className="claim-text">❌ {c.counterargument}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>vs: {c.claim}</div>
                      {c.evidence?.map((e: any, j: number) => (
                        <div key={j} className="claim-evidence" style={{color: 'var(--accent-red)'}}>
                          ↳ [{e.document_id?.substring(0,8)}] "{e.quote}"
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {t.critic_argument?.duplication_concerns?.length > 0 && (
                    <>
                      <h4 style={{marginTop: 20, marginBottom: 12, fontSize: '0.85rem'}}>Duplication Concerns</h4>
                      <ul style={{paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                        {t.critic_argument.duplication_concerns.map((d: any, i: number) => (
                          <li key={i}><strong>{d.existing_work}</strong>: {d.overlap}</li>
                        ))}
                      </ul>
                    </>
                  )}
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
                <h3 className="section-header">Rule Violations</h3>
                {report.analysis.findings?.filter((f: any) => f.status === 'FAIL' || f.severity !== 'LOW').map((f: any, i: number) => (
                  <div key={i} className={`finding-item finding-${f.severity?.toLowerCase() || 'medium'}`}>
                    <strong>[{f.category}]</strong> {f.description}
                  </div>
                ))}
                {(!report.analysis.findings || report.analysis.findings.filter((f: any) => f.status === 'FAIL').length === 0) && (
                  <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>No rule violations found.</p>
                )}

                <h3 className="section-header">Evidence Gaps (AI)</h3>
                {report.analysis.evidence_gaps?.map((g: any, i: number) => (
                  <div key={i} className={`finding-item finding-${g.severity?.toLowerCase() || 'medium'}`}>
                    <strong>{g.claim}</strong><br/>
                    Missing: {g.gap || g.issue}
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="section-header">Historical Evidence</h3>
                {report.analysis.historical_evidence?.map((h: any, i: number) => (
                  <div key={i} className="evidence-card">
                    <div style={{fontSize: '0.85rem', marginBottom: 4}}>{h.content?.substring(0, 200)}...</div>
                    <div className="evidence-meta">
                      <span className="evidence-tag">ID: {h.document_id?.substring(0,8)}</span>
                      <span className="evidence-tag">Org: {h.organization}</span>
                      <span className="evidence-tag" style={{
                        color: h.trust_level === 'HIGH' ? 'var(--accent-green)' : 'inherit'
                      }}>Trust: {h.trust_level}</span>
                    </div>
                  </div>
                ))}

                <h3 className="section-header">External Research</h3>
                {report.external_research?.map((r: any, i: number) => (
                  <div key={i} className="evidence-card">
                    <div style={{fontWeight: 600, fontSize: '0.9rem', marginBottom: 4}}>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{color: 'var(--accent-blue)', textDecoration: 'none'}}>
                        {r.title || r.url}
                      </a>
                    </div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{r.snippet}</div>
                    <div className="evidence-meta">
                      <span className="evidence-tag">{r.source}</span>
                      <span className="evidence-tag">Trust: {r.trust_level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
