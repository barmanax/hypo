"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  experimentId: string;
  metricName?: string;
};

const inputClass =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm";

const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default function CheckInForm({ experimentId, metricName }: Props) {
  const router = useRouter();

  const [date, setDate] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [adhered, setAdhered] = useState(true);
  const [metricValue, setMetricValue] = useState<string>("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const metricNum = Number(metricValue);
    if (Number.isNaN(metricNum)) {
      setError("Metric value must be a number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/experiments/${experimentId}/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      setSuccess("Check-in logged!");
      setMetricValue("");
      setNote("");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6">
      <h2 className="font-bold text-slate-900 text-base mb-4">
        Log a check-in
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Did you adhere today?</label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setAdhered(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                adhered
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setAdhered(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                !adhered
                  ? "bg-slate-700 text-white border-slate-700"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            {metricName ? `Metric value — ${metricName}` : "Metric value"}
          </label>
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            placeholder="e.g. 7.5"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Note{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            className={inputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything notable?"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
        >
          {loading ? "Logging..." : "Submit check-in"}
        </button>
      </form>
    </div>
  );
}
