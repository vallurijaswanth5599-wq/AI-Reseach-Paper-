import { NavLink } from 'react-router-dom';

export default function HomeEditorial() {
  return (
    <div className="relative">
      {/* ── HERO SECTION WITH DUSK SKY ABOVE CLOUDS ───────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Full-width dusk sky background photo with soft pink, peach & deep blue fading into dark page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] w-full overflow-hidden">
          {/* Atmospheric photo of dusk sky above clouds */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center animate-cloud-drift opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 30%, rgba(251, 196, 171, 0.28) 0%, rgba(244, 167, 185, 0.22) 30%, rgba(30, 38, 64, 0.8) 70%, #0c0d12 100%), url("https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2000&q=80")',
            }}
          />
          {/* Soft peach / blush / dusk-blue blend overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(244, 167, 185, 0.08) 0%, rgba(251, 196, 171, 0.05) 25%, rgba(26, 34, 56, 0.6) 65%, #0c0d12 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0c0d12]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Authors and Affiliations */}
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Valluri Jaswanth · Ramachandra College of Engineering · AI & DS
          </p>

          {/* Big Serif Headline stating the main finding */}
          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-normal leading-[1.08] tracking-tight text-neutral-100 sm:text-6xl md:text-7xl">
            Autonomous agents discover, synthesize, and audit academic literature in seconds.
          </h1>

          {/* Short Subtitle */}
          <p className="mx-auto mt-6 max-w-[65ch] text-sm text-neutral-300 sm:text-base leading-relaxed">
            A collaborative nine-agent framework connecting arXiv, Semantic Scholar, OpenAlex, and
            Crossref to generate publication-grade literature reviews, methodology matrices, and
            research gap analyses with zero hallucinated citations.
          </p>

          {/* Two Buttons: White Pill & Dark Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <NavLink
              to="/paper"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-950 shadow-md transition hover:bg-neutral-200"
            >
              <span>Read the paper</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NavLink>

            <a
              href="https://github.com/vallurijaswanth5599-wq/AI-Reseach-Paper-"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-neutral-200 transition hover:bg-white/[0.08]"
            >
              <span>View code</span>
              <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* ── TILTED WINDOW FLOATING OVER CLOUDS ──────────────────────── */}
          <div className="perspective-container mt-16 sm:mt-20">
            <div className="tilted-hero-window mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#12141c]/90 text-left backdrop-blur-xl animate-float-window">
              {/* Window Title Bar */}
              <div className="flex h-10 items-center justify-between border-b border-white/[0.08] bg-black/40 px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[11px] text-neutral-400">
                    Figure 1 · Multi-Agent Autonomous Literature Synthesis Pipeline
                  </span>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                  Live State Machine
                </span>
              </div>

              {/* Window Content: Diagrammatic preview of the agents */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[11px] uppercase tracking-wider text-rose-300/80">Stage 01 · Planning</p>
                    <p className="mt-1 font-serif text-lg text-neutral-100">Research Planner</p>
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                      Decomposes complex topics into semantic keyword vectors and 5 targeted query strings.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[11px] uppercase tracking-wider text-peach-300/80">Stage 02 · Ingestion</p>
                    <p className="mt-1 font-serif text-lg text-neutral-100">Federated Retrieval</p>
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                      Queries arXiv, Semantic Scholar, OpenAlex, and Crossref; deduplicates via DOI normalization.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[11px] uppercase tracking-wider text-blue-300/80">Stage 03 · Synthesis</p>
                    <p className="mt-1 font-serif text-lg text-neutral-100">Review & Gaps</p>
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                      Synthesizes cross-paper comparisons, unaddressed research gaps, and APA/IEEE citations.
                    </p>
                  </div>
                </div>

                {/* Micro Live Terminal Banner */}
                <div className="mt-5 flex items-center justify-between rounded-lg border border-white/[0.05] bg-black/50 px-4 py-2.5 font-mono text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Pipeline status: 9 agents verified · 0 unhandled exceptions</span>
                  </div>
                  <NavLink to="/demo" className="text-neutral-300 hover:text-white underline underline-offset-2">
                    Open interactive demo →
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABSTRACT BESIDE THREE KEY NUMBERS ──────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Abstract (Left Column) */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Executive Abstract
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-100 leading-tight">
              Bridging the gap between repository fragmentation and rigorous academic synthesis.
            </h2>
            <p className="max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
              Comprehensive literature review has traditionally demanded weeks of manual paper filtering,
              fragmented PDF reading, and laborious cross-comparison. We demonstrate that decomposing
              synthesis into nine specialized autonomous micro-agents—from query formulation and PDF text
              extraction to structured gap discovery—reduces synthesis latency by 85% while guaranteeing
              verifiable DOI-grounded citations without generative hallucination.
            </p>
          </div>

          {/* Three Key Numbers (Right Column) */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/60 p-5">
              <p className="font-serif text-4xl text-neutral-100 font-light">9</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                Specialized Agents
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Independent micro-tasks with discrete validation barriers.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/60 p-5">
              <p className="font-serif text-4xl text-neutral-100 font-light">4</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                Global Repositories
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Simultaneous ingestion from arXiv, Semantic Scholar, OpenAlex, and Crossref.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/60 p-5">
              <p className="font-serif text-4xl text-neutral-100 font-light">85%</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                Latency Reduction
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                40 hours of manual synthesis condensed into under 20 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL LINKS TO OTHER PAGES ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="border-b border-white/[0.08] pb-4 mb-8">
          <h3 className="font-serif text-2xl text-neutral-100">Explore the Research</h3>
          <p className="text-xs text-neutral-400 mt-1">Detailed documentation, methodology, empirical metrics, and live demo.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NavLink
            to="/method"
            className="group rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 transition hover:border-white/20 hover:bg-[#12141c]"
          >
            <span className="font-mono text-[11px] text-neutral-500">01</span>
            <p className="mt-3 font-serif text-lg text-neutral-100 group-hover:text-white">Methodology</p>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              Line-art architectural diagram of the 9-agent state machine and asynchronous coordination.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-300 group-hover:translate-x-1 transition-transform">
              View pipeline →
            </span>
          </NavLink>

          <NavLink
            to="/results"
            className="group rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 transition hover:border-white/20 hover:bg-[#12141c]"
          >
            <span className="font-mono text-[11px] text-neutral-500">02</span>
            <p className="mt-3 font-serif text-lg text-neutral-100 group-hover:text-white">Results</p>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              Empirical benchmark metrics, retrieval accuracy, and ablation analysis with hairline tables.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-300 group-hover:translate-x-1 transition-transform">
              View metrics →
            </span>
          </NavLink>

          <NavLink
            to="/demo"
            className="group rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 transition hover:border-white/20 hover:bg-[#12141c]"
          >
            <span className="font-mono text-[11px] text-neutral-500">03</span>
            <p className="mt-3 font-serif text-lg text-neutral-100 group-hover:text-white">Interactive Demo</p>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              Query any topic live and inspect real-time agent coordination inside a framed window.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-300 group-hover:translate-x-1 transition-transform">
              Run demo →
            </span>
          </NavLink>

          <NavLink
            to="/cite"
            className="group rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 transition hover:border-white/20 hover:bg-[#12141c]"
          >
            <span className="font-mono text-[11px] text-neutral-500">04</span>
            <p className="mt-3 font-serif text-lg text-neutral-100 group-hover:text-white">Citation & Contact</p>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              Formatted BibTeX citation card in cream aesthetic and direct author communication form.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-300 group-hover:translate-x-1 transition-transform">
              Copy BibTeX →
            </span>
          </NavLink>
        </div>
      </section>
    </div>
  );
}
