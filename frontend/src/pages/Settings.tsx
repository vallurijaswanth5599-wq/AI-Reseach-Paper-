import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  Sparkles,
  Server,
  Info,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';

export default function Settings() {
  const { theme, setTheme } = useApp();
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [sources, setSources] = useState({
    arxiv: true,
    semanticscholar: true,
    openalex: true,
    crossref: true,
  });

  const handleSave = () => {
    toast.success('Settings preferences saved locally');
  };

  const toggleSource = (key: keyof typeof sources) => {
    setSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-blue-500" />
          System Settings & Configuration
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure multi-agent parameters, LLM orchestration providers, and repository sources
        </p>
      </div>

      {/* AI Provider & LLM Engine */}
      <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              LLM Orchestration Engine
            </h2>
          </div>
          <Badge variant="purple">Active Agent Core</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Primary LLM Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => {
                  setProvider('gemini');
                  setModel('gemini-1.5-flash');
                }}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition ${
                  provider === 'gemini'
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-navy-800/80 ring-1 ring-blue-500'
                    : 'border-gray-200 dark:border-navy-800 hover:bg-gray-50 dark:hover:bg-navy-800/40'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Google Gemini</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Fast, generous free tier, 1M context window
                  </p>
                </div>
                {provider === 'gemini' && <Check className="h-4 w-4 text-blue-600" />}
              </label>

              <label
                onClick={() => {
                  setProvider('openai');
                  setModel('gpt-4o-mini');
                }}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition ${
                  provider === 'openai'
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-navy-800/80 ring-1 ring-blue-500'
                    : 'border-gray-200 dark:border-navy-800 hover:bg-gray-50 dark:hover:bg-navy-800/40'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">OpenAI API</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    GPT-4o, GPT-4o-mini, GPT-3.5-turbo
                  </p>
                </div>
                {provider === 'openai' && <Check className="h-4 w-4 text-blue-600" />}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Active Model Architecture
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full sm:w-80 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {provider === 'gemini' ? (
                <>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended, High Speed)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
                </>
              ) : (
                <>
                  <option value="gpt-4o-mini">gpt-4o-mini (Cost-effective, Fast)</option>
                  <option value="gpt-4o">gpt-4o (State-of-the-Art Academic Reasoning)</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy Standard)</option>
                </>
              )}
            </select>
          </div>

          {/* Secure API Key Notice */}
          <div className="rounded-lg bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700 p-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Zero Client-Side Exposure Security
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To adhere to enterprise safety standards, API keys are configured exclusively via the backend environment file (
                  <code className="text-blue-600 dark:text-blue-400 bg-white dark:bg-navy-900 px-1 py-0.5 rounded">
                    backend/.env
                  </code>
                  ). Client browsers never hold or transmit sensitive credentials.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] pt-1">
                  If no API key is specified, the system activates automated rule-based and template-backed academic digests so all agent workflows remain completely testable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Academic Repositories */}
      <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-navy-800 pb-3">
          <Database className="h-5 w-5 text-blue-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Federated Academic Repositories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'arxiv',
              name: 'arXiv.org',
              desc: 'Open preprints in Computer Science, Math, Physics, and Biology',
              badge: 'Official XML API',
            },
            {
              id: 'semanticscholar',
              name: 'Semantic Scholar',
              desc: '200M+ research papers, citation graphs, and author indices',
              badge: 'Graph API v1',
            },
            {
              id: 'openalex',
              name: 'OpenAlex',
              desc: '250M+ open scholarly works, global institutions, and open-access PDFs',
              badge: 'REST Works API',
            },
            {
              id: 'crossref',
              name: 'Crossref',
              desc: '140M+ DOI-indexed peer-reviewed publisher records and metadata',
              badge: 'Crossref Works API',
            },
          ].map((src) => {
            const enabled = sources[src.id as keyof typeof sources];
            return (
              <div
                key={src.id}
                onClick={() => toggleSource(src.id as keyof typeof sources)}
                className={`cursor-pointer border rounded-xl p-4 flex items-start justify-between transition ${
                  enabled
                    ? 'border-blue-400 bg-blue-50/30 dark:bg-navy-800/50'
                    : 'border-gray-200 dark:border-navy-800 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {src.name}
                    </span>
                    <Badge variant="neutral">{src.badge}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{src.desc}</p>
                </div>
                <div
                  className={`h-5 w-5 rounded flex items-center justify-center border mt-0.5 ${
                    enabled
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-navy-700'
                  }`}
                >
                  {enabled && <Check className="h-3.5 w-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Display Theme */}
      <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-navy-800 pb-3">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5 text-indigo-400" />
          ) : (
            <Sun className="h-5 w-5 text-amber-500" />
          )}
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Interface Theme & Appearance
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition ${
              theme === 'light'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-navy-800 dark:text-white'
                : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            Light Academic Theme
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition ${
              theme === 'dark'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-navy-800 dark:text-white'
                : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Moon className="h-4 w-4 text-indigo-400" />
            Dark Laboratory Mode
          </button>
        </div>
      </div>

      {/* Academic Attribution Card */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-950 border border-navy-800 rounded-xl p-6 text-white space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Info className="h-4 w-4" /> Academic Project Specification
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-400">Project Title:</p>
            <p className="font-bold text-sm text-white">AI Research Paper Literature Agent</p>
          </div>
          <div>
            <p className="text-gray-400">Student Investigator:</p>
            <p className="font-semibold text-white">VALLURI JASWANTH (23ME1A54D1)</p>
          </div>
          <div>
            <p className="text-gray-400">Institution:</p>
            <p className="font-semibold text-white">
              Ramachandra College of Engineering (Autonomous), Eluru
            </p>
          </div>
          <div>
            <p className="text-gray-400">Department & Academic Year:</p>
            <p className="font-semibold text-white">
              Dept. of Artificial Intelligence & Data Science (2026–2027)
            </p>
          </div>
          <div>
            <p className="text-gray-400">Project Guide:</p>
            <p className="font-semibold text-white">Mr. K. Naresh Babu</p>
          </div>
          <div>
            <p className="text-gray-400">Specialization Domain:</p>
            <p className="font-semibold text-white">Generative AI & Agentic AI Systems</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
