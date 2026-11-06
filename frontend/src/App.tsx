import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
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
              background: '#0F172A',
              color: '#F8FAFC',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #1E293B',
            },
          }}
        />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* SaaS App Shell */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<ResearchWorkspace />} />
            <Route path="/agents" element={<MultiAgentCenter />} />
            <Route path="/analysis" element={<PaperAnalysis />} />
            <Route path="/compare" element={<PaperComparison />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/review" element={<LiteratureReview />} />
            <Route path="/projects" element={<SavedProjects />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
