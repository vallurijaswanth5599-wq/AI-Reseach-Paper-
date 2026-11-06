export interface Paper {
  id: string;
  arxiv_id?: string;
  semantic_id?: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  doi?: string;
  url?: string;
  pdf_url?: string;
  source: string;
  citations?: number;
  keywords?: string[];
}

export interface PaperSummary {
  paper_id: string;
  objective: string;
  methodology: string;
  dataset: string;
  findings: string;
  limitations: string;
  future_work: string;
  full_summary: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  topic: string;
  created_at: string;
  updated_at: string;
}

export interface AgentStatus {
  session_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_agent: string;
  progress: number;
  agents: AgentLog[];
  result?: AgentResult;
  error?: string;
}

export interface AgentResult {
  papers?: Paper[];
  summaries?: PaperSummary[];
  gaps?: string[];
  review?: LiteratureReview;
  [key: string]: unknown;
}

export interface AgentLog {
  agent_name: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  started_at?: string;
  completed_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: PaperSource[];
  created_at: string;
}

export interface PaperSource {
  paper_id: string;
  title: string;
  snippet: string;
}

export interface LiteratureReview {
  id: string;
  title: string;
  content: ReviewContent;
  papers_used: string[];
  citation_style: string;
  created_at: string;
}

export interface ReviewContent {
  title: string;
  introduction: string;
  background: string;
  themes: string[];
  literature_analysis: string;
  methodology_comparison: string;
  findings: string;
  limitations: string;
  gaps: string;
  conclusion: string;
  references: string[];
}

export interface SearchRequest {
  topic: string;
  keywords?: string;
  year_from?: number;
  year_to?: number;
  sources?: string[];
  max_results?: number;
}

export interface Stats {
  total_papers: number;
  total_reviews: number;
  total_projects: number;
  recent_searches: number;
}

export interface ComparisonResult {
  papers: Paper[];
  comparison_table: ComparisonRow[];
  similarities: string[];
  differences: string[];
  strengths: Record<string, string[]>;
  weaknesses: Record<string, string[]>;
  summary: string;
}

export interface ComparisonRow {
  aspect: string;
  values: Record<string, string>;
}

export interface AnalysisResult {
  paper: Paper;
  summary: PaperSummary;
  algorithms?: string[];
  datasets?: string[];
  metrics?: string[];
  key_contributions?: string[];
}
