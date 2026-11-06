import { NavLink } from 'react-router-dom';

export function EditorialFooter() {
  return (
    <footer className="mt-28 border-t border-white/[0.08] bg-[#0c0d12] py-14 text-xs text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Col 1: Overview */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-serif text-base text-neutral-200">
              Autonomous Collaborative Agents for Academic Literature Synthesis
            </p>
            <p className="max-w-[50ch] text-neutral-400 leading-relaxed">
              A multi-agent framework orchestrating paper retrieval, structured content extraction,
              cross-paper comparison, and formal literature review generation across global repositories.
            </p>
            <p className="text-[11px] text-neutral-500">
              Department of Artificial Intelligence & Data Science · Ramachandra College of Engineering
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
              Manuscript
            </p>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <NavLink to="/paper" className="transition hover:text-white">
                  Full Paper & Abstract
                </NavLink>
              </li>
              <li>
                <NavLink to="/method" className="transition hover:text-white">
                  Methodology & Pipeline
                </NavLink>
              </li>
              <li>
                <NavLink to="/results" className="transition hover:text-white">
                  Empirical Results
                </NavLink>
              </li>
              <li>
                <NavLink to="/demo" className="transition hover:text-white">
                  Interactive Demo
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Artifacts & Contact */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
              Artifacts & Code
            </p>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <a
                  href="https://github.com/vallurijaswanth5599-wq/AI-Reseach-Paper-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <NavLink to="/cite" className="transition hover:text-white">
                  BibTeX Citation
                </NavLink>
              </li>
              <li>
                <a
                  href="https://openalex.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  OpenAlex & arXiv Index
                </a>
              </li>
              <li>
                <a
                  href="mailto:vallurijaswanth5599@gmail.com"
                  className="transition hover:text-white"
                >
                  vallurijaswanth5599@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/[0.06] pt-6 sm:flex-row text-neutral-500 text-[11px]">
          <p>© 2026 Valluri Jaswanth. Released for open academic research.</p>
          <div className="mt-2 flex gap-4 sm:mt-0">
            <NavLink to="/cite" className="hover:text-neutral-300">Citation</NavLink>
            <a href="https://github.com/vallurijaswanth5599-wq/AI-Reseach-Paper-" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">Source</a>
            <NavLink to="/demo" className="hover:text-neutral-300">Demo</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
