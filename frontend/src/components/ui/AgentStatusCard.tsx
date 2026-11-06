import { clsx } from 'clsx';
import { CheckCircle2, XCircle, Loader2, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { AgentLog } from '../../types';

interface AgentStatusCardProps {
  agent: AgentLog;
  index: number;
}

const agentIcons: Record<string, string> = {
  'Research Planner': '🧠',
  'Paper Retrieval': '📚',
  'Paper Extraction': '📄',
  'Summarization': '📝',
  'Comparison': '🔬',
  'Gap Analysis': '🔍',
  'Question Answering': '❓',
  'Literature Review': '📖',
  'Agent Coordinator': '🤖',
};

export function AgentStatusCard({ agent, index }: AgentStatusCardProps) {
  const [expanded, setExpanded] = useState(false);

  const icon = agentIcons[agent.agent_name] || '⚙️';

  const statusConfig = {
    pending: {
      icon: <Clock className="h-4 w-4 text-gray-400" />,
      label: 'Pending',
      color: 'text-gray-500',
      bg: 'bg-gray-100 dark:bg-navy-800',
      border: 'border-gray-200 dark:border-navy-700',
    },
    running: {
      icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
      label: 'Running',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
    },
    completed: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      label: 'Completed',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    failed: {
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      label: 'Failed',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
    },
  };

  const config = statusConfig[agent.status];

  return (
    <div className={clsx('rounded-xl border p-4 transition-all', config.bg, config.border)}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-navy-900 text-base shadow-sm border border-gray-200 dark:border-navy-700 flex-shrink-0">
          {index + 1}
        </div>
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{agent.agent_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.task}</p>
        </div>
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={clsx('text-xs font-medium', config.color)}>{config.label}</span>
        </div>
        {Boolean(agent.result) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>
      {expanded && Boolean(agent.result) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-navy-700">
          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-40">
            {typeof agent.result === 'string'
              ? agent.result
              : JSON.stringify(agent.result, null, 2)}
          </pre>
        </div>
      )}
      {agent.error && (
        <div className="mt-2 text-xs text-red-500 dark:text-red-400">{agent.error}</div>
      )}
    </div>
  );
}
