export interface Proposal {
  id: string;
  title: string | null;
  uploaded_file_name: string;
  status: string;
  created_at: string;
}

export interface ProposalDetail extends Proposal {
  file_size: number;
}

export interface ProcessingJob {
  id: string;
  proposal_id: string;
  job_type: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface EvaluationReport {
  overall_novelty_score: number;
  overall_progressive_score: number;
  evidence_confidence: number;
  unverified_sources_count: number;
  novelty_analysis: any;
  progressive_analysis: any;
  compliance_check: any;
  gap_detection: any;
  findings: any[];
}

export interface EvidenceReference {
  id: string;
  document_id: string;
  source_name: string;
  source_type: string;
  citation_text: string;
  confidence: number;
}

export interface AgentArgument {
  position: string;
  executive_summary: string;
  strengths?: any[];
  acknowledged_weaknesses?: any[];
  challenges?: any[];
  duplication_concerns?: any[];
  overall_confidence: number;
  advocate_rebuttals?: any[];
}

export interface JudgeDecision {
  decision: string;
  confidence: number;
  executive_summary: string;
  decisive_factors: any[];
  recommendation: string;
  unresolved_concerns: string[];
}

export interface TribunalSession {
  id: string;
  proposal_id: string;
  status: string;
  decision: string | null;
  confidence: number | null;
  advocate_argument: AgentArgument | null;
  critic_argument: AgentArgument | null;
  judge_verdict: JudgeDecision | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ReviewDecision {
  id: string;
  decision: string;
}

export interface AuditEvent {
  id: string;
  actor_id: string;
  event_type: string;
  metadata: any;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  source_type: string;
  organization: string;
  version: string;
  effective_date: string;
  status: string;
  verified: boolean;
  created_at: string;
}

export interface SystemHealth {
  api: string;
  db: string;
  celery: string;
  redis: string;
  llm: string;
}

export interface AdminProposal {
  id: string;
  title: string | null;
  uploaded_file_name: string;
  status: string;
  created_at: string;
  ai_decision: string;
  ai_confidence: number | null;
  human_decision: string;
}
