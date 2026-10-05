import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function Validation() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Review & Validation Engine</h1>
        <p className="page-subtitle">Automated validation of AI-generated insights and report compliance.</p>
      </div>

      <div className="grid grid-cols-dashboard">
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="section-title">Validation Results: Talcher Geological Report</h3>
            
            <div className="flex flex-col gap-3 mt-4">
              <div className="p-4 border border-light rounded-md flex justify-between items-start bg-hover">
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-green flex-shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-semibold text-sm">Completeness Check</div>
                    <div className="text-sm text-secondary mt-1">Required project metadata and source documents are present.</div>
                  </div>
                </div>
                <span className="badge badge-green">Passed</span>
              </div>

              <div className="p-4 border border-accent-amber rounded-md flex justify-between items-start bg-[#FEF3C710]">
                <div className="flex gap-3">
                  <AlertCircle className="text-accent-amber flex-shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-semibold text-sm">Consistency Check: 2 conflicting values</div>
                    <div className="text-sm text-secondary mt-1">Borehole density reported as 12/km² in summary but 15/km² in Appendix B.</div>
                  </div>
                </div>
                <button className="btn btn-outline py-1 px-3 text-xs border-accent-amber text-accent-amber">Review Issue</button>
              </div>

              <div className="p-4 border border-accent-red rounded-md flex justify-between items-start bg-[#FEE2E210]">
                <div className="flex gap-3">
                  <XCircle className="text-accent-red flex-shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-semibold text-sm">Compliance: Missing Signature</div>
                    <div className="text-sm text-secondary mt-1">Technical Reviewer approval is missing before publication.</div>
                  </div>
                </div>
                <button className="btn btn-outline py-1 px-3 text-xs border-accent-red text-accent-red">Request Approval</button>
              </div>
              
              <div className="p-4 border border-light rounded-md flex justify-between items-start bg-hover">
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-green flex-shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-semibold text-sm">Source Availability</div>
                    <div className="text-sm text-secondary mt-1">All 14 cited references map to ingested documents.</div>
                  </div>
                </div>
                <span className="badge badge-green">Passed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card h-fit">
          <h3 className="section-title">Human Review Workflow</h3>
          <div className="mt-4 flex flex-col gap-4 relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border-light"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-6 h-6 rounded-full bg-accent-green text-white flex items-center justify-center flex-shrink-0"><CheckCircle size={14}/></div>
              <div>
                <div className="text-sm font-semibold">AI Draft Generated</div>
                <div className="text-xs text-muted">Oct 5, 2026 • 10:15 AM</div>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <div className="text-sm font-semibold text-accent-primary">Technical Review</div>
                <div className="text-xs text-muted">Awaiting review by Technical Officer</div>
                <div className="mt-2 flex gap-2">
                  <button className="btn btn-primary text-xs py-1">Approve</button>
                  <button className="btn btn-outline text-xs py-1">Request Changes</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10 opacity-50">
              <div className="w-6 h-6 rounded-full bg-border-strong text-white flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <div className="text-sm font-semibold">Final Validation</div>
                <div className="text-xs text-muted">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
