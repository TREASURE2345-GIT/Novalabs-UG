import { useMemo, useState } from 'react';
import type { ExperimentEntry } from '../../data/experimentCatalog';
import {
  getSimulationConfig,
  type SimulationConfig,
  type SimulationTrial,
} from '../../data/simulationConfigs';

type QuantitativeSimulationProps = {
  experiment: ExperimentEntry;
  onDataChange?: (trials: SimulationTrial[]) => void;
};

const CHART_WIDTH = 560;
const CHART_HEIGHT = 240;
const PADDING = { top: 18, right: 18, bottom: 40, left: 56 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatValue = (value: number, decimals = 1) =>
  Number.isFinite(value) ? value.toFixed(decimals) : '—';

export default function QuantitativeSimulation({ experiment, onDataChange }: QuantitativeSimulationProps) {
  const config = useMemo(() => getSimulationConfig(experiment), [experiment]);
  const [input, setInput] = useState(config.independent.defaultValue);
  const [trials, setTrials] = useState<SimulationTrial[]>([]);
  const [message, setMessage] = useState('');

  const { independent, dependent } = config;
  const inputDecimals = independent.decimals ?? (independent.step < 1 ? 1 : 0);
  const outputDecimals = dependent.decimals ?? 1;
  const liveValue = config.model(input);

  const chart = useMemo(() => {
    const samples: SimulationTrial[] = Array.from({ length: 41 }, (_, index) => {
      const x = independent.min + ((independent.max - independent.min) * index) / 40;
      return { x, y: config.model(x) };
    });

    const allValues = [...samples.map((sample) => sample.y), ...trials.map((trial) => trial.y), liveValue];
    let minY = Math.min(...allValues);
    let maxY = Math.max(...allValues);

    if (minY > 0) minY = 0;
    if (maxY <= minY) maxY = minY + 1;
    const rangePad = (maxY - minY) * 0.12;
    maxY += rangePad;
    if (minY < 0) minY -= rangePad;

    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const scaleX = (x: number) =>
      PADDING.left + ((x - independent.min) / (independent.max - independent.min || 1)) * plotWidth;
    const scaleY = (y: number) =>
      PADDING.top + (1 - (y - minY) / (maxY - minY || 1)) * plotHeight;

    const curve = samples
      .map((sample, index) => `${index === 0 ? 'M' : 'L'} ${scaleX(sample.x).toFixed(2)} ${scaleY(sample.y).toFixed(2)}`)
      .join(' ');

    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const value = minY + ((maxY - minY) * index) / 4;
      return { value, y: scaleY(value) };
    });

    const xTicks = Array.from({ length: 5 }, (_, index) => {
      const value = independent.min + ((independent.max - independent.min) * index) / 4;
      return { value, x: scaleX(value) };
    });

    return {
      curve,
      yTicks,
      xTicks,
      scaleX,
      scaleY,
      minY,
      maxY,
      plotWidth,
      plotHeight,
    };
  }, [config, independent.max, independent.min, liveValue, trials]);

  const publish = (next: SimulationTrial[]) => {
    setTrials(next);
    onDataChange?.(next);
  };

  const runTrial = () => {
    const next = [...trials, { x: input, y: config.model(input) }];
    publish(next);
    setMessage(`Recorded trial ${next.length}: ${formatValue(input, inputDecimals)} ${independent.unit} → ${formatValue(config.model(input), outputDecimals)} ${dependent.unit}.`);
  };

  const runSweep = () => {
    const points: SimulationTrial[] = Array.from({ length: 5 }, (_, index) => {
      const x = independent.min + ((independent.max - independent.min) * index) / 4;
      return { x, y: config.model(x) };
    });
    publish(points);
    setMessage('Recorded a 5-point sweep across the full range. Use the graph to describe the trend.');
  };

  const clearTrials = () => {
    publish([]);
    setMessage('Trial data cleared. Run new trials to rebuild the graph.');
  };

  const onSlide = (value: number) => {
    setInput(clamp(value, independent.min, independent.max));
    setMessage('');
  };

  const livePercent = clamp(((liveValue - chart.minY) / (chart.maxY - chart.minY || 1)) * 100, 0, 100);

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Active simulation</p>
          <h2 className="mt-1 text-2xl font-bold">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{config.prompt}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">{dependent.label}</p>
          <p className="mt-1 text-3xl font-bold text-cyan-300">
            {formatValue(liveValue, outputDecimals)}
            <span className="ml-1 text-sm font-medium text-slate-300">{dependent.unit}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[0.85fr_1.15fr] lg:p-7">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="simulation-input" className="text-sm font-bold text-slate-900">
                {independent.label}
              </label>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-bold text-white">
                {formatValue(input, inputDecimals)} {independent.unit}
              </span>
            </div>
            <input
              id="simulation-input"
              type="range"
              min={independent.min}
              max={independent.max}
              step={independent.step}
              value={input}
              onChange={(event) => onSlide(Number(event.target.value))}
              className="mt-4 w-full cursor-pointer accent-cyan-600"
            />
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
              <span>{formatValue(independent.min, inputDecimals)} {independent.unit}</span>
              <span>{formatValue(independent.max, inputDecimals)} {independent.unit}</span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Live response</span>
                <span>{Math.round(livePercent)}%</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                  style={{ width: `${livePercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={runTrial}
                className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Record trial
              </button>
              <button
                type="button"
                onClick={runSweep}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Auto-run sweep
              </button>
            </div>
            <button
              type="button"
              onClick={clearTrials}
              disabled={!trials.length}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear recorded data
            </button>

            {config.safety && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                <span className="font-bold uppercase tracking-wide">Safety:</span> {config.safety}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Data interpretation</p>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              {trials.length >= 2 ? config.interpretation : 'Record at least two trials (or run the sweep) to unlock the scientific explanation.'}
            </p>
            <p className="mt-2 text-xs leading-5 text-emerald-700">
              <span className="font-semibold">Expected trend:</span> {config.trend}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data logger</p>
              <h3 className="text-lg font-bold text-slate-900">Live graph</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {trials.length} {trials.length === 1 ? 'trial' : 'trials'}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-label={`Graph of ${dependent.label} against ${independent.label}`}
            className="w-full"
          >
            <rect x={PADDING.left} y={PADDING.top} width={chart.plotWidth} height={chart.plotHeight} fill="#f8fafc" rx="8" />
            {chart.yTicks.map((tick) => (
              <g key={`y-${tick.value}`}>
                <line
                  x1={PADDING.left}
                  y1={tick.y}
                  x2={PADDING.left + chart.plotWidth}
                  y2={tick.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text x={PADDING.left - 8} y={tick.y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {formatValue(tick.value, outputDecimals)}
                </text>
              </g>
            ))}
            {chart.xTicks.map((tick) => (
              <g key={`x-${tick.value}`}>
                <line
                  x1={tick.x}
                  y1={PADDING.top}
                  x2={tick.x}
                  y2={PADDING.top + chart.plotHeight}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text x={tick.x} y={CHART_HEIGHT - 20} textAnchor="middle" fontSize="10" fill="#64748b">
                  {formatValue(tick.value, inputDecimals)}
                </text>
              </g>
            ))}

            <path d={chart.curve} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />

            <circle
              cx={chart.scaleX(input)}
              cy={chart.scaleY(liveValue)}
              r="6"
              fill="#06b6d4"
              stroke="#0f172a"
              strokeWidth="2"
              className="animate-pulse"
            />

            {trials.map((trial, index) => (
              <circle
                key={`${trial.x}-${trial.y}-${index}`}
                cx={chart.scaleX(trial.x)}
                cy={chart.scaleY(trial.y)}
                r="4.5"
                fill="#f59e0b"
                stroke="#78350f"
                strokeWidth="1.5"
              />
            ))}

            <text x={PADDING.left + chart.plotWidth / 2} y={CHART_HEIGHT - 4} textAnchor="middle" fontSize="11" fill="#475569">
              {independent.label} ({independent.unit})
            </text>
            <text
              x="14"
              y={PADDING.top + chart.plotHeight / 2}
              textAnchor="middle"
              fontSize="11"
              fill="#475569"
              transform={`rotate(-90 14 ${PADDING.top + chart.plotHeight / 2})`}
            >
              {dependent.label} ({dependent.unit})
            </text>
          </svg>

          <div className="mt-3 max-h-40 overflow-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-semibold">Trial</th>
                  <th className="px-3 py-2 font-semibold">{independent.label} ({independent.unit})</th>
                  <th className="px-3 py-2 font-semibold">{dependent.label} ({dependent.unit})</th>
                </tr>
              </thead>
              <tbody>
                {trials.length ? (
                  trials.map((trial, index) => (
                    <tr key={`${trial.x}-${index}`} className="border-t border-slate-100 text-slate-700">
                      <td className="px-3 py-1.5">{index + 1}</td>
                      <td className="px-3 py-1.5">{formatValue(trial.x, inputDecimals)}</td>
                      <td className="px-3 py-1.5 font-semibold text-slate-900">{formatValue(trial.y, outputDecimals)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
                      No trials yet. Move the slider and press “Record trial”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {message && <p className="mt-3 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-800">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export type { SimulationConfig };
