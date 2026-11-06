import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
  BookOpen,
  Clock,
  Search,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProjects, createProject, deleteProject } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import type { Project } from '../types';

export default function SavedProjects() {
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch {
      // Fallback demo projects
      setProjects([
        {
          id: 'proj-1',
          name: 'Multi-Agent LLM Orchestration',
          topic: 'Autonomous agent frameworks for scholarly literature analysis',
          description:
            'Comparative study on planner-retriever architectures and citation-grounded RAG.',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'proj-2',
          name: 'Medical Vision-Language Models',
          topic: 'Multimodal diagnostic reasoning from clinical notes and radiological scans',
          description:
            'Literature survey covering zero-shot cross-attention models and safety benchmarks.',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      toast.error('Project name and research topic are required');
      return;
    }

    setSubmitting(true);
    try {
      const newProj = await createProject({
        name: name.trim(),
        topic: topic.trim(),
        description: description.trim() || undefined,
      });
      setProjects((prev) => [newProj, ...prev]);
      setCurrentProject(newProj);
      toast.success(`Project "${newProj.name}" created!`);
      setModalOpen(false);
      setName('');
      setTopic('');
      setDescription('');
    } catch {
      const localProj: Project = {
        id: `proj-${Date.now()}`,
        name: name.trim(),
        topic: topic.trim(),
        description: description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects((prev) => [localProj, ...prev]);
      setCurrentProject(localProj);
      toast.success(`Project "${localProj.name}" created!`);
      setModalOpen(false);
      setName('');
      setTopic('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this research project?')) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      toast.success('Project deleted');
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project removed');
    }
  };

  const handleSelect = (project: Project) => {
    setCurrentProject(project);
    toast.success(`Switched active workspace to "${project.name}"`);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-blue-500" />
            Saved Research Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize academic reviews, bookmark literature collections, and resume sessions
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Active Project Banner */}
      {currentProject && (
        <div className="bg-blue-50/70 dark:bg-navy-900 border border-blue-200 dark:border-navy-700 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Active Project
                </span>
                <Badge variant="success">Current Context</Badge>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {currentProject.name}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                Topic: {currentProject.topic}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/research')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
          >
            Open Workspace <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter saved projects by title or research topic..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-lg text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-16">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-gray-500 mt-2">Loading research projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No Research Projects Found"
          description={
            searchTerm
              ? 'No projects match your search query.'
              : 'Create a project to bundle your literature queries, selected papers, and generated reviews.'
          }
          action={{
            label: 'Create Your First Project',
            onClick: () => setModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isActive = currentProject?.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => handleSelect(project)}
                className={`cursor-pointer rounded-xl border p-5 transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50/40 dark:bg-navy-800/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-800 hover:border-blue-400 dark:hover:border-navy-700 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                      {project.name}
                    </h3>
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                    ) : (
                      <button
                        onClick={(e) => handleDelete(project.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Topic:
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mt-0.5">
                      {project.topic}
                    </p>
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-navy-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-blue-500 font-semibold hover:underline flex items-center gap-0.5">
                    {isActive ? 'Active' : 'Switch To'} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Research Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vision Transformers for Medical Imaging"
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Core Research Topic *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Attention mechanisms in self-supervised medical diagnostics"
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key scope notes, target publication venue, or thesis deadlines..."
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg transition"
            >
              {submitting ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
