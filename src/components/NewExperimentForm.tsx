'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function todayYYYYMMDD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function NewExperimentForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [action, setAction] = useState('');
  const [metricName, setMetricName] = useState('');
  const [startDate, setStartDate] = useState(todayYYYYMMDD());
  const [endDate, setEndDate] = useState(''); // optional

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Minimal validation
    if (!title.trim() || !hypothesis.trim() || !action.trim() || !metricName.trim()) {
      setError('Please fill out title, hypothesis, action, and metric.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          hypothesis: hypothesis.trim(),
          action: action.trim(),
          metricName: metricName.trim(),
          // Your backend expects ISO strings; we can safely pass YYYY-MM-DD too
          startDate,
          endDate: endDate.trim() ? endDate.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? `Request failed (${res.status})`);
        return;
      }

      // Go to the new experiment page
      router.push(`/experiments/${data.id}`);
      router.refresh();
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ marginTop: 16, padding: 16, border: '1px solid #ddd', borderRadius: 10 }}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Hypothesis</span>
          <input value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Action</span>
          <input value={action} onChange={(e) => setAction(e.target.value)} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Metric name</span>
          <input value={metricName} onChange={(e) => setMetricName(e.target.value)} required />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Start date</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>End date (optional)</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>

        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create experiment'}
        </button>
      </div>
    </form>
  );
}
