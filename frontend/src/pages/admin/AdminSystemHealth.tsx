import { useEffect, useState } from 'react'
import { api } from '../../api'
import { SystemHealth } from '../../types'

export default function AdminSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHealth = () => {
    setLoading(true)
    api.getAdminSystemHealth().then(res => {
      setHealth(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  if (loading && !health) return <div className="spinner" />

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'var(--accent-green)'
      case 'DEGRADED': return 'var(--accent-amber)'
      case 'DOWN': return 'var(--accent-red)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>System Health</h1>
          <p>Monitor the operational status of backend services</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchHealth}>
          ↻ Refresh
        </button>
      </div>

      <div className="grid-3">
        {health && Object.entries(health).map(([service, status]) => (
          <div key={service} className="card" style={{ borderTop: `4px solid ${getStatusColor(status as string)}` }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {service}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{ 
                  width: '12px', height: '12px', borderRadius: '50%', 
                  background: getStatusColor(status as string),
                  boxShadow: `0 0 10px ${getStatusColor(status as string)}`
                }} 
              />
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{status as string}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
