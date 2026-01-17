'use client';

import { useState } from 'react';

type Props = {
  experimentId: string;
};

export default function CheckInForm({ experimentId }: Props) {
  const [date, setDate] = useState(() => {
    // Default to today in YYYY-MM-DD
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [adhered, setAdhered] = useState(true);
  const [metricValue, setMetricValue] = useState<string>('8');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const metricNum = Number(metricValue);
    if (Number.isNaN(metricNum)) {
      setError('Metric value must be a number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/experiments/${experimentId}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          adhered,
          metricValue: metricNum,
          note: note.trim() ? note.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? `Request failed (${res.status})`);
        return;
      }

      setSuccess('Check-in created!');
      // Refresh to re-fetch server-rendered data (experiment + check-ins)
      window.location.reload();
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 16, padding: 16, border: '1px solid #ddd', borderRadius: 10 }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>New check-in</div>

      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Adhered?</span>
          <select
            value={adhered ? 'yes' : 'no'}
            onChange={(e) => setAdhered(e.target.value === 'yes')}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Metric value</span>
          <input
            type="number"
            step="0.1"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            required
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything notable?"
          />
        </label>

        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        {success ? <div style={{ color: 'green' }}>{success}</div> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit check-in'}
        </button>
      </div>
    </form>
  );
}
