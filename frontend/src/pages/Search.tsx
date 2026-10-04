
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchQdrant } from '../api';

export default function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      executeSearch(q);
    }
  }, [location]);

  const executeSearch = async (q: string) => {
    setLoading(true);
    const res = await searchQdrant(q);
    setResult(res.data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(query) executeSearch(query);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Search & Analyze</h2>
      <form onSubmit={handleSearch} className="hero-search" style={{ marginBottom: '32px' }}>
        <input 
          type="text" 
          placeholder="Ask a question..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary">Analyze</button>
      </form>

      {loading && <div>Analyzing documents and generating evidence...</div>}

      {result && !loading && (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: 'var(--accent-orange)' }}>✨ AI Generated Answer</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {result.answer}
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Source Evidence</h3>
            {result.sources.map((src: any, idx: number) => (
              <div key={idx} className="card" style={{ marginBottom: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-orange)', backgroundColor: '#FFF8F0', padding: '4px 8px', borderRadius: '4px' }}>
                    {src.verified ? '✓ Verified Source' : 'Unverified'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Similarity: {(src.similarity * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{src.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Page: {src.page} • Section: {src.section}
                </div>
                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', borderLeft: '2px solid var(--border-color)', paddingLeft: '8px', color: 'var(--text-secondary)' }}>
                  "{src.content}"
                </div>
                <button style={{ marginTop: '12px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  View Source Document
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
