import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  FolderOpen,
  Search,
  ArrowRight,
  Brain,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { getStats, getProjects } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import type { Stats, Project } from '../types';

// Mock chart data
const generateChartData = () =>
  [...Array(7)].map((_, i) => ({
    day: format(subDays(new Date(), 6 - i), 'EEE'),
    papers: Math.floor(Math.random() * 20) + 2,
    reviews: Math.floor(Math.random() * 5),
  }));

const quickActions = [
  { label: 'New Research', icon: Search, to: '/research', color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'Run Agents', icon: Brain, to: '/agents', color: 'bg-purple-600 hover:bg-purple-500' },
  { label: 'Analyze Papers', icon: FileText, to: '/analysis', color: 'bg-emerald-600 hover:bg-emerald-500' },
  { label: 'Generate Review', icon: BookOpen, to: '/review', color: 'bg-orange-600 hover:bg-orange-500' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartData] = useState(generateChartData());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p] = await Promise.all([getStats(), getProjects()]);
        setStats(s);
        setProjects(p.slice(0, 4));
      } catch {
        // Backend offline — use defaults
        setStats({ total_papers: 0, total_reviews: 0, total_projects: 0, recent_searches: 0 });
        setProjects([]);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back 👋</h2>
            <p className="text-blue-100 text-sm">
              Your AI research assistant is ready. What are you researching today?
            </p>
          </div>
          <div className="hidden sm:block text-5xl opacity-30">🔬</div>
        </div>
        <button
          onClick={() => navigate('/research')}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Search className="h-4 w-4" />
          Start Researching
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Papers"
          value={stats?.total_papers ?? 0}
          icon={FileText}
          color="blue"
          loading={loadingStats}
          change="Papers analyzed"
        />
        <StatCard
          title="Reviews Generated"
          value={stats?.total_reviews ?? 0}
          icon={BookOpen}
          color="purple"
          loading={loadingStats}
          change="Literature reviews"
        />
        <StatCard
          title="Active Projects"
          value={stats?.total_projects ?? 0}
          icon={FolderOpen}
          color="green"
          loading={loadingStats}
          change="Research projects"
        />
        <StatCard
          title="Recent Searches"
          value={Array.isArray(stats?.recent_searches) ? (stats?.recent_searches as any).length : (stats?.recent_searches ?? 0)}
          icon={Search}
          color="orange"
          loading={loadingStats}
          change="Last 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Research Activity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Papers & reviews over the past week</p>
            </div>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" opacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  border: '1px solid #1e3a6e',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="papers" name="Papers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" name="Reviews" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map(({ label, icon: Icon, to, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className={`w-full flex items-center gap-3 px-4 py-3 ${color} text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <ArrowRight className="h-4 w-4 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects & Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Projects</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-blue-500 hover:underline"
            >
              View all
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet</p>
              <button
                onClick={() => navigate('/projects')}
                className="mt-2 text-xs text-blue-500 hover:underline"
              >
                Create your first project
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 cursor-pointer transition-colors"
                  onClick={() => navigate('/projects')}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Activity */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Agent Activity</h3>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {[
              { agent: '🧠 Research Planner', msg: 'Ready to plan your research strategy', time: 'Now', status: 'idle' },
              { agent: '📚 Paper Retrieval', msg: 'Connected to 4 academic databases', time: '2m ago', status: 'ready' },
              { agent: '📝 Summarization', msg: 'Gemini AI model loaded and ready', time: '5m ago', status: 'ready' },
            ].map((item) => (
              <div key={item.agent} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-800">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.agent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.msg}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/agents')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Brain className="h-4 w-4" />
            Run Agent Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
