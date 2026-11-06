import axios from 'axios';
import type {
  Paper,
  Project,
  AgentStatus,
  ChatMessage,
  LiteratureReview,
  Stats,
  SearchRequest,
  ComparisonResult,
  AnalysisResult,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const searchPapers = (req: SearchRequest) =>
  api.post<Paper[]>('/api/search', req).then((r) => r.data);

export const getPaper = (id: string) =>
  api.get<Paper>(`/api/papers/${id}`).then((r) => r.data);

export const analyzePaper = (paperId: string) =>
  api.post<AnalysisResult>(`/api/papers/analyze/${paperId}`).then((r) => r.data);

export const summarizePapers = (paperIds: string[], projectId?: string) =>
  api
    .post<{ summaries: AnalysisResult[] }>('/api/papers/summarize', {
      paper_ids: paperIds,
      project_id: projectId,
    })
    .then((r) => r.data);

export const comparePapers = (paperIds: string[], projectId?: string) =>
  api
    .post<ComparisonResult>('/api/papers/compare', {
      paper_ids: paperIds,
      project_id: projectId,
    })
    .then((r) => r.data);

export const analyzeGaps = (paperIds: string[], topic: string) =>
  api
    .post<{ gaps: string[]; recommendations: string[] }>('/api/papers/analyze-gaps', {
      paper_ids: paperIds,
      topic,
    })
    .then((r) => r.data);

export const runAgentWorkflow = (req: {
  topic: string;
  research_question?: string;
  sources?: string[];
  max_results?: number;
}) =>
  api.post<{ session_id: string }>('/api/agents/run', req).then((r) => r.data);

export const getAgentStatus = (sessionId: string) =>
  api.get<AgentStatus>(`/api/agents/status/${sessionId}`).then((r) => r.data);

export const sendChatMessage = (req: {
  message: string;
  paper_ids?: string[];
  conversation_id?: string;
}) =>
  api
    .post<{ message: ChatMessage; conversation_id: string }>('/api/chat', req)
    .then((r) => r.data);

export const getChatHistory = (conversationId: string) =>
  api.get<ChatMessage[]>(`/api/chat/history/${conversationId}`).then((r) => r.data);

export const generateLiteratureReview = (req: {
  paper_ids: string[];
  topic: string;
  citation_style?: string;
  project_id?: string;
}) =>
  api.post<{ review_id: string }>('/api/literature-review/generate', req).then((r) => r.data);

export const getLiteratureReview = (id: string) =>
  api.get<LiteratureReview>(`/api/literature-review/${id}`).then((r) => r.data);

export const getProjects = () =>
  api.get<Project[]>('/api/projects').then((r) => r.data);

export const createProject = (data: { name: string; description?: string; topic: string }) =>
  api.post<Project>('/api/projects', data).then((r) => r.data);

export const deleteProject = (id: string) =>
  api.delete(`/api/projects/${id}`).then((r) => r.data);

export const savePaper = (req: { paper_id: string; project_id: string }) =>
  api.post('/api/papers/save', req).then((r) => r.data);

export const getSavedPapers = (projectId: string) =>
  api.get<Paper[]>(`/api/papers/saved/${projectId}`).then((r) => r.data);

export const getStats = () => api.get<Stats>('/api/stats').then((r) => r.data);

export const checkHealth = () => api.get<{ status: string }>('/health').then((r) => r.data);

export const exportDocx = (reviewId: string) =>
  `${API_BASE}/api/literature-review/export/docx/${reviewId}`;

export const exportPdf = (reviewId: string) =>
  `${API_BASE}/api/literature-review/export/pdf/${reviewId}`;
