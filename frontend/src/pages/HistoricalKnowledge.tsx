import { History, ArrowRight } from 'lucide-react';

export default function HistoricalKnowledge() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Historical Knowledge Base</h1>
        <p className="page-subtitle">Compare current project findings with historical reports and benchmarks.</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="form-group mb-0 flex-1">
              <label className="form-label">Current Project</label>
              <select className="form-control bg-hover font-semibold">
                <option>Talcher Coalfield - 2024</option>
              </select>
            </div>
            <ArrowRight className="text-muted mt-6" />
            <div className="form-group mb-0 flex-1">
              <label className="form-label">Historical Benchmark</label>
              <select className="form-control border-accent-primary">
                <option>Talcher Baseline Report - 2018</option>
                <option>Talcher Survey - 2010</option>
              </select>
            </div>
          </div>
          <div className="mt-6 ml-6">
            <button className="btn btn-primary">Compare Parameters</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title"><History size={20}/> Comparison Results: Key Metrics</h3>
        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Geological Metric</th>
                <th>Historical Value (2018)</th>
                <th>Current Value (2024)</th>
                <th>Observed Difference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Avg Seam Thickness</td>
                <td>4.2m</td>
                <td className="font-semibold">4.8m</td>
                <td className="text-accent-green">+0.6m (+14.3%)</td>
                <td><span className="badge badge-gray">Positive Trend</span></td>
              </tr>
              <tr>
                <td className="font-medium">Estimated Reserves (Mt)</td>
                <td>124.5 Mt</td>
                <td className="font-semibold">118.2 Mt</td>
                <td className="text-accent-red">-6.3 Mt (-5.1%)</td>
                <td><span className="badge badge-red">Depletion</span></td>
              </tr>
              <tr>
                <td className="font-medium">Ash Content (Avg)</td>
                <td>32.5%</td>
                <td className="font-semibold">34.1%</td>
                <td className="text-accent-amber">+1.6%</td>
                <td><span className="badge badge-amber">Warning</span></td>
              </tr>
              <tr>
                <td className="font-medium">Drilling Density</td>
                <td>12 boreholes/km²</td>
                <td className="font-semibold">18 boreholes/km²</td>
                <td className="text-accent-green">+6 boreholes</td>
                <td><span className="badge badge-green">Improved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="evidence-panel mt-6">
          <div className="evidence-header">AI Note on Historical Trend</div>
          <div className="evidence-body">
            The observed difference in Avg Seam Thickness may be attributed to deeper drilling depth in the 2024 exploration phase (Sector B), which accessed previously uncharted bottom seams. 
          </div>
        </div>
      </div>
    </div>
  );
}
