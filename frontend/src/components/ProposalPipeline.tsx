import React from 'react';

type StageState = 'NOT_STARTED' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';

export interface PipelineStage {
  id: string;
  name: string;
  state: StageState;
  message?: string;
  onRetry?: () => void;
}

interface ProposalPipelineProps {
  stages: PipelineStage[];
}

export function ProposalPipeline({ stages }: ProposalPipelineProps) {
  const getIcon = (state: StageState) => {
    switch (state) {
      case 'COMPLETED': return '✓';
      case 'FAILED': return '✕';
      case 'RUNNING': return '◉';
      case 'QUEUED': return '●';
      case 'BLOCKED': return '🔒';
      default: return '○';
    }
  };

  const getColorClass = (state: StageState) => {
    switch (state) {
      case 'COMPLETED': return 'text-accent-green';
      case 'FAILED': return 'text-accent-red';
      case 'RUNNING': return 'text-accent-blue animate-pulse';
      case 'QUEUED': return 'text-text-secondary';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="pipeline-vertical">
      {stages.map((stage, i) => (
        <div key={stage.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-card)', border: '2px solid',
                borderColor: stage.state === 'COMPLETED' ? 'var(--accent-green)' :
                             stage.state === 'FAILED' ? 'var(--accent-red)' :
                             stage.state === 'RUNNING' ? 'var(--accent-blue)' : 'var(--border-accent)',
                color: stage.state === 'COMPLETED' ? 'var(--accent-green)' :
                       stage.state === 'FAILED' ? 'var(--accent-red)' :
                       stage.state === 'RUNNING' ? 'var(--accent-blue)' : 'var(--text-muted)'
              }}
            >
              {getIcon(stage.state)}
            </div>
            {i < stages.length - 1 && (
              <div style={{ width: '2px', height: '100%', background: stage.state === 'COMPLETED' ? 'var(--accent-green)' : 'var(--border-accent)', margin: '4px 0' }} />
            )}
          </div>
          <div style={{ paddingBottom: '16px', flex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: stage.state === 'RUNNING' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {stage.name}
            </h4>
            
            {stage.state !== 'NOT_STARTED' && (
              <div style={{ fontSize: '0.875rem', marginTop: '4px', color: stage.state === 'FAILED' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                {stage.state === 'RUNNING' ? 'Running...' :
                 stage.state === 'COMPLETED' ? 'Completed' :
                 stage.state === 'FAILED' ? 'Failed' :
                 stage.state === 'QUEUED' ? 'Queued' :
                 stage.state === 'BLOCKED' ? 'Blocked' : ''}
              </div>
            )}
            
            {stage.message && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: stage.state === 'FAILED' ? '1px solid var(--accent-red)' : 'none' }}>
                {stage.message}
              </div>
            )}
            
            {stage.state === 'FAILED' && stage.onRetry && (
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px', border: '1px solid var(--border-accent)' }} onClick={stage.onRetry}>
                Retry {stage.name}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
