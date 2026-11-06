import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/paper', label: 'Paper' },
  { to: '/method', label: 'Method' },
  { to: '/results', label: 'Results' },
  { to: '/demo', label: 'Demo' },
  { to: '/team', label: 'Team' },
  { to: '/cite', label: 'Cite & Contact' },
];

export function EditorialHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0c0d12]/85 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Site name / Logo */}
          <NavLink
            to="/"
            className="group flex items-center gap-2.5 text-sm font-medium tracking-tight text-neutral-200 transition-colors hover:text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5 font-serif text-[11px] text-white">
              A
            </span>
            <span className="font-serif tracking-normal text-base text-neutral-100">
              AI Literature Agent
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`relative px-3 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-[15px] h-[1px] bg-white/70" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action: White Pill Button */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/paper"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-950 shadow-sm transition hover:bg-neutral-200"
            >
              <span>Read the paper</span>
              <svg
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NavLink>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0c0d12]/95 backdrop-blur-xl md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4">
            <span className="font-serif text-base text-neutral-100">AI Literature Agent</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-6">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {label}
                </NavLink>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/10">
              <NavLink
                to="/paper"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-medium text-neutral-950"
              >
                <span>Read the paper</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
