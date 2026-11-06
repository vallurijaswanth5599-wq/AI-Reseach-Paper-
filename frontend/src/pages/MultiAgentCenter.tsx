import { useState, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [sources, setSources] = useState<string[]>(['arxiv', 'semantic_scholar']);
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
    setProgress(0);
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

      // Poll status
      pollRef.current = setInterval(async () => {
        try {
          const status = await getAgentStatus(session_id);
          setAgentStatus(status);
          setAgents(status.agents);
          setProgress(status.progress);

          if (status.status === 'completed' || status.status === 'failed') {
            stopPolling();
            setRunning(false);
            setShowResults(true);
            if (status.status === 'completed') {
              toast.success('Agent workflow completed!');
            } else {
              toast.error(`Workflow failed: ${status.error}`);
            }
          }
        } catch {
          // Keep polling
        }
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start workflow';
      toast.error(msg);
      // Demo mode
      simulateDemoRun();
    }
  };

  const simulateDemoRun = () => {
    let step = 0;
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a, i) => {
          if (i < step) return { ...a, status: 'completed' };
          if (i === step) return { ...a, status: 'running' };
          return a;
        })
      );
      setProgress(Math.round((step / INITIAL_AGENTS.length) * 100));
      step++;
      if (step > INITIAL_AGENTS.length) {
        clearInterval(interval);
        setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: 'completed' })));
        setProgress(100);
        setRunning(false);
        setShowResults(true);
        toast.success('Demo workflow completed!');
      }
    }, 1200);
  };

  const handleStop = () => {
    stopPolling();
    setRunning(false);
    toast('Workflow stopped');
  };

  const handleReset = () => {
    stopPolling();
    setRunning(false);
    setAgents(INITIAL_AGENTS);
    setProgress(0);
    setAgentStatus(null);
    setShowResults(false);
  };

  const completedCount = agents.filter((a) => a.status === 'completed').length;
  const papers: Paper[] = (agentStatus?.result?.papers as Paper[]) ?? [];

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Multi-Agent Research Workflow
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Configure your research parameters and let 9 AI agents collaboratively research, analyze, and synthesize academic literature.
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
              placeholder="e.g., Federated learning for healthcare"
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
              placeholder="e.g., What are the main privacy challenges?"
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
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-semibold transition-colors"
          >
            {running ? <LoadingSpinner size="sm" /> : <Play className="h-4 w-4" />}
            {running ? 'Running...' : 'Run Full Agent Workflow'}
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
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Agent Progress
            </p>
            <p className="text-sm font-bold text-blue-500">{progress}%</p>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
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

      {/* Results */}
      {showResults && (
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <button
            onClick={() => setShowResults((v) => !v)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="font-bold text-gray-900 dark:text-white">Workflow Results</h3>
            {showResults ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
          </button>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-gray-200 dark:border-navy-700">
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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {agentStatus?.result ? (
                  <pre className="whitespace-pre-wrap text-xs bg-gray-50 dark:bg-navy-800 p-4 rounded-xl overflow-auto max-h-80">
                    {JSON.stringify(agentStatus.result, null, 2)}
                  </pre>
                ) : 'Summaries will appear here after workflow completes.'}
              </div>
            )}
            {activeTab === 'gaps' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {(agentStatus?.result?.gaps as string[] | undefined)?.length ? (
                  <ul className="space-y-2">
                    {(agentStatus!.result!.gaps as string[]).map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">{i + 1}.</span>
                        <span className="text-gray-700 dark:text-gray-300">{gap}</span>
                      </li>
                    ))}
                  </ul>
                ) : 'Research gaps will appear here after workflow completes.'}
              </div>
            )}
            {activeTab === 'review' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {agentStatus?.result?.review ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-xs bg-gray-50 dark:bg-navy-800 p-4 rounded-xl overflow-auto max-h-80">
                      {JSON.stringify(agentStatus.result.review, null, 2)}
                    </pre>
                  </div>
                ) : 'Literature review will appear here after workflow completes.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
