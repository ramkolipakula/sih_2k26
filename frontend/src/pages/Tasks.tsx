
export default function Tasks() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My Tasks</h2>
      <div className="grid grid-cols-3">
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>2 hours ago</div>
          <h4 style={{ marginBottom: '8px' }}>Review Extracted Data</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bokaro Mining Report 2024</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>6 hours ago</div>
          <h4 style={{ marginBottom: '8px' }}>Verify Inconsistency</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Production data mismatch (2 sources)</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>1 day ago</div>
          <h4 style={{ marginBottom: '8px' }}>Report Ready</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Draft report generated for review</p>
        </div>
      </div>
    </div>
  );
}
