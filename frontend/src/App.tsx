import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { EditorialLayout } from './components/layout/EditorialLayout';

// Editorial Pages
import HomeEditorial from './pages/HomeEditorial';
import PaperEditorial from './pages/PaperEditorial';
import MethodEditorial from './pages/MethodEditorial';
import ResultsEditorial from './pages/ResultsEditorial';
import DemoEditorial from './pages/DemoEditorial';
import TeamEditorial from './pages/TeamEditorial';
import CiteContactEditorial from './pages/CiteContactEditorial';

// Functional Research Workspace Pages
import Dashboard from './pages/Dashboard';
import ResearchWorkspace from './pages/ResearchWorkspace';
import MultiAgentCenter from './pages/MultiAgentCenter';
import PaperAnalysis from './pages/PaperAnalysis';
import PaperComparison from './pages/PaperComparison';
import Chatbot from './pages/Chatbot';
import LiteratureReview from './pages/LiteratureReview';
import SavedProjects from './pages/SavedProjects';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#12141c',
              color: '#F8FAFC',
              fontSize: '12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            },
          }}
        />
        <Routes>
          {/* Universal Dark Editorial Shell */}
          <Route element={<EditorialLayout />}>
            {/* Core Editorial Manuscript Pages */}
            <Route path="/" element={<HomeEditorial />} />
            <Route path="/paper" element={<PaperEditorial />} />
            <Route path="/method" element={<MethodEditorial />} />
            <Route path="/results" element={<ResultsEditorial />} />
            <Route path="/demo" element={<DemoEditorial />} />
            <Route path="/team" element={<TeamEditorial />} />
            <Route path="/cite" element={<CiteContactEditorial />} />

            {/* Functional Research Workspace & Console */}
            <Route path="/dashboard" element={<div className="max-w-6xl mx-auto px-4 py-8"><Dashboard /></div>} />
            <Route path="/research" element={<div className="max-w-6xl mx-auto px-4 py-8"><ResearchWorkspace /></div>} />
            <Route path="/agents" element={<div className="max-w-6xl mx-auto px-4 py-8"><MultiAgentCenter /></div>} />
            <Route path="/analysis" element={<div className="max-w-6xl mx-auto px-4 py-8"><PaperAnalysis /></div>} />
            <Route path="/compare" element={<div className="max-w-6xl mx-auto px-4 py-8"><PaperComparison /></div>} />
            <Route path="/chat" element={<div className="max-w-6xl mx-auto px-4 py-8"><Chatbot /></div>} />
            <Route path="/review" element={<div className="max-w-6xl mx-auto px-4 py-8"><LiteratureReview /></div>} />
            <Route path="/projects" element={<div className="max-w-6xl mx-auto px-4 py-8"><SavedProjects /></div>} />
            <Route path="/settings" element={<div className="max-w-6xl mx-auto px-4 py-8"><Settings /></div>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
