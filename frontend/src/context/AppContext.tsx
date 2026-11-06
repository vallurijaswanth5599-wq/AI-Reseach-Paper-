import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Paper, Project } from '../types';

interface AppContextType {
  selectedPapers: Paper[];
  currentProject: Project | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentProject: (project: Project | null) => void;
  togglePaperSelection: (paper: Paper) => void;
  clearSelectedPapers: () => void;
  isPaperSelected: (paperId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
  }, []);

  const togglePaperSelection = useCallback((paper: Paper) => {
    setSelectedPapers((prev) => {
      const exists = prev.find((p) => p.id === paper.id);
      if (exists) {
        return prev.filter((p) => p.id !== paper.id);
      }
      return [...prev, paper];
    });
  }, []);

  const clearSelectedPapers = useCallback(() => {
    setSelectedPapers([]);
  }, []);

  const isPaperSelected = useCallback(
    (paperId: string) => selectedPapers.some((p) => p.id === paperId),
    [selectedPapers]
  );

  return (
    <AppContext.Provider
      value={{
        selectedPapers,
        currentProject,
        theme,
        setTheme,
        setCurrentProject,
        togglePaperSelection,
        clearSelectedPapers,
        isPaperSelected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
