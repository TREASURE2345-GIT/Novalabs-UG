import { useMemo, useState } from 'react';
import type {
  ExperimentDefinition,
  SimulationControl,
  SimulationRun,
} from '../../../data/experiments/types';

type ExperimentSimulatorProps = {
  definition: ExperimentDefinition;
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

type Trial = {
  id: number;
  inputs: Record<string, number>;
  run: SimulationRun;
};

const defaultInputs = (controls: SimulationControl[]): Record<string, number> =>
  Object.fromEntries(controls.map((control) => [control.id, control.defaultValue]));

export default function ExperimentSimulator({
  definition,
  onObservation,
  onTrial,
}: ExperimentSimulatorProps) {
  const { simulation } = definition;
  const [inputs, setInputs] = useState<Record<string, number>>(() => defaultInputs(simulation.controls));
  const [trials, setTrials] = useState<Trial[]>([]);
  const [message, setMessage] = useState('');
  const [showExplanation, setShowExplanation] = useState(true);

  const live = useMemo(() => simulation.run(inputs), [inputs, simulation]);

  const updateInput = (id: string, value: number) => {
    setInputs((current) => ({ ...current, [id]: value }));
    setMessage('');
  };

  const recordTrial = () => {
    const next: Trial[] = [
      ...trials,
      { id: Date.now(), inputs: { ...inputs }, run: simulation.run(inputs) },
    ];
    setTrials(next);
    setMessage(`Trial ${next.length} recorded. Compare your readings and describe the trend.`);
    onObservation?.(live.observation);
    onTrial?.(next.length);
  };

  const reset = () => {
    setInputs(defaultInputs(simulation.controls));
    setTrials([]);
    setMessage('Simulation reset to its starting conditions.');
    onTrial?.(0);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          {simulation.kind.replace(/-/g, ' ')}
        </p>
        <h2 className="mt-1 text-xl font-bold">{simulation.title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">{definition.summary}</p>
        <p className="mt-3 rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-100">
          Safety: {simulation.safety}
        </p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          {simulation.controls.map((control) => {
            const value = inputs[control.id] ?? control.defaultValue;
            const optionLabel = control.options?.[Math.round(value)];
            return (
              <div key={control.id}>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={`sim-${control.id}`} className="text-sm font-semibold text-slate-800">
                    {control.label}
                  </label>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {optionLabel ?? `${value}${control.unit ? ` ${control.unit}` : ''}`}
                  </span>
                </div>
                {control.options ? (
                  <select
                    id={`sim-${control.id}`}
                    value={value}
                    onChange={(event) => updateInput(control.id, Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  >
                    {control.options.map((option, index) => (
                      <option key={option} value={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`sim-${control.id}`}
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(event) => updateInput(control.id, Number(event.target.value))}
                    className="mt-2 w-full accent-sky-600"
                  />
                )}
                {control.hint ? (
                  <p className="mt-1 text-xs text-slate-500">{control.hint}</p>
                ) : null}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={recordTrial}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Record trial
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowExplanation((current) => !current)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              aria-pressed={showExplanation}
            >
              {showExplanation ? 'Hide explanation' : 'Show explanation'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Live observation</p>
            <p className="mt-1 text-sm font-medium text-sky-950">{live.observation}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Live readings from the simulation</caption>
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2">Quantity</th>
                  <th scope="col" className="px-3 py-2">Reading</th>
                </tr>
              </thead>
              <tbody>
                {live.readings.map((reading) => (
                  <tr
                    key={reading.label}
                    className={reading.highlight ? 'bg-emerald-50 font-semibold text-emerald-900' : 'bg-white'}
                  >
                    <td className="border-t border-slate-100 px-3 py-2">{reading.label}</td>
                    <td className="border-t border-slate-100 px-3 py-2">
                      {reading.value}
                      {reading.unit ? ` ${reading.unit}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showExplanation ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Why this happens</p>
              <p className="mt-1 text-sm text-emerald-900">{live.explanation}</p>
            </div>
          ) : null}

          <p className="text-sm text-slate-600" aria-live="polite">
            {message || 'Adjust the controls and record trials to build your results table.'}
          </p>
        </div>
      </div>

      {trials.length > 0 ? (
        <div className="border-t border-slate-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recorded trials</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {trials.length} trial{trials.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">Recorded experiment trials</caption>
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2">Trial</th>
                  {simulation.controls.map((control) => (
                    <th key={control.id} scope="col" className="px-3 py-2">
                      {control.label}
                    </th>
                  ))}
                  {trials[0].run.readings.map((reading) => (
                    <th key={reading.label} scope="col" className="px-3 py-2">
                      {reading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trials.map((trial, index) => (
                  <tr key={trial.id} className="bg-white">
                    <th scope="row" className="border-t border-slate-100 px-3 py-2 font-semibold text-slate-700">
                      {index + 1}
                    </th>
                    {simulation.controls.map((control) => (
                      <td key={control.id} className="border-t border-slate-100 px-3 py-2">
                        {trial.inputs[control.id]}
                        {control.unit ? ` ${control.unit}` : ''}
                      </td>
                    ))}
                    {trial.run.readings.map((reading) => (
                      <td key={reading.label} className="border-t border-slate-100 px-3 py-2">
                        {reading.value}
                        {reading.unit ? ` ${reading.unit}` : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
