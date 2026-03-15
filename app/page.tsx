// Auth disabled for screenshots — original auth version is in git history

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
        <span className="text-xl font-black tracking-tight text-slate-900">
          Hypo
        </span>
        <a
          href="/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Get started
        </a>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          Personal experiment tracker
        </div>

        <h1 className="text-6xl font-black tracking-tight text-slate-900 leading-[1.05] max-w-2xl">
          Test the hype.
          <br />
          <span className="text-indigo-600">Keep what works.</span>
        </h1>

        <p className="mt-6 text-xl text-slate-500 leading-relaxed max-w-lg">
          Run structured experiments on your habits and routines. Log daily
          check-ins, measure outcomes, and let the data tell you what actually
          moves the needle.
        </p>

        <div className="flex items-center gap-4 mt-10">
          <a
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base shadow-sm"
          >
            Start experimenting →
          </a>
          <a
            href="/experiments/new"
            className="text-slate-600 hover:text-slate-900 font-medium text-base transition-colors"
          >
            See an example
          </a>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-slate-100 bg-slate-50 px-8 py-16">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: "🧪",
              title: "Form a hypothesis",
              body: "Define what you're testing, what action you'll take, and what metric you'll track.",
            },
            {
              icon: "📅",
              title: "Check in daily",
              body: "Log whether you followed through and record your metric — takes under a minute.",
            },
            {
              icon: "📊",
              title: "See what works",
              body: "Compare your average metric on days you adhered vs. days you didn't.",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-100">
        Hypo — built to learn full-stack development
      </footer>
    </main>
  );
}
