// Auth disabled for screenshots — original auth version is in git history

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Hypo
          </h1>
          <p className="mt-3 text-lg text-slate-500 font-medium">
            Test the hype. Keep what works.
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-600 mb-10 leading-relaxed">
          Run personal experiments on your habits, routines, and behaviors.
          Track daily adherence, measure outcomes, and find out what actually
          moves the needle.
        </p>

        {/* CTA */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <p className="text-slate-600 text-sm mb-4">
            Sign in to start running experiments.
          </p>
          <a
            href="/dashboard"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-center"
          >
            Go to dashboard →
          </a>
        </div>
      </div>
    </main>
  );
}
