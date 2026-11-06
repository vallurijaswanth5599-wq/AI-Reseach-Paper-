import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Cpu,
  FileText,
  GitCompare,
  MessageSquare,
  BookOpen,
  FolderOpen,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Moon,
  Sun,
  CheckSquare,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/research', icon: Search, label: 'Research' },
  { to: '/agents', icon: Cpu, label: 'Multi-Agent' },
  { to: '/analysis', icon: FileText, label: 'Paper Analysis' },
  { to: '/compare', icon: GitCompare, label: 'Compare Papers' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chatbot' },
  { to: '/review', icon: BookOpen, label: 'Literature Review' },
  { to: '/projects', icon: FolderOpen, label: 'Saved Projects' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, setTheme, selectedPapers } = useApp();
  const location = useLocation();

  const currentPage = navItems.find((n) => n.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-navy-950 overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col bg-navy-900 border-r border-navy-800 transition-all duration-300 z-30',
          'fixed lg:relative h-full',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-navy-800">
          <div className="flex-shrink-0 p-2 bg-blue-600 rounded-xl">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-tight">AI Research</p>
              <p className="text-navy-500 text-xs">Literature Agent</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-navy-500 hover:text-white transition-colors hidden lg:block"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-navy-500 hover:bg-navy-800 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Selected papers indicator */}
        {selectedPapers.length > 0 && sidebarOpen && (
          <div className="mx-3 mb-3 p-3 bg-blue-900/30 border border-blue-800 rounded-xl">
            <div className="flex items-center gap-2 text-blue-300">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{selectedPapers.length} papers selected</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 shadow-sm">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{currentPage}</h1>
          </div>

          {selectedPapers.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
              <CheckSquare className="h-3.5 w-3.5" />
              {selectedPapers.length} selected
            </div>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
