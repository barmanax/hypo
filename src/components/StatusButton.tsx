"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  experimentId: string;
  currentStatus: "ACTIVE" | "PAUSED" | "COMPLETED";
};

export default function StatusButton({ experimentId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: "ACTIVE" | "PAUSED" | "COMPLETED") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/experiments/${experimentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to update status");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteExperiment() {
    if (!window.confirm("Delete this experiment? This cannot be undone.")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/experiments/${experimentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to delete");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentStatus === "ACTIVE" && (
        <>
          <button
            onClick={() => updateStatus("PAUSED")}
            disabled={loading}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Pause
          </button>
          <button
            onClick={() => updateStatus("COMPLETED")}
            disabled={loading}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Mark complete
          </button>
        </>
      )}
      {currentStatus === "PAUSED" && (
        <>
          <button
            onClick={() => updateStatus("ACTIVE")}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Resume
          </button>
          <button
            onClick={() => updateStatus("COMPLETED")}
            disabled={loading}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Mark complete
          </button>
        </>
      )}
      {currentStatus === "COMPLETED" && (
        <button
          onClick={() => updateStatus("ACTIVE")}
          disabled={loading}
          className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          Reactivate
        </button>
      )}
      <button
        onClick={deleteExperiment}
        disabled={loading}
        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="text-red-600 text-sm w-full">{error}</p>}
    </div>
  );
}
