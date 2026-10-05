import { Sparkles, History, Search } from 'lucide-react';

export default function AICopilot() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="page-title">AI Copilot</h1>
        <p className="page-subtitle">Context-aware intelligence for geological and mining workflows.</p>
      </div>

      <div className="flex gap-6 flex-1 h-full min-h-[500px]">
        {/* Chat History sidebar */}
        <div className="card w-1/4 flex flex-col">
          <div className="section-title text-sm"><History size={16}/> Recent Contexts</div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="p-3 bg-hover rounded-md text-sm font-medium cursor-pointer border-l-2 border-accent-primary">Talcher Stratigraphy Analysis</div>
            <div className="p-3 hover:bg-hover rounded-md text-sm cursor-pointer border-l-2 border-transparent">Jharia Environmental Report</div>
            <div className="p-3 hover:bg-hover rounded-md text-sm cursor-pointer border-l-2 border-transparent">Historical Seam Comparison</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="card flex-1 flex flex-col p-0">
          <div className="p-4 border-b border-light flex justify-between items-center bg-hover rounded-t-lg">
            <div className="font-medium flex items-center gap-2"><Sparkles size={16} className="text-accent-primary"/> Active Context: Talcher Stratigraphy Analysis</div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-accent-primary text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                Compare the current geological findings with historical reports for the eastern block.
              </div>
            </div>
            
            {/* AI message */}
            <div className="flex justify-start">
              <div className="bg-hover border border-light p-4 rounded-lg rounded-tl-none max-w-[90%]">
                <div className="font-semibold mb-2">Historical Comparison: Eastern Block</div>
                <div className="text-secondary text-sm mb-4">
                  Based on the current exploration data (2024) and the historical benchmark report (2018), several key deviations have been observed.
                </div>
                
                <table className="mb-4 bg-card">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Historical (2018)</th>
                      <th>Current (2024)</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Coal Seam Thickness</td>
                      <td>4.2m</td>
                      <td>4.8m</td>
                      <td className="text-accent-green font-medium">+14.3%</td>
                    </tr>
                    <tr>
                      <td>Ash Content</td>
                      <td>32.5%</td>
                      <td>34.1%</td>
                      <td className="text-accent-amber font-medium">+1.6%</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="evidence-panel mt-4 bg-card border-light">
                  <div className="evidence-header"><Sparkles size={14} /> Evidence Trace</div>
                  <div className="evidence-meta mt-1">
                    <span>Source: Exploration Report 2024 (Page 32)</span>
                    <span>•</span>
                    <span>Confidence: 94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-light bg-app rounded-b-lg">
            <div className="global-search w-full bg-card shadow-sm border border-strong">
              <Sparkles size={18} className="text-accent-primary" />
              <input type="text" placeholder="Ask AI to analyze data, summarize reports, or validate findings..." />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted">Suggested:</span>
              <span className="badge badge-gray cursor-pointer hover:bg-border-light">Summarize this project</span>
              <span className="badge badge-gray cursor-pointer hover:bg-border-light">Identify inconsistencies</span>
              <span className="badge badge-gray cursor-pointer hover:bg-border-light">Find missing information</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
