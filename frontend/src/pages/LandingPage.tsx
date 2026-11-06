import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Brain,
  BookOpen,
  GitCompare,
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronRight,
  FlaskConical,
  Users,
  Star,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent AI Pipeline',
    description:
      'Nine specialized AI agents collaborate to research, extract, summarize, compare, and review academic papers automatically.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Search,
    title: 'Multi-Source Search',
    description:
      'Search across arXiv, Semantic Scholar, OpenAlex, and Crossref simultaneously for comprehensive coverage.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: GitCompare,
    title: 'Intelligent Comparison',
    description:
      'Side-by-side comparison tables across objectives, methodology, datasets, results, and limitations.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BookOpen,
    title: 'Literature Reviews',
    description:
      'Auto-generate complete literature reviews with IEEE or APA citations, exportable as DOCX or PDF.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: MessageSquare,
    title: 'AI Research Chatbot',
    description:
      'Ask natural language questions about your selected papers. Get answers with source citations.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Zap,
    title: 'Research Gap Analysis',
    description:
      'Automatically identify research gaps and future directions from your paper collection.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
];

const steps = [
  { num: '01', title: 'Search Papers', desc: 'Enter your research topic and search across multiple academic databases simultaneously.' },
  { num: '02', title: 'Select & Analyze', desc: 'Select relevant papers and run AI agents to extract key insights, summaries, and methodologies.' },
  { num: '03', title: 'Compare & Chat', desc: 'Compare papers side-by-side and ask your AI chatbot questions about the research.' },
  { num: '04', title: 'Generate Review', desc: 'Auto-generate a comprehensive literature review with proper citations, ready to export.' },
];

const agents = [
  { name: 'Research Planner', icon: '🧠', desc: 'Plans research strategy' },
  { name: 'Paper Retrieval', icon: '📚', desc: 'Fetches from databases' },
  { name: 'Paper Extraction', icon: '📄', desc: 'Extracts content' },
  { name: 'Summarization', icon: '📝', desc: 'Generates summaries' },
  { name: 'Comparison', icon: '🔬', desc: 'Compares papers' },
  { name: 'Gap Analysis', icon: '🔍', desc: 'Finds research gaps' },
  { name: 'Q&A Agent', icon: '❓', desc: 'Answers questions' },
  { name: 'Review Writer', icon: '📖', desc: 'Writes literature review' },
  { name: 'Coordinator', icon: '🤖', desc: 'Orchestrates agents' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchTopic, setSearchTopic] = useState('');

  const handleStartResearch = () => {
    navigate('/research', { state: { topic: searchTopic } });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">ResearchLit AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/research')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-navy-950 via-navy-900/50 to-navy-950" />
        </div>

        {/* Animated floating dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Powered by Multi-Agent AI Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
              Research Literature
            </span>
            <br />
            Assistant
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Harness nine specialized AI agents to search, analyze, compare, and synthesize academic
            papers into comprehensive literature reviews — in minutes, not weeks.
          </p>

          {/* Search input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
                placeholder="e.g., Transformer attention mechanisms in NLP"
                className="w-full pl-11 pr-4 py-4 bg-navy-800/80 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm backdrop-blur-sm"
              />
            </div>
            <button
              onClick={handleStartResearch}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/30 whitespace-nowrap"
            >
              Start Research
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> arXiv</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Semantic Scholar</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> OpenAlex</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Crossref</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-gray-500 rotate-90" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for Academic Research
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A complete AI-powered research platform that handles every step of your literature review process.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-navy-900 border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-all hover:shadow-lg hover:shadow-black/20"
              >
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Multi-Agent Architecture
            </h2>
            <p className="text-gray-400">
              Nine specialized AI agents work together in an intelligent pipeline
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {agents.map((agent, i) => (
              <div key={agent.name} className="flex flex-col items-center gap-2 relative">
                <div className="w-full flex flex-col items-center p-3 bg-navy-900 border border-navy-700 rounded-xl hover:border-blue-600/50 transition-colors text-center">
                  <span className="text-2xl mb-1">{agent.icon}</span>
                  <p className="text-xs font-medium text-white leading-tight">{agent.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{agent.desc}</p>
                </div>
                {i < agents.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-500 z-10" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/agents')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Brain className="h-5 w-5" />
              Run Agent Workflow
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-navy-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">From topic to literature review in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
                  <div className="text-4xl font-black text-navy-700 mb-4">{step.num}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for Academic Excellence
          </h2>
          <p className="text-gray-400 mb-12">
            Designed for researchers, graduate students, and academics who need comprehensive, accurate literature reviews.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📄', val: '10K+', label: 'Papers Analyzed' },
              { icon: '⚡', val: '5 min', label: 'Avg Review Time' },
              { icon: '🎯', val: '4', label: 'Academic Sources' },
              { icon: '🤖', val: '9', label: 'AI Agents' },
            ].map((s) => (
              <div key={s.label} className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{s.val}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-t border-navy-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Your Research Journey
          </h2>
          <p className="text-gray-400 mb-8">
            Access our multi-agent AI research platform and transform how you conduct academic literature reviews.
          </p>
          <button
            onClick={() => navigate('/research')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-blue-600/30"
          >
            <Search className="h-5 w-5" />
            Begin Research
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-navy-800 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">ResearchLit AI</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-400" />
                <p className="text-white font-semibold">VALLURI JASWANTH</p>
              </div>
              <p className="text-gray-400 text-sm">Roll No: 23ME1A54D1</p>
              <p className="text-gray-500 text-xs mt-1">
                Ramachandra College of Engineering · Dept. of AI & Data Science
              </p>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="text-gray-400 text-sm ml-2">Academic Project</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
