export default function TeamEditorial() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Authors & Contributors
        </p>
        <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-neutral-100 leading-[1.12]">
          Research Team & Academic Acknowledgements
        </h1>
      </div>

      {/* ── NOTE FROM THE AUTHORS IN LARGE SERIF TEXT ───────────────────── */}
      <section className="py-12 border-b border-white/[0.08]">
        <blockquote className="font-serif text-2xl sm:text-3xl text-neutral-200 font-normal leading-snug italic max-w-[65ch]">
          “We built this platform to liberate scholars and students from the repetitive labor of
          manual paper parsing. By automating retrieval, extraction, and comparative synthesis with
          strict grounding, we aim to accelerate the pace at which researchers identify and solve
          open scientific challenges.”
        </blockquote>
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-neutral-400">
          — Valluri Jaswanth · Lead Author & Developer
        </p>
      </section>

      {/* ── TEAM PORTRAITS & AFFILIATIONS ───────────────────────────────── */}
      <section className="py-12 space-y-8">
        <h2 className="font-serif text-2xl text-neutral-100">Project Contributors</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Author Card: Valluri Jaswanth */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 font-serif text-xl font-light text-white">
              VJ
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-neutral-100">Valluri Jaswanth</h3>
              <p className="text-xs font-medium text-rose-300/90 font-mono">
                Lead Researcher & System Architect
              </p>
              <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
                Roll No: 23ME1A54D1 · Section B · Allocation 88
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                B.Tech in Artificial Intelligence & Data Science, Ramachandra College of Engineering (RCEE), Eluru.
              </p>
              <div className="pt-2 flex gap-3 text-xs text-neutral-400">
                <a
                  href="mailto:vallurijaswanth5599@gmail.com"
                  className="hover:text-white underline underline-offset-2"
                >
                  Email
                </a>
                <a
                  href="https://github.com/vallurijaswanth5599-wq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-2"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Academic Department & Guide */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6 flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 font-serif text-xl font-light text-white">
              AI
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-neutral-100">Faculty Review Board</h3>
              <p className="text-xs font-medium text-neutral-300 font-mono">
                Department of AI & DS
              </p>
              <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
                Project Evaluation & Curriculum Review Committee.
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ramachandra College of Engineering, Vatluru (V), Eluru, Andhra Pradesh — 534007.
              </p>
              <p className="pt-2 text-[11px] text-neutral-500 font-mono">
                Academic Session 2026 · Autonomous Institution
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
