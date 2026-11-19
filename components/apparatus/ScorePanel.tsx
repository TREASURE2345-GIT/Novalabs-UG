import type { ApparatusCheckResult } from '../../types/apparatus';

type ScorePanelProps = {
  result: ApparatusCheckResult | null;
  hintsUsed: number;
  onCheck: () => void;
  onHint: () => void;
  onReset: () => void;
};

export default function ScorePanel({ result, hintsUsed, onCheck, onHint, onReset }: ScorePanelProps) {
  const score = result?.score ?? 0;
  const tone =
    score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Setup score</p>
          <p className={`text-3xl font-bold ${tone}`} aria-live="polite">
            {score}
            <span className="text-base font-medium text-slate-400">/100</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCheck}
            className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Check setup
          </button>
          <button
            type="button"
            onClick={onHint}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Hint ({hintsUsed})
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Metric label="Required placed" value={`${result.breakdown.requiredPlaced}`} />
            <Metric label="Missing" value={`${result.breakdown.requiredMissing}`} />
            <Metric label="Distractors" value={`${result.breakdown.distractorsPlaced}`} />
            <Metric label="Safety" value={`${result.breakdown.safeHandling}/20`} />
          </div>
          <ul className="space-y-1 text-sm">
            {result.messages.map((message) => (
              <li
                key={message}
                className={
                  result.ok
                    ? 'rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800'
                    : 'rounded-lg bg-amber-50 px-3 py-2 text-amber-800'
                }
              >
                {message}
              </li>
            ))}
          </ul>
          {result.breakdown.safetyViolations > 0 ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Safety violation detected. Never heat apparatus or handle reagents without protective
              equipment.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Place the required apparatus, add protective equipment, then check your setup.
        </p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}
