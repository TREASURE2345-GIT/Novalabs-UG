import { useEffect, useMemo, useRef, useState } from 'react';
import type { ExperimentEntry } from '../../data/experimentCatalog';
import {
  chemicalReagents,
  getChemical,
  mixChemicals,
  suggestedReagentsByExperiment,
  type ChemicalReagent,
  type MixOutcome,
} from '../../data/chemicalReagents';

type ChemicalMixerProps = {
  experiment: ExperimentEntry;
  onObservation?: (observation: string) => void;
  onMeasurement?: (measurement: string) => void;
};

const categoryLabels: Record<ChemicalReagent['category'], string> = {
  acid: 'Acids',
  base: 'Bases and alkalis',
  salt: 'Salts and solutions',
  metal: 'Metals',
  indicator: 'Indicators',
  solvent: 'Solvents',
  carbonate: 'Carbonates',
};

const formatTemperature = (value: number) => `${value.toFixed(1)} °C`;

export default function ChemicalMixer({ experiment, onObservation, onMeasurement }: ChemicalMixerProps) {
  const [contents, setContents] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'mixing' | 'reacted'>('idle');
  const [outcome, setOutcome] = useState<MixOutcome | null>(null);
  const [temperature, setTemperature] = useState(25);
  const [query, setQuery] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isVesselOver, setIsVesselOver] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  const suggested = suggestedReagentsByExperiment[experiment.slug] ?? [];
  const filteredReagents = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = term
      ? chemicalReagents.filter((reagent) =>
        `${reagent.name} ${reagent.formula} ${reagent.category}`.toLowerCase().includes(term))
      : chemicalReagents;

    return [...list].sort((first, second) => {
      const firstSuggested = suggested.includes(first.id) ? 0 : 1;
      const secondSuggested = suggested.includes(second.id) ? 0 : 1;
      return firstSuggested - secondSuggested || first.name.localeCompare(second.name);
    });
  }, [query, suggested]);

  const reagentA = contents[0] ? getChemical(contents[0]) : undefined;
  const reagentB = contents[1] ? getChemical(contents[1]) : undefined;
  const isFull = contents.length >= 2;
  const canMix = contents.length === 2 && status !== 'mixing';
  const canAdd = (id: string) => !contents.includes(id) && !isFull && status !== 'mixing';

  const vesselColor = outcome
    ? outcome.mixtureColor
    : contents.length === 2 && reagentA && reagentB
      ? `linear-gradient(180deg, ${reagentA.color} 0%, ${reagentA.color} 48%, ${reagentB.color} 52%, ${reagentB.color} 100%)`
      : reagentA?.color ?? '#cbd5e1';

  const addChemical = (id: string) => {
    if (!canAdd(id)) return;
    setContents((current) => [...current, id]);
    setOutcome(null);
    setStatus('idle');
    setTemperature(25);
  };

  const removeChemical = (id: string) => {
    if (status === 'mixing') return;
    setContents((current) => current.filter((entry) => entry !== id));
    setOutcome(null);
    setStatus('idle');
    setTemperature(25);
  };

  const resetVessel = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setContents([]);
    setOutcome(null);
    setStatus('idle');
    setTemperature(25);
  };

  const runMix = () => {
    if (!canMix) return;
    const [firstId, secondId] = contents;
    setStatus('mixing');
    setOutcome(null);
    timerRef.current = window.setTimeout(() => {
      const result = mixChemicals(firstId, secondId);
      setOutcome(result);
      setStatus('reacted');
      setTemperature(25 + result.temperatureChange);
      const details = [
        result.observation,
        result.gas ? `Gas produced: ${result.gas}.` : '',
        result.precipitate ? `Precipitate: ${result.precipitate}.` : '',
        result.temperatureChange ? `Temperature change: ${result.temperatureChange > 0 ? '+' : ''}${result.temperatureChange} °C.` : '',
        `Equation: ${result.equation}.`,
      ].filter(Boolean).join(' ');
      setLog((current) => [...current, details]);
      onObservation?.(details);
      if (result.temperatureChange) {
        onMeasurement?.(formatTemperature(25 + result.temperatureChange));
      }
      timerRef.current = null;
    }, 850);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('application/x-novalab-chemical')
      || event.dataTransfer.getData('text/plain');
    setIsVesselOver(false);
    setDraggingId(null);
    if (id) addChemical(id);
  };

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-purple-900/70 to-slate-900 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">Chemical bench</p>
          <h2 className="mt-1 text-2xl font-bold">Select, drag and mix reagents</h2>
          <p className="mt-1 text-sm text-slate-300">
            Drag two reagents into the vessel, mix them, and watch the real-time response. Observations are recorded automatically.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Temperature</p>
            <p className="font-mono text-xl font-bold text-cyan-300">{formatTemperature(temperature)}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Reagents</p>
            <p className="font-mono text-xl font-bold text-white">{contents.length}/2</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_0.85fr_1fr]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">Reagent shelf</h3>
            <span className="text-xs text-slate-500">{filteredReagents.length} available</span>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reagent or formula"
            className="mt-3 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-purple-300 focus:outline-none"
          />
          <div className="mt-3 grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {filteredReagents.map((reagent) => {
              const disabled = !canAdd(reagent.id);
              const isSuggested = suggested.includes(reagent.id);
              const inVessel = contents.includes(reagent.id);
              return (
                <button
                  key={reagent.id}
                  type="button"
                  draggable={!disabled}
                  onClick={() => addChemical(reagent.id)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', reagent.id);
                    event.dataTransfer.setData('application/x-novalab-chemical', reagent.id);
                    event.dataTransfer.effectAllowed = 'copy';
                    setDraggingId(reagent.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  disabled={disabled}
                  title={disabled ? 'Vessel is full or mixing' : 'Drag onto the vessel or click to add'}
                  className={`group flex items-start gap-2 rounded-xl border px-3 py-2 text-left transition ${
                    inVessel
                      ? 'border-emerald-400/50 bg-emerald-400/10'
                      : isSuggested
                        ? 'border-purple-400/40 bg-purple-400/10 hover:border-purple-300'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                  } disabled:cursor-not-allowed disabled:opacity-40 ${draggingId === reagent.id ? 'opacity-50' : ''}`}
                >
                  <span
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-white/30"
                    style={{ backgroundColor: reagent.color }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{reagent.name}</span>
                    <span className="block font-mono text-[11px] text-slate-400">{reagent.formula}</span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-slate-500">
                      {categoryLabels[reagent.category]}{isSuggested ? ' · suggested' : ''}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="self-start text-sm font-bold uppercase tracking-wide text-slate-300">Reaction vessel</h3>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsVesselOver(true);
            }}
            onDragLeave={() => setIsVesselOver(false)}
            onDrop={handleDrop}
            className={`relative mt-3 flex w-full flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition ${
              isVesselOver ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/15 bg-white/5'
            }`}
          >
            <div className="relative h-44 w-36 overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-white/35 bg-slate-900/50">
              <div
                className="absolute inset-x-0 bottom-0 transition-all duration-700"
                style={{
                  height: contents.length ? `${36 + contents.length * 24}%` : '0%',
                  background: vesselColor,
                  opacity: status === 'mixing' ? 0.75 : 0.95,
                }}
              />
              {status === 'mixing' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-pulse rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-cyan-200">
                    Mixing…
                  </span>
                </div>
              )}
              {status === 'reacted' && (outcome?.gas || outcome?.precipitate) && (
                <div className="pointer-events-none absolute inset-0">
                  {[12, 30, 52, 70, 86].map((left, index) => (
                    <span
                      key={left}
                      className={`absolute bottom-4 h-2 w-2 rounded-full bg-white/70 ${
                        outcome?.gas ? 'animate-bounce' : 'animate-pulse'
                      }`}
                      style={{ left: `${left}%`, animationDelay: `${index * 120}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex min-h-8 flex-wrap justify-center gap-2">
              {contents.length === 0 && (
                <p className="text-xs text-slate-400">Drag two reagents here, or click them on the shelf.</p>
              )}
              {contents.map((id) => {
                const reagent = getChemical(id);
                if (!reagent) return null;
                return (
                  <span key={id} className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
                    {reagent.formula}
                    <button
                      type="button"
                      onClick={() => removeChemical(id)}
                      aria-label={`Remove ${reagent.name}`}
                      className="rounded-full px-1 text-slate-400 transition hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            <div className="mt-3 flex w-full gap-2">
              <button
                type="button"
                onClick={runMix}
                disabled={!canMix}
                className="flex-1 rounded-lg bg-purple-400 px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-35"
              >
                {status === 'mixing' ? 'Mixing…' : 'Mix reagents'}
              </button>
              <button
                type="button"
                onClick={resetVessel}
                disabled={contents.length === 0 && !outcome}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">Live observation log</h3>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
            {outcome ? (
              <>
                <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-300">Result</p>
                  <p className="mt-1 text-sm leading-6 text-cyan-50">{outcome.observation}</p>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-900/60 p-2">
                    <dt className="text-slate-400">Equation</dt>
                    <dd className="mt-1 font-mono text-[11px] leading-5 text-white">{outcome.equation}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-900/60 p-2">
                    <dt className="text-slate-400">Evidence</dt>
                    <dd className="mt-1 text-white">
                      {outcome.gas ? `Gas: ${outcome.gas}. ` : ''}
                      {outcome.precipitate ? `Precipitate: ${outcome.precipitate}. ` : ''}
                      {outcome.temperatureChange ? `ΔT ${outcome.temperatureChange > 0 ? '+' : ''}${outcome.temperatureChange} °C.` : ''}
                      {!outcome.gas && !outcome.precipitate && !outcome.temperatureChange ? 'Colour or pH change only.' : ''}
                    </dd>
                  </div>
                </dl>
                {outcome.safety && (
                  <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-2 text-[11px] leading-5 text-amber-100">
                    Safety: {outcome.safety}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">
                Mix two reagents to see the real-time response. The observation is added to your practical evidence automatically.
              </p>
            )}

            {log.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Recorded experiments</p>
                <ol className="mt-2 space-y-2">
                  {log.map((entry, index) => (
                    <li key={`${index}-${entry.slice(0, 20)}`} className="rounded-lg bg-slate-900/60 p-2 text-[11px] leading-5 text-slate-300">
                      <span className="font-bold text-slate-100">Trial {index + 1}: </span>{entry}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          {log.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setLog([]);
                resetVessel();
              }}
              className="mt-2 self-end text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              Clear log
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
