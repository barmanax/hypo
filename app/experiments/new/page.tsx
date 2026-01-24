import NewExperimentForm from '@/components/NewExperimentForm';

export default function NewExperimentPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <a href="/dashboard" style={{ textDecoration: 'none' }}>
        ← Back
      </a>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>
        New Experiment
      </h1>

      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Define what you’re testing and how you’ll measure it.
      </p>

      <NewExperimentForm />
    </main>
  );
}
