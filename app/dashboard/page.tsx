export const dynamic = 'force-dynamic';

type Experiment = {
  id: string;
  title: string;
  hypothesis: string;
  action: string;
  metricName: string;
  startDate: string;
  endDate: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
};

async function getExperiments(): Promise<Experiment[]> {
  const res = await fetch('http://localhost:3000/api/experiments', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch experiments: ${res.status}`);
  }

  return res.json();
}


export default async function DashboardPage() {
  const experiments = await getExperiments();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Your experiments (dev mode)
      </p>

      <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
        {experiments.length === 0 ? (
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 10 }}>
            No experiments yet.
          </div>
        ) : (
          experiments.map((e) => (
            <a
              key={e.id}
              href={`/experiments/${e.id}`}
              style={{
                display: 'block',
                padding: 16,
                border: '1px solid #ddd',
                borderRadius: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{e.title}</div>
                  <div style={{ opacity: 0.8, marginTop: 6 }}>
                    <div><b>Hypothesis:</b> {e.hypothesis}</div>
                    <div><b>Action:</b> {e.action}</div>
                    <div><b>Metric:</b> {e.metricName}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', opacity: 0.8 }}>
                  <div>{e.status}</div>
                  <div style={{ marginTop: 6 }}>
                    {new Date(e.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </main>
  );
}
