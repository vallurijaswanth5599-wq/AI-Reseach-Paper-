export default function MethodEditorial() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Architecture & Methodology
        </p>
        <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-neutral-100 leading-[1.12]">
          Decomposed Multi-Agent State Machine Architecture
        </h1>
        <p className="mt-4 max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
          Instead of passing extensive paper contexts into a single generative prompt, our framework
          decomposes literature review synthesis into discrete, verifiable agent operations executed
          across an asynchronous event-driven state machine.
        </p>
      </div>

      {/* ── THIN LINE-ART DIAGRAM ────────────────────────────────────────── */}
      <section className="py-12 border-b border-white/[0.08]">
        <h2 className="font-serif text-2xl text-neutral-100 mb-2">Pipeline Architecture</h2>
        <p className="text-xs text-neutral-400 mb-6">
          Figure 2 · Thin line-art schematic of agent orchestration, federated data flow, and synthesis barriers.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#12141c]/60 p-6 sm:p-8">
          <svg
            className="w-full min-w-[700px] h-[340px]"
            viewBox="0 0 800 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* STAGE 1: INGESTION */}
            <g transform="translate(30, 40)">
              <rect x="0" y="0" width="180" height="240" rx="12" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.01)" strokeDasharray="3 3" />
              <text x="15" y="24" fill="#a3a3a3" fontSize="10" fontFamily="sans-serif" letterSpacing="1">STAGE 1 · INGESTION</text>

              {/* Research Planner Node */}
              <rect x="15" y="45" width="150" height="60" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="70" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Research Planner</text>
              <text x="25" y="88" fill="#737373" fontSize="9" fontFamily="monospace">Query vectors (5+)</text>

              {/* Federated Retrieval Node */}
              <rect x="15" y="140" width="150" height="70" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="165" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Paper Retrieval</text>
              <text x="25" y="183" fill="#737373" fontSize="9" fontFamily="monospace">arXiv · OpenAlex</text>
              <text x="25" y="197" fill="#737373" fontSize="9" fontFamily="monospace">Semantic Scholar · Crossref</text>

              {/* Internal connector line */}
              <path d="M 90 105 L 90 140" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <circle cx="90" cy="140" r="2.5" fill="#ffffff" />
            </g>

            {/* Arrow 1 to 2 */}
            <path d="M 210 160 L 290 160" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <polygon points="290,160 282,156 282,164" fill="rgba(255,255,255,0.6)" />
            <text x="220" y="150" fill="#737373" fontSize="8" fontFamily="monospace">Deduplicated Corpus</text>

            {/* STAGE 2: EXTRACTION & PARALLEL ANALYSIS */}
            <g transform="translate(290, 40)">
              <rect x="0" y="0" width="220" height="240" rx="12" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.01)" strokeDasharray="3 3" />
              <text x="15" y="24" fill="#a3a3a3" fontSize="10" fontFamily="sans-serif" letterSpacing="1">STAGE 2 · EXTRACTION</text>

              {/* Paper Extraction Node */}
              <rect x="15" y="45" width="190" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="68" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Extraction Agent</text>
              <text x="25" y="84" fill="#737373" fontSize="9" fontFamily="monospace">PyMuPDF PDF parsing</text>

              {/* Summarization Node */}
              <rect x="15" y="115" width="190" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="138" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Summarization Agent</text>
              <text x="25" y="154" fill="#737373" fontSize="9" fontFamily="monospace">6-point structured digest</text>

              {/* Comparison Node */}
              <rect x="15" y="180" width="190" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="203" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Comparison Agent</text>
              <text x="25" y="219" fill="#737373" fontSize="9" fontFamily="monospace">Cross-paper matrix</text>

              {/* Connectors */}
              <path d="M 110 95 L 110 115" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M 110 165 L 110 180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </g>

            {/* Arrow 2 to 3 */}
            <path d="M 510 160 L 580 160" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <polygon points="580,160 572,156 572,164" fill="rgba(255,255,255,0.6)" />
            <text x="520" y="150" fill="#737373" fontSize="8" fontFamily="monospace">Matrices</text>

            {/* STAGE 3: SYNTHESIS & AUDIT */}
            <g transform="translate(580, 40)">
              <rect x="0" y="0" width="190" height="240" rx="12" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.01)" strokeDasharray="3 3" />
              <text x="15" y="24" fill="#a3a3a3" fontSize="10" fontFamily="sans-serif" letterSpacing="1">STAGE 3 · SYNTHESIS</text>

              {/* Gap Analysis Node */}
              <rect x="15" y="45" width="160" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="68" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Gap Analysis Agent</text>
              <text x="25" y="84" fill="#737373" fontSize="9" fontFamily="monospace">Research frontier gaps</text>

              {/* Literature Review Node */}
              <rect x="15" y="115" width="160" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="138" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Review Writer</text>
              <text x="25" y="154" fill="#737373" fontSize="9" fontFamily="monospace">APA / IEEE synthesis</text>

              {/* QA Agent Node */}
              <rect x="15" y="180" width="160" height="50" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="#161824" />
              <text x="25" y="203" fill="#f5f5f5" fontSize="12" fontFamily="Newsreader, serif">Grounded Q&A (RAG)</text>
              <text x="25" y="219" fill="#737373" fontSize="9" fontFamily="monospace">Snippets & DOIs</text>

              {/* Connectors */}
              <path d="M 95 95 L 95 115" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M 95 165 L 95 180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </section>

      {/* ── MATHEMATICAL FORMULATION (MONOSPACE) ─────────────────────────── */}
      <section className="py-12 border-b border-white/[0.08] space-y-4">
        <h2 className="font-serif text-2xl text-neutral-100">State Transition Formulation</h2>
        <p className="max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
          Let the user request be parameterized as a query tuple Q = (t, q_r, S, k), where t represents the
          research topic, q_r the explicit research question, S ⊆ {'{arXiv, SemanticScholar, OpenAlex, Crossref}'}
          the selected repository set, and k the target publication limit.
        </p>

        {/* Monospace Equation Block */}
        <div className="rounded-xl border border-white/[0.08] bg-[#12141c] p-5 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
          <p className="text-neutral-500">// 1. Keyword Expansion & Query Formulation</p>
          <p>K_t = PlannerAgent(t, q_r) = &#123; w_1, w_2, ..., w_m &#125; ∪ Decomp(t)</p>
          <p className="mt-3 text-neutral-500">// 2. Federated Retrieval with Title & DOI Deduplication</p>
          <p>P_raw = ⋃_(s ∈ S) Ingest(s, K_t, k)</p>
          <p>P_dedup = &#123; p ∈ P_raw | ∀ p&#39; ∈ P_dedup, Sim(p.title, p&#39;.title) &lt; θ_sim ∧ p.doi ≠ p&#39;.doi &#125;</p>
          <p className="mt-3 text-neutral-500">// 3. Structured 6-Point Digest Extraction</p>
          <p>D_p = (Obj_p, Meth_p, Data_p, Find_p, Limit_p, Future_p) = Summarizer(p.extracted_text)</p>
          <p className="mt-3 text-neutral-500">// 4. Synthesis & Research Gap Extraction</p>
          <p>G_t = GapAnalysis(P_dedup, D) = &#123; g_j = (desc_j, evidence_j, directions_j) &#125;</p>
        </div>
      </section>

      {/* ── CODE SPECIFICATION (MONOSPACE) ──────────────────────────────── */}
      <section className="py-12 space-y-4">
        <h2 className="font-serif text-2xl text-neutral-100">Coordinator Implementation</h2>
        <p className="max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
          The agent coordinator maintains atomic transaction barriers. Should any external endpoint
          experience network latency exceeding 3.5s, the non-blocking executor transitions to deterministic
          academic synthesis without stalling the single-threaded event loop:
        </p>

        <div className="rounded-xl border border-white/[0.08] bg-[#12141c] p-5 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
          <pre className="text-neutral-300">
{`async def execute_workflow(session_id: str, request: AgentRunRequest):
    # Step 1: Research Planner
    plan = await planner.run(request.topic, request.research_question)
    update_state(session_id, agent="planner", progress=18)

    # Step 2: Federated Retrieval across arXiv, Semantic Scholar, OpenAlex
    papers = await retrieval.run(request.topic, plan["keywords"], sources=request.sources)
    update_state(session_id, agent="retrieval", progress=38)

    # Step 3: Concurrent Full-Text Extraction
    enriched = await extraction.run(papers)
    update_state(session_id, agent="extraction", progress=54)

    # Step 4: Parallel Summarization via Asyncio Gather
    summaries = await summarization.run_concurrent(enriched)
    update_state(session_id, agent="summarization", progress=72)

    # Step 5: Comparative Matrix & Gap Discovery
    comparison = await comparison.run(enriched, summaries)
    gaps = await gap_analysis.run(enriched, request.topic)
    
    # Step 6: Synthesis & Formal Literature Review Document
    review = await literature_review.run(enriched, request.topic, citation_style="APA")
    finalize_state(session_id, result=review, progress=100)`}
          </pre>
        </div>
      </section>
    </div>
  );
}
