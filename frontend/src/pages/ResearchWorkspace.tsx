import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, BookmarkPlus, ChevronDown, ChevronUp, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchPapers, savePaper, getProjects } from '../services/api';
import { PaperCard } from '../components/ui/PaperCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../context/AppContext';
import type { Paper, Project, SearchRequest } from '../types';

const SOURCES = ['arxiv', 'openalex', 'crossref', 'semantic_scholar', 'tavily'];
const YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i);

export default function ResearchWorkspace() {
  const location = useLocation();
  const { currentProject } = useApp();
  const state = location.state as { topic?: string } | null;

  const [topic, setTopic] = useState(state?.topic ?? '');
  const [keywords, setKeywords] = useState('');
  const [yearFrom, setYearFrom] = useState(2018);
  const [yearTo, setYearTo] = useState(2024);
  const [sources, setSources] = useState<string[]>(['arxiv', 'openalex', 'crossref', 'semantic_scholar']);
  const [maxResults, setMaxResults] = useState(25);
  const [showFilters, setShowFilters] = useState(false);

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
  }, []);

  const toggleSource = (src: string) => {
    setSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  const handleSearch = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a research topic');
      return;
    }
    setLoading(true);
    setSearched(true);
    setPapers([]);
    setVisibleCount(6);
    try {
      const req: SearchRequest = {
        topic: topic.trim(),
        keywords: keywords.trim() || undefined,
        year_from: yearFrom,
        year_to: yearTo,
        sources,
        max_results: maxResults,
      };
      const results = await searchPapers(req);
      setPapers(results);
      toast.success(`Found ${results.length} papers`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed';
      toast.error(msg);
      // Show demo papers when backend offline
      setPapers(getDemoPapers(topic));
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaper = async (paper: Paper) => {
    if (!currentProject) {
      toast.error('Please select a project first');
      return;
    }
    try {
      await savePaper({ paper_id: paper.id, project_id: currentProject.id });
      toast.success('Paper saved to project');
    } catch (err) {
      toast.error('Failed to save paper');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Research Topic Search</h2>

        <div className="space-y-4">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Research Topic <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Deep learning for medical image segmentation"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-100 dark:border-navy-800">
              {/* Keywords */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="neural network, attention, transformer"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Year From */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Year From
                </label>
                <select
                  value={yearFrom}
                  onChange={(e) => setYearFrom(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Year To */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Year To
                </label>
                <select
                  value={yearTo}
                  onChange={(e) => setYearTo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Sources */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Sources
                </label>
                <div className="flex flex-wrap gap-2">
                  {SOURCES.map((src) => (
                    <button
                      key={src}
                      onClick={() => toggleSource(src)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        sources.includes(src)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 dark:bg-navy-800 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                      }`}
                    >
                      {src.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Results */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Max Results: <span className="text-blue-500 font-bold">{maxResults}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-semibold transition-colors"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? 'Searching...' : 'Search Papers'}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Searching academic databases..." />
        </div>
      )}

      {!loading && searched && (
        <>
          {papers.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found <span className="font-bold text-gray-900 dark:text-white">{papers.length}</span> papers
                </p>
                <p className="text-xs text-gray-500">Select papers to analyze or compare</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {papers.slice(0, visibleCount).map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    onSave={handleSavePaper}
                    showSelect={true}
                  />
                ))}
              </div>

              {visibleCount < papers.length && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setVisibleCount((v) => v + 6)}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
                  >
                    Load More ({papers.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No papers found"
              description="Try adjusting your search terms or filters"
            />
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Ready to Research
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Enter a research topic above and search across multiple academic databases including arXiv,
            Semantic Scholar, OpenAlex, and Crossref.
          </p>
        </div>
      )}
    </div>
  );
}

function getDemoPapers(topic: string): Paper[] {
  return [
    {
      id: 'demo-1',
      title: `Advances in ${topic}: A Comprehensive Survey`,
      authors: ['Alice Johnson', 'Bob Smith', 'Carol White'],
      abstract: `This comprehensive survey explores recent advances in ${topic}. We review the state-of-the-art methods, benchmark datasets, and evaluation protocols. Our analysis identifies key trends and challenges in the field.`,
      year: 2024,
      source: 'arXiv',
      citations: 45,
      keywords: [topic.split(' ')[0], 'deep learning', 'survey'],
      url: 'https://arxiv.org',
      pdf_url: 'https://arxiv.org',
    },
    {
      id: 'demo-2',
      title: `A Transformer-Based Approach to ${topic}`,
      authors: ['David Lee', 'Emma Brown'],
      abstract: `We propose a novel transformer-based architecture for ${topic} that achieves state-of-the-art performance on multiple benchmarks. Our method leverages self-attention mechanisms to capture long-range dependencies.`,
      year: 2023,
      source: 'Semantic Scholar',
      citations: 128,
      keywords: ['transformer', 'attention', topic.split(' ')[0]],
      url: 'https://semanticscholar.org',
    },
    {
      id: 'demo-3',
      title: `Benchmarking ${topic}: Current Methods and Future Directions`,
      authors: ['Frank Wilson', 'Grace Davis', 'Henry Martinez'],
      abstract: `We present a systematic benchmarking study of existing approaches to ${topic}. Through rigorous experimentation, we identify key performance bottlenecks and propose directions for future research.`,
      year: 2023,
      source: 'OpenAlex',
      citations: 67,
      keywords: ['benchmark', 'evaluation', topic.split(' ')[0]],
    },
  ];
}
