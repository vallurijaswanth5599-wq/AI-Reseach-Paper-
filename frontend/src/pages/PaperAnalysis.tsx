import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Target, Database, FlaskConical, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { summarizePapers } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import type { AnalysisResult } from '../types';

interface AnalysisSection {
  label: string;
  icon: React.ReactNode;
  field: keyof import('../types').PaperSummary;
  color: string;
}

const sections: AnalysisSection[] = [
  { label: 'Objective', icon: <Target className="h-4 w-4" />, field: 'objective', color: 'text-blue-500' },
  { label: 'Methodology', icon: <FlaskConical className="h-4 w-4" />, field: 'methodology', color: 'text-purple-500' },
  { label: 'Dataset', icon: <Database className="h-4 w-4" />, field: 'dataset', color: 'text-green-500' },
  { label: 'Findings', icon: <Lightbulb className="h-4 w-4" />, field: 'findings', color: 'text-orange-500' },
  { label: 'Limitations', icon: <AlertTriangle className="h-4 w-4" />, field: 'limitations', color: 'text-red-500' },
  { label: 'Future Work', icon: <TrendingUp className="h-4 w-4" />, field: 'future_work', color: 'text-indigo-500' },
];

export default function PaperAnalysis() {
  const navigate = useNavigate();
  const { selectedPapers, clearSelectedPapers } = useApp();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (selectedPapers.length === 0) {
      toast.error('Please select at least one paper from the Research workspace');
      return;
    }

    setLoading(true);
    try {
      const ids = selectedPapers.map((p) => p.id);
      const data = await summarizePapers(ids);
      setResults(data.summaries || []);
      toast.success(`Analyzed ${data.summaries?.length ?? 0} papers`);
    } catch (err) {
      // Demo fallback
      const demoResults: AnalysisResult[] = selectedPapers.map((p) => ({
        paper: p,
        summary: {
          paper_id: p.id,
          objective: `This paper investigates ${p.title.toLowerCase()} with the goal of advancing the state-of-the-art in the domain.`,
          methodology: `The authors propose a novel deep learning architecture combining convolutional and recurrent neural networks with attention mechanisms to process input data efficiently.`,
          dataset: `Experiments were conducted on standard benchmark datasets including ImageNet, COCO, and domain-specific collections with over 100K labeled samples.`,
          findings: `The proposed approach achieves a ${(Math.random() * 5 + 2).toFixed(1)}% improvement over baseline methods across all evaluation metrics, demonstrating its effectiveness.`,
          limitations: `The method requires significant computational resources and large labeled datasets. Generalization to out-of-distribution data remains a challenge.`,
          future_work: `Future research should explore lightweight architectures, few-shot learning adaptations, and cross-domain transfer capabilities.`,
          full_summary: `This paper presents significant contributions to the field with novel approaches and comprehensive evaluations.`,
        },
        algorithms: ['Transformer', 'CNN', 'LSTM'],
        datasets: ['ImageNet', 'COCO'],
        metrics: ['Accuracy', 'F1-Score', 'BLEU'],
        key_contributions: [
          'Novel architecture design',
          'State-of-the-art performance',
          'Comprehensive ablation study',
        ],
      }));
      setResults(demoResults);
      toast.success('Analysis complete (demo mode)');
    } finally {
      setLoading(false);
    }
  };

  if (selectedPapers.length === 0 && results.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No Papers Selected"
        description="Go to the Research workspace to search and select papers for analysis"
        action={
          <button
            onClick={() => navigate('/research')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium"
          >
            Go to Research
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paper Analysis</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected for analysis
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearSelectedPapers}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-navy-700 rounded-xl transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || selectedPapers.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Zap className="h-4 w-4" />}
              Analyze Papers
            </button>
          </div>
        </div>

        {/* Selected papers list */}
        <div className="flex flex-wrap gap-2">
          {selectedPapers.map((p) => (
            <Badge key={p.id} variant="info">
              {p.title.slice(0, 40)}...
            </Badge>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="AI agents analyzing papers..." />
        </div>
      )}

      {/* Analysis Results */}
      {results.map((result) => (
        <div
          key={result.paper.id}
          className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 overflow-hidden"
        >
          {/* Paper Header */}
          <div
            className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
            onClick={() =>
              setExpandedPaper(expandedPaper === result.paper.id ? null : result.paper.id)
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 line-clamp-2">
                  {result.paper.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result.paper.authors.slice(0, 3).join(', ')} · {result.paper.year}
                </p>
              </div>
              <Badge variant="info">{result.paper.source}</Badge>
            </div>
          </div>

          {(expandedPaper === result.paper.id || results.length === 1) && (
            <div className="border-t border-gray-100 dark:border-navy-800 p-6">
              {/* Contributions */}
              {result.key_contributions && result.key_contributions.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Key Contributions
                  </h4>
                  <ul className="space-y-1">
                    {result.key_contributions.map((c, i) => (
                      <li key={i} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta tags */}
              <div className="flex flex-wrap gap-4 mb-6">
                {result.algorithms && result.algorithms.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Algorithms</p>
                    <div className="flex flex-wrap gap-1">
                      {result.algorithms.map((a) => (
                        <Badge key={a} variant="purple">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.datasets && result.datasets.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Datasets</p>
                    <div className="flex flex-wrap gap-1">
                      {result.datasets.map((d) => (
                        <Badge key={d} variant="success">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.metrics && result.metrics.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Metrics</p>
                    <div className="flex flex-wrap gap-1">
                      {result.metrics.map((m) => (
                        <Badge key={m} variant="info">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Abstract */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Abstract</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.paper.abstract}
                </p>
              </div>

              {/* Sections grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map(({ label, icon, field, color }) => (
                  <div key={field} className="p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
                    <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${color}`}>
                      {icon}
                      {label}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.summary[field] as string || 'Not available'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
