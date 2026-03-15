import NewExperimentForm from "@/components/NewExperimentForm";

export default function NewExperimentPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <a
        href="/dashboard"
        className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
      >
        ← Back to dashboard
      </a>

      <h1 className="text-3xl font-black text-slate-900 mt-4">
        New experiment
      </h1>
      <p className="text-slate-500 mt-2 text-sm">
        Define what you&apos;re testing and how you&apos;ll measure it.
      </p>

      <NewExperimentForm />
    </main>
  );
}
