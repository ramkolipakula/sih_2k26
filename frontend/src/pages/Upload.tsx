import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'docx'].includes(ext || '')) {
      setError('Only PDF and DOCX files are supported')
      return
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('File exceeds 25MB limit')
      return
    }
    setError('')
    setFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await api.uploadProposal(file)
      if (res.success && res.data) {
        // Auto-trigger processing
        const proposalId = res.data.id
        await api.processProposal(proposalId)
        navigate(`/proposals/${proposalId}`)
      } else {
        setError(res.error || 'Upload failed')
      }
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Upload R&D Proposal</h1>
        <p>Upload a proposal document for AI-powered evaluation and tribunal review</p>
      </div>

      <div className="card" style={{maxWidth: 700, margin: '0 auto'}}>
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf,.docx" hidden
                 onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="upload-icon">📄</div>
          <div className="upload-text">
            {file ? file.name : 'Drop your proposal here or click to browse'}
          </div>
          <div className="upload-hint">
            {file
              ? `${(file.size / 1024 / 1024).toFixed(1)} MB — ${file.type || file.name.split('.').pop()?.toUpperCase()}`
              : 'Supports PDF and DOCX — Max 25MB'}
          </div>
        </div>

        {error && (
          <div style={{color: 'var(--accent-red)', fontSize: '0.85rem', marginTop: 16, textAlign: 'center'}}>
            ⚠ {error}
          </div>
        )}

        <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24}}>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? '⏳ Uploading...' : '🚀 Upload & Evaluate'}
          </button>
          {file && (
            <button className="btn btn-secondary" onClick={() => { setFile(null); setError('') }}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
