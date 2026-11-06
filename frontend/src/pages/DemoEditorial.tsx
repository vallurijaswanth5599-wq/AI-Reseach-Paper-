import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { searchPapers, runAgentWorkflow, getAgentStatus } from '../services/api';
import type { Paper, AgentStatus } from '../types';

const SAMPLE_TOPICS = [
  'Federated Learning for Healthcare',
  'Loop Invariant Synthesis in Compilers',
  'Large Language Model Reasoning Benchmarks',
  'Quantum Computing Optimization Algorithms',
];

export default function DemoEditorial() {
  const [topic, setTopic] = useState(SAMPLE_TOPICS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState<string>('Ready');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [statusResult, setStatusResult] = useState<AgentStatus | null>(null);

  const handleRunDemo = async () => {
    setIsRunning(true);
    setProgress(5);
    setCurrentAgent('Research Planner');
    setPapers([]);
    setStatusResult(null);

    try {
      // 1. Fetch papers
      const retrieved = await searchPapers({ topic, max_results: 6 });
      setPapers(retrieved);

      // 2. Start workflow
      const { session_id } = await runAgentWorkflow({ topic, max_results: 6 });

      const pollTimer = setInterval(async () => {
        try {
          const status = await getAgentStatus(session_id);
          setStatusResult(status);
          setProgress(status.progress);
          setCurrentAgent(status.current_agent || 'Completed');

          if (status.status === 'completed' || status.progress >= 100) {
            clearInterval(pollTimer);
            setIsRunning(false);
            setProgress(100);
            setCurrentAgent('Agent Coordinator (Completed)');
            if (status.result?.papers && Array.isArray(status.result.papers)) {
              setPapers(status.result.papers as Paper[]);
            }
          }
        } catch {
          // Keep polling
        }
      }, 900);
    } catch {
      setIsRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Live Interactive Verification
        </p>
        <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-neutral-100 leading-[1.12]">
          Framed Interactive Multi-Agent Workspace
        </h1>
        <p className="mt-4 max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
          Select an academic topic to execute the 9-agent state machine live. The demo connects to federated
          academic indexes and performs real-time structured synthesis directly within this window.
        </p>
      </div>

      {/* ── FRAMED INTERACTIVE WINDOW ────────────────────────────────────── */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#12141c] shadow-2xl backdrop-blur-xl">
        {/* Framed Window Header Bar */}
        <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-black/40 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono text-[11px] text-neutral-400">
              Interactive Agent Sandbox · localhost:8000 / vercel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-neutral-400">
              {isRunning ? 'Execution in progress' : 'Sandbox Ready'}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                isRunning ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* Window Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Preset Buttons & Search Input */}
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400">
              Select or Enter Research Topic:
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  disabled={isRunning}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                    topic === t
                      ? 'bg-white text-neutral-950 font-medium'
                      : 'border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row mt-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isRunning}
                placeholder="Enter any academic topic..."
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-white/30 focus:outline-none"
              />
              <button
                onClick={handleRunDemo}
                disabled={isRunning || !topic.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-neutral-950 shadow-md transition hover:bg-neutral-200 disabled:opacity-50"
              >
                <span>{isRunning ? 'Synthesizing...' : 'Run Agent Workflow'}</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Real-time State & Progress Bar */}
          <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-mono">
                Current Agent: <span className="text-neutral-100 font-medium">{currentAgent}</span>
              </span>
              <span className="font-mono text-rose-300 font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400/80 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Results Display Inside Framed Sandbox */}
          {papers.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-neutral-100">
                  Retrieved & Deduplicated Papers ({papers.length})
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">Verified Identifiers</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {papers.slice(0, 4).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 transition hover:border-white/15"
                  >
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>{p.source || 'Academic Index'}</span>
                      <span>{p.year || 2024}</span>
                    </div>
                    <p className="font-serif text-sm text-neutral-100 leading-snug line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {p.abstract}
                    </p>
                  </div>
                ))}
              </div>

              {/* Research Gaps & Literature Review Preview */}
              {statusResult?.result && (
                <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3">
                  <p className="font-serif text-base text-neutral-100">Discovered Research Gaps</p>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {(statusResult.result.gaps as string[] || []).slice(0, 3).map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-rose-300/80">[{i + 1}]</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sandbox Footer Links */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 border-t border-white/[0.06]">
            <span>Need advanced comparative filters or export?</span>
            <div className="flex items-center gap-3">
              <NavLink to="/research" className="text-neutral-300 hover:text-white underline underline-offset-2">
                Open Full Search Workspace →
              </NavLink>
              <NavLink to="/agents" className="text-neutral-300 hover:text-white underline underline-offset-2">
                Open 9-Agent Console →
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
