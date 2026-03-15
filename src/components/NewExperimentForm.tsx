"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function todayYYYYMMDD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const inputClass =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm";

const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default function NewExperimentForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [action, setAction] = useState("");
  const [metricName, setMetricName] = useState("");
  const [startDate, setStartDate] = useState(todayYYYYMMDD());
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !title.trim() ||
      !hypothesis.trim() ||
      !action.trim() ||
      !metricName.trim()
    ) {
      setError("Please fill out title, hypothesis, action, and metric.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          hypothesis: hypothesis.trim(),
          action: action.trim(),
          metricName: metricName.trim(),
          startDate,
          endDate: endDate.trim() ? endDate.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? `Request failed (${res.status})`);
        return;
      }

      router.push(`/experiments/${data.id}`);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6 space-y-5"
    >
      <div>
        <label className={labelClass}>Title</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Morning workout experiment"
          required
        />
      </div>

      <div>
        <label className={labelClass}>Hypothesis</label>
        <input
          className={inputClass}
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="e.g. Exercising before 8am will improve my focus"
          required
        />
      </div>

      <div>
        <label className={labelClass}>Action</label>
        <input
          className={inputClass}
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="e.g. 30 min workout every morning before 8am"
          required
        />
      </div>

      <div>
        <label className={labelClass}>Metric to track</label>
        <input
          className={inputClass}
          value={metricName}
          onChange={(e) => setMetricName(e.target.value)}
          placeholder="e.g. Focus score (1-10)"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start date</label>
          <input
            type="date"
            className={inputClass}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            End date{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            className={inputClass}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
      >
        {loading ? "Creating..." : "Create experiment"}
      </button>
    </form>
  );
}
