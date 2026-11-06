import { useState } from 'react';
import toast from 'react-hot-toast';

const bibtexCode = `@article{jaswanth2026autonomous,
  title     = {Autonomous Collaborative Agents for Academic Literature Synthesis and Verification},
  author    = {Jaswanth, Valluri},
  journal   = {Technical Report in Artificial Intelligence and Data Science},
  institution = {Ramachandra College of Engineering, Eluru},
  year      = {2026},
  url       = {https://github.com/vallurijaswanth5599-wq/AI-Reseach-Paper-}
}`;

export default function CiteContactEditorial() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopied(true);
    toast.success('BibTeX citation copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSent(true);
    toast.success('Your message has been dispatched to the authors.');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Academic Reference & Correspondence
        </p>
        <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-neutral-100 leading-[1.12]">
          Citation & Author Correspondence
        </h1>
        <p className="mt-4 max-w-[70ch] text-sm text-neutral-300 leading-relaxed">
          If you use this autonomous multi-agent framework or its empirical findings in your research,
          please cite our work using the standard BibTeX entry below.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {/* ── BIBTEX BLOCK IN A CREAM, PAPER-LIKE CARD ────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-neutral-100">BibTeX Citation</h2>
            <span className="text-xs font-mono text-neutral-400">format: bibtex</span>
          </div>

          <div className="relative rounded-2xl border border-[#e6ded1] bg-[#fbf9f5] p-6 text-neutral-900 shadow-md">
            {/* Top Bar inside Cream Card */}
            <div className="flex items-center justify-between border-b border-[#e2dacb] pb-3 mb-4">
              <span className="font-serif text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                Academic Publication Entry
              </span>
              <button
                onClick={handleCopyBibtex}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800"
              >
                <span>{copied ? 'Copied' : 'Copy BibTeX'}</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Code Content */}
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-neutral-800 selection:bg-neutral-200">
              {bibtexCode}
            </pre>
          </div>
        </section>

        {/* ── SIMPLE CONTACT FORM ON A CREAM CARD ──────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-neutral-100">Contact Authors</h2>
            <span className="text-xs font-mono text-neutral-400">vallurijaswanth5599@gmail.com</span>
          </div>

          <div className="rounded-2xl border border-[#e6ded1] bg-[#fbf9f5] p-6 sm:p-8 text-neutral-900 shadow-md">
            {sent ? (
              <div className="py-8 text-center space-y-2">
                <p className="font-serif text-2xl text-neutral-900">Thank you for your note.</p>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been logged. We will review your correspondence and respond via email shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 inline-block text-xs font-medium text-neutral-900 underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Alex Mercer"
                      className="w-full rounded-xl border border-[#d6cdbf] bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Academic / Work Email <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex.mercer@university.edu"
                      className="w-full rounded-xl border border-[#d6cdbf] bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                    Message / Collaboration Inquiry <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share feedback, collaboration inquiries, or evaluation benchmarks..."
                    className="w-full rounded-xl border border-[#d6cdbf] bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-neutral-500">
                    Correspondence directed to Valluri Jaswanth (RCEE).
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800"
                  >
                    <span>Send Message</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
