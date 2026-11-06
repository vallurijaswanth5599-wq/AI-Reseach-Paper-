import { useState } from 'react';

export default function PaperEditorial() {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(
      'Jaswanth, V. (2026). Autonomous Collaborative Agents for Academic Literature Synthesis. Department of Artificial Intelligence and Data Science, Ramachandra College of Engineering.'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Paper Header */}
      <div className="border-b border-white/[0.08] pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Research Manuscript · AI & DS Technical Report
        </p>

        <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-neutral-100 leading-[1.12]">
          Autonomous Collaborative Agents for Academic Literature Synthesis and Verification
        </h1>

        {/* Authors & Affiliations */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-300">
          <div>
            <span className="font-medium text-white">Valluri Jaswanth</span>
            <span className="ml-1 text-xs text-neutral-400">(Roll No: 23ME1A54D1)</span>
          </div>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">Dept. of Artificial Intelligence & Data Science</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">Ramachandra College of Engineering, Eluru</span>
        </div>

        {/* Publication Metadata Strip */}
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs font-mono text-neutral-400">
          <div>
            <span className="text-neutral-500">Date:</span> <span className="text-neutral-200">November 2026</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div>
            <span className="text-neutral-500">Subject:</span>{' '}
            <span className="text-neutral-200">cs.AI · cs.CL · Multi-Agent Systems</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div>
            <span className="text-neutral-500">Repository:</span>{' '}
            <span className="text-neutral-200">GitHub (Public Academic Release)</span>
          </div>
        </div>

        {/* Download & Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/VALLURI_JASWANTH_23ME1A54D1_MiniProject_Report.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-950 shadow-sm transition hover:bg-neutral-200"
          >
            <span>Download Paper (PDF)</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          <a
            href="/VALLURI_JASWANTH_23ME1A54D1_MiniProject_Report.docx"
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-neutral-200 transition hover:bg-white/[0.08]"
          >
            <span>Download Report (DOCX)</span>
            <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          <button
            onClick={handleCopyCitation}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-medium text-neutral-400 transition hover:text-white"
          >
            <span>{copied ? 'Citation Copied' : 'Copy Citation'}</span>
          </button>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="py-12 space-y-6">
        <h2 className="font-serif text-2xl text-neutral-100">Abstract</h2>
        <div className="max-w-[70ch] space-y-4 text-sm leading-relaxed text-neutral-300">
          <p>
            The accelerated pace of scientific publishing—surpassing five million papers annually—has created
            an acute information synthesis bottleneck. Researchers, engineers, and literature survey teams
            frequently allocate over forty hours per topic to manually query fragmented repositories, read
            unstandardized PDF documents, compare heterogeneous methodologies, and synthesize unaddressed
            research gaps. Conventional large language model applications often fail under dense multi-document
            synthesis due to severe context window degradation and persistent hallucinated citations.
          </p>
          <p>
            In this work, we introduce an autonomous collaborative multi-agent architecture specifically
            engineered for rigorous academic discovery and synthesis. The system orchestrates nine specialized
            micro-agents operating under bounded state machines: (1) Research Planner, (2) Federated Retrieval,
            (3) Full-Text Extraction, (4) Structured Summarization, (5) Cross-Paper Comparison, (6) Gap
            Analysis, (7) Grounded Question Answering, (8) Formal Review Writer, and (9) Agent Coordinator.
          </p>
          <p>
            We connect the pipeline to four global repositories (arXiv, Semantic Scholar, OpenAlex, and Crossref)
            with automated title and DOI deduplication. Empirical evaluations demonstrate an 85% latency
            reduction in end-to-end literature synthesis while completely eliminating citation hallucination by
            strictly grounding all generated claims to verified paper identifiers.
          </p>
        </div>
      </div>

      {/* Key Contributions Asymmetric Cards */}
      <div className="border-t border-white/[0.08] pt-12">
        <h2 className="font-serif text-2xl text-neutral-100 mb-6">Key Contributions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6">
            <span className="font-mono text-[11px] text-neutral-500">01</span>
            <h3 className="mt-2 font-serif text-lg text-neutral-100">Agentic Decomposition</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Replacing monolithic prompt generation with nine specialized agents with discrete verification barriers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6">
            <span className="font-mono text-[11px] text-neutral-500">02</span>
            <h3 className="mt-2 font-serif text-lg text-neutral-100">Federated Deduplication</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Real-time ingestion across arXiv, Semantic Scholar, OpenAlex, and Crossref with title and DOI normalization.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#12141c]/50 p-6">
            <span className="font-mono text-[11px] text-neutral-500">03</span>
            <h3 className="mt-2 font-serif text-lg text-neutral-100">Verifiable RAG Synthesis</h3>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Zero hallucinated citations: all extracted claims and reviews are linked directly to verified publication records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
