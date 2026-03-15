export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CheckInForm from "@/components/CheckInForm";
import StatusButton from "@/components/StatusButton";

const statusStyles = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

function avg(arr: number[]): number | null {
  if (arr.length === 0) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) redirect("/");

  const exp = await prisma.experiment.findFirst({
    where: { id, userId },
    include: {
      checkIns: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          adhered: true,
          metricValue: true,
          note: true,
          createdAt: true,
        },
      },
    },
  });

  if (!exp) notFound();

  // Compute summary inline
  const total = exp.checkIns.length;
  const adheredCount = exp.checkIns.filter((c) => c.adhered).length;
  const adherenceRate = total === 0 ? 0 : adheredCount / total;
  const avgMetricWhenAdhered = avg(
    exp.checkIns.filter((c) => c.adhered).map((c) => c.metricValue),
  );
  const avgMetricWhenNotAdhered = avg(
    exp.checkIns.filter((c) => !c.adhered).map((c) => c.metricValue),
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <a
        href="/dashboard"
        className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
      >
        ← Back to dashboard
      </a>

      {/* Title + status */}
      <div className="flex items-start gap-3 mt-4 mb-6">
        <h1 className="text-3xl font-black text-slate-900 leading-tight flex-1">
          {exp.title}
        </h1>
        <span
          className={`mt-1.5 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[exp.status]}`}
        >
          {exp.status}
        </span>
      </div>

      {/* Experiment details */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 font-semibold uppercase text-xs tracking-wide mb-1">
              Hypothesis
            </p>
            <p className="text-slate-700">{exp.hypothesis}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-xs tracking-wide mb-1">
              Action
            </p>
            <p className="text-slate-700">{exp.action}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-xs tracking-wide mb-1">
              Metric
            </p>
            <p className="text-slate-700">{exp.metricName}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-xs tracking-wide mb-1">
              Timeline
            </p>
            <p className="text-slate-700">
              {new Date(exp.startDate).toLocaleDateString()}
              {exp.endDate
                ? ` → ${new Date(exp.endDate).toLocaleDateString()}`
                : " → ongoing"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Check-ins", value: total.toString() },
          {
            label: "Adherence",
            value: `${(adherenceRate * 100).toFixed(0)}%`,
          },
          {
            label: `Avg (adhered)`,
            value:
              avgMetricWhenAdhered === null
                ? "—"
                : avgMetricWhenAdhered.toFixed(1),
          },
          {
            label: `Avg (not adhered)`,
            value:
              avgMetricWhenNotAdhered === null
                ? "—"
                : avgMetricWhenNotAdhered.toFixed(1),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 text-center"
          >
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-4">
        <p className="text-sm font-medium text-slate-500 mb-3">Actions</p>
        <StatusButton
          experimentId={exp.id}
          currentStatus={exp.status}
        />
      </div>

      {/* Check-in form (only if active) */}
      {exp.status === "ACTIVE" && (
        <CheckInForm experimentId={exp.id} metricName={exp.metricName} />
      )}

      {/* Check-ins list */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Check-in history
        </h2>

        {exp.checkIns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
            <p className="text-slate-400 text-sm">No check-ins yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {exp.checkIns.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-800 text-sm">
                    {new Date(c.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">
                      {exp.metricName}:{" "}
                      <span className="font-semibold text-slate-700">
                        {c.metricValue}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.adhered
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.adhered ? "Adhered" : "Skipped"}
                    </span>
                  </div>
                </div>
                {c.note && (
                  <p className="mt-2 text-sm text-slate-500 italic">
                    &ldquo;{c.note}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
