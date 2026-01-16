export const dynamic = 'force-dynamic';

type CheckIn = {
  id: string;
  date: string;
  adhered: boolean;
  metricValue: number;
  note: string | null;
  createdAt: string;
};

type ExperimentDetail = {
  id: string;
  title: string;
  hypothesis: string;
  action: string;
  metricName: string;
  startDate: string;
  endDate: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  checkIns: CheckIn[];
};

async function getExperiment(id: string): Promise<ExperimentDetail> {
  const res = await fetch(`http://localhost:3000/api/experiments/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch experiment: ${res.status}`);
  }

  return res.json();
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await getExperiment(id);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <a href="/dashboard" style={{ textDecoration: 'none' }}>
        ← Back
      </a>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>
        {exp.title}
      </h1>

      <div style={{ marginTop: 12, padding: 16, border: '1px solid #ddd', borderRadius: 10 }}>
        <div><b>Status:</b> {exp.status}</div>
        <div style={{ marginTop: 8 }}><b>Hypothesis:</b> {exp.hypothesis}</div>
        <div style={{ marginTop: 6 }}><b>Action:</b> {exp.action}</div>
        <div style={{ marginTop: 6 }}><b>Metric:</b> {exp.metricName}</div>
        <div style={{ marginTop: 6 }}>
          <b>Start:</b> {new Date(exp.startDate).toLocaleDateString()}
          {exp.endDate ? (
            <> • <b>End:</b> {new Date(exp.endDate).toLocaleDateString()}</>
          ) : null}
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 20 }}>Check-ins</h2>

      <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
        {exp.checkIns.length === 0 ? (
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 10 }}>
            No check-ins yet.
          </div>
        ) : (
          exp.checkIns.map((c) => (
            <div
              key={c.id}
              style={{ padding: 14, border: '1px solid #ddd', borderRadius: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700 }}>
                  {new Date(c.date).toLocaleDateString()}
                </div>
                <div style={{ opacity: 0.85 }}>
                  {c.adhered ? 'Adhered ✅' : 'Not adhered ❌'}
                </div>
              </div>
              <div style={{ marginTop: 6 }}>
                <b>Metric:</b> {c.metricValue}
              </div>
              {c.note ? (
                <div style={{ marginTop: 6, opacity: 0.9 }}>
                  <b>Note:</b> {c.note}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
