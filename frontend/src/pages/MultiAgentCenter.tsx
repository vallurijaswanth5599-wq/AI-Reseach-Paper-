import { useState, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { runAgentWorkflow, getAgentStatus } from '../services/api';
import { AgentStatusCard } from '../components/ui/AgentStatusCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PaperCard } from '../components/ui/PaperCard';
import type { AgentStatus, AgentLog, Paper } from '../types';

const SOURCES = ['arxiv', 'semantic_scholar', 'openalex', 'crossref'];

const INITIAL_AGENTS: AgentLog[] = [
  { agent_name: 'Research Planner', task: 'Plans research strategy and query formulation', status: 'pending' },
  { agent_name: 'Paper Retrieval', task: 'Fetches papers from academic databases', status: 'pending' },
  { agent_name: 'Paper Extraction', task: 'Extracts structured content from papers', status: 'pending' },
  { agent_name: 'Summarization', task: 'Generates concise summaries for each paper', status: 'pending' },
  { agent_name: 'Comparison', task: 'Compares methodologies and results across papers', status: 'pending' },
  { agent_name: 'Gap Analysis', task: 'Identifies research gaps and future directions', status: 'pending' },
  { agent_name: 'Question Answering', task: 'Answers research questions from paper content', status: 'pending' },
  { agent_name: 'Literature Review', task: 'Generates comprehensive literature review', status: 'pending' },
  { agent_name: 'Agent Coordinator', task: 'Orchestrates all agents and manages workflow', status: 'pending' },
];

type ResultTab = 'papers' | 'summaries' | 'gaps' | 'review';

export default function MultiAgentCenter() {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [sources, setSources] = useState<string[]>(['arxiv', 'semantic_scholar', 'openalex', 'crossref']);
  const [maxResults, setMaxResults] = useState(10);

  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<AgentLog[]>(INITIAL_AGENTS);
  const [progress, setProgress] = useState(0);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('papers');
  const [showResults, setShowResults] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const toggleSource = (src: string) => {
    setSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  const handleRun = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a research topic');
      return;
    }
    setRunning(true);
    setAgents(INITIAL_AGENTS.map((a, i) => ({
      ...a,
      status: i === 0 ? 'running' : 'pending',
    })));
    setProgress(5);
    setShowResults(false);

    try {
      const { session_id } = await runAgentWorkflow({
        topic: topic.trim(),
        research_question: question.trim() || undefined,
        sources,
        max_results: maxResults,
      });
      sessionRef.current = session_id;
      toast.success('Agent workflow started!');

      // Poll status every 1.2 seconds
      pollRef.current = setInterval(async () => {
        try {
          const status = await getAgentStatus(session_id);
          setAgentStatus(status);

          if (status.agents && Array.isArray(status.agents) && status.agents.length > 0) {
            setAgents(status.agents);
          }
          if (typeof status.progress === 'number') {
            setProgress(status.progress);
          }

          if (status.status === 'completed' || status.status === 'failed') {
            stopPolling();
            setRunning(false);
            setShowResults(true);
            if (status.status === 'completed') {
              setProgress(100);
              toast.success('Agent workflow completed successfully!');
            } else {
              toast.error(`Workflow encountered an error: ${status.error || 'Unknown'}`);
            }
          }
        } catch {
          // Keep polling
        }
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start workflow';
      toast.error(msg);
      setRunning(false);
    }
  };

  const handleStop = () => {
    stopPolling();
    setRunning(false);
    toast('Workflow paused');
  };

  const handleReset = () => {
    stopPolling();
    setRunning(false);
    setAgents(INITIAL_AGENTS);
    setProgress(0);
    setAgentStatus(null);
    setShowResults(false);
  };

  const completedCount = Array.isArray(agents)
    ? agents.filter((a) => a.status === 'completed').length
    : 0;

  const papers: Paper[] = (agentStatus?.result?.papers as Paper[]) ?? [];
  const summaries = (agentStatus?.result?.summaries as Record<string, any>) ?? {};
  const gaps = (agentStatus?.result?.gaps as string[]) ?? [];
  const review = (agentStatus?.result?.review as Record<string, any>) ?? (agentStatus?.result?.literature_review as Record<string, any>) ?? null;

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Multi-Agent Research Workflow
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Configure your research parameters and let 9 specialized AI agents collaboratively plan, retrieve, summarize, compare, and synthesize academic literature.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Research Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Federated learning for healthcare or Data Science"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Research Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the main privacy and scalability challenges?"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sources</label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((src) => (
                <button
                  key={src}
                  onClick={() => toggleSource(src)}
                  disabled={running}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                    sources.includes(src)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-50 dark:bg-navy-800 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {src.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Max Papers: <span className="text-blue-500 font-bold">{maxResults}</span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={maxResults}
              disabled={running}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-32 accent-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-semibold transition-colors shadow-md shadow-blue-500/20"
          >
            {running ? <LoadingSpinner size="sm" /> : <Play className="h-4 w-4" />}
            {running ? 'Running Agents...' : 'Run Full Agent Workflow'}
          </button>
          {running && (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          )}
          <button
            onClick={handleReset}
            disabled={running}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {(running || progress > 0) && (
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span>Agent Progress</span>
              {progress === 100 && <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />}
            </p>
            <p className="text-sm font-bold text-blue-500">{progress}%</p>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {completedCount} / {agents.length} agents completed
          </p>
        </div>
      )}

      {/* Agent Pipeline */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Agent Pipeline</h3>
        <div className="space-y-3">
          {agents.map((agent, i) => (
            <AgentStatusCard key={agent.agent_name} agent={agent} index={i} />
          ))}
        </div>
      </div>

      {/* Results Section */}
      {(showResults || agentStatus?.status === 'completed' || papers.length > 0) && (
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Workflow Results</h3>
            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              Completed
            </span>
          </div>

          <div className="flex border-b border-gray-200 dark:border-navy-700 gap-1">
            {(['papers', 'summaries', 'gaps', 'review'] as ResultTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'papers' && (
              papers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {papers.map((p) => <PaperCard key={p.id} paper={p} />)}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {agentStatus?.status === 'completed'
                    ? 'No papers returned by agents.'
                    : 'Papers will appear here after the workflow completes.'}
                </p>
              )
            )}

            {activeTab === 'summaries' && (
              <div className="space-y-4">
                {Object.keys(summaries).length > 0 ? (
                  Object.entries(summaries).map(([paperId, s]: [string, any]) => {
                    const matchedPaper = papers.find((p) => String(p.id) === String(paperId));
                    return (
                      <div key={paperId} className="p-4 bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                          {matchedPaper?.title || `Paper #${paperId}`}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="font-medium text-blue-500 block">Objective:</span>
                            <p className="text-gray-600 dark:text-gray-300">{s.objective || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-purple-500 block">Methodology:</span>
                            <p className="text-gray-600 dark:text-gray-300">{s.methodology || 'N/A'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-emerald-500 block">Findings:</span>
                            <p className="text-gray-600 dark:text-gray-300">{s.findings || s.full_summary || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Summaries will appear here after the summarization agent completes.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-3">
                {gaps.length > 0 ? (
                  <ul className="space-y-2.5">
                    {gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Research gaps will appear here after the gap analysis agent completes.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-4">
                {review ? (
                  <div className="p-6 bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {review.title || 'Synthesized Academic Literature Review'}
                    </h3>
                    {review.introduction && (
                      <div>
                        <h4 className="font-semibold text-blue-500 text-xs uppercase tracking-wider mb-1">Introduction</h4>
                        <p>{review.introduction}</p>
                      </div>
                    )}
                    {review.background && (
                      <div>
                        <h4 className="font-semibold text-blue-500 text-xs uppercase tracking-wider mb-1">Background</h4>
                        <p>{review.background}</p>
                      </div>
                    )}
                    {review.findings && (
                      <div>
                        <h4 className="font-semibold text-blue-500 text-xs uppercase tracking-wider mb-1">Key Findings</h4>
                        <p className="whitespace-pre-line">{review.findings}</p>
                      </div>
                    )}
                    {review.conclusion && (
                      <div>
                        <h4 className="font-semibold text-blue-500 text-xs uppercase tracking-wider mb-1">Conclusion</h4>
                        <p>{review.conclusion}</p>
                      </div>
                    )}
                    {review.references && Array.isArray(review.references) && review.references.length > 0 && (
                      <div className="pt-2 border-t border-gray-200 dark:border-navy-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-xs uppercase tracking-wider mb-2">References</h4>
                        <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          {review.references.map((ref: string, idx: number) => (
                            <li key={idx}>[{idx + 1}] {ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Literature review will appear here after the workflow completes.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
