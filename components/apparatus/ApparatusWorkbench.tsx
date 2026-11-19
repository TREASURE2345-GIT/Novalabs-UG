import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useDragDrop, type DropPosition, type DragPayload } from '../../hooks/useDragDrop';
import type { ExperimentSession } from '../../hooks/useExperimentSession';
import type { Apparatus, ApparatusCategory } from '../../types/apparatus';
import type { ApparatusVisual } from '../../data/apparatusCatalog';
import ApparatusIllustration from './ApparatusIllustration';
import ScorePanel from './ScorePanel';
import MeasurableApparatus from './MeasurableApparatus';

type ApparatusWorkbenchProps = {
  session: ExperimentSession;
  required: Apparatus[];
  distractors?: Apparatus[];
  safety?: Apparatus[];
  accent?: string;
};

const categoryLabels: Record<ApparatusCategory, string> = {
  glassware: 'Glassware',
  measuring: 'Measuring',
  heating: 'Heating',
  handling: 'Handling',
  biological: 'Biological',
  safety: 'Safety',
};

const categoryOrder: ApparatusCategory[] = [
  'glassware',
  'measuring',
  'heating',
  'handling',
  'biological',
  'safety',
];

function Visual({ item, className = 'h-16 w-16' }: { item: Apparatus; className?: string }) {
  if (item.svg.trim().startsWith('<svg')) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: item.svg }}
      />
    );
  }
  return (
    <ApparatusIllustration
      visual={item.svg as ApparatusVisual}
      className={className}
      title={item.name}
    />
  );
}

export default function ApparatusWorkbench({
  session,
  required,
  distractors = [],
  safety = [],
  accent = '#38bdf8',
}: ApparatusWorkbenchProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ApparatusCategory | 'all'>('all');

  const available = useMemo(() => {
    const seen = new Set<string>();
    return [...required, ...distractors, ...safety].filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [distractors, required, safety]);

  const byId = useMemo(() => new Map(available.map((item) => [item.id, item])), [available]);
  const requiredIds = useMemo(() => new Set(required.map((item) => item.id)), [required]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return available.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!term) return true;
      return item.name.toLowerCase().includes(term) || item.category.includes(term);
    });
  }, [activeCategory, available, query]);

  const handleDrop = useCallback(
    (payload: DragPayload, position: DropPosition) => {
      if (position.zone === 'cabinet') {
        if (payload.instanceId) session.remove(payload.instanceId);
        return;
      }
      if (payload.instanceId) {
        session.move(payload.instanceId, position.x, position.y);
        setSelectedId(payload.instanceId);
      } else {
        session.place(payload.apparatusId, position.x, position.y);
      }
    },
    [session],
  );

  const { drag, startDrag } = useDragDrop({ onDrop: handleDrop });
  const selected = session.placed.find((entry) => entry.instanceId === selectedId);
  const selectedApparatus = selected ? byId.get(selected.apparatusId) : undefined;
  const draggingItem = drag ? byId.get(drag.payload.apparatusId) : undefined;
  const placedCount = session.placed.length;

  useEffect(() => {
    if (selectedId || session.placed.length === 0) return;
    const firstMeasurable = session.placed.find((entry) => byId.get(entry.apparatusId)?.capacity);
    if (firstMeasurable) setSelectedId(firstMeasurable.instanceId);
  }, [byId, selectedId, session.placed]);

  const beginDrag = (
    event: ReactPointerEvent<HTMLElement>,
    apparatusId: string,
    instanceId?: string,
  ) => {
    startDrag({ apparatusId, instanceId }, event);
  };

  return (
    <section className="space-y-4" aria-label="Interactive apparatus workbench">
      <div className="grid items-start gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Apparatus bench</h3>
              <p className="text-sm text-slate-500">
                Drag apparatus from the cabinet, or press Add. {placedCount} item
                {placedCount === 1 ? '' : 's'} on the bench.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={session.autoSetup}
                title="Place every required item, put on protective equipment and check the setup"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Set up apparatus
              </button>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {required.length} required
              </p>
            </div>
          </div>

          <div
            data-dropzone="bench"
            aria-label="Bench drop zone"
            className="relative min-h-[15rem] overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-100 via-white to-slate-100 p-3 shadow-inner"
            style={{
              borderColor: accent,
              backgroundImage:
                'linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          >
            {session.placed.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="rounded-xl bg-white/80 px-4 py-3 text-center text-sm text-slate-500 shadow-sm">
                  Drop apparatus here to set up your experiment.
                  <br />
                  Start with the apparatus you need for the procedure.
                </p>
              </div>
            ) : null}

            {session.placed.map((entry) => {
              const item = byId.get(entry.apparatusId);
              if (!item) return null;
              const isSelected = entry.instanceId === selectedId;
              return (
                <div
                  key={entry.instanceId}
                  className={`absolute w-24 touch-none rounded-xl border bg-white/95 p-1 text-center shadow-sm transition focus-within:ring-2 focus-within:ring-sky-500 ${
                    isSelected ? 'border-sky-500 ring-2 ring-sky-300' : 'border-slate-200'
                  }`}
                  style={{
                    left: `${entry.x}%`,
                    top: `${entry.y}%`,
                    transform: `translate(-50%, -50%) rotate(${entry.rotation}deg)`,
                  }}
                >
                  <button
                    type="button"
                    onPointerDown={(event) => beginDrag(event, item.id, entry.instanceId)}
                    onClick={() => setSelectedId(entry.instanceId)}
                    className="block w-full cursor-grab rounded-lg p-1 focus:outline-none active:cursor-grabbing"
                    aria-label={`Select ${item.name} on the bench`}
                  >
                    <Visual item={item} className="h-14 w-14" />
                    <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-700">
                      {item.name}
                    </span>
                  </button>
                  {item.capacity && entry.value !== undefined ? (
                    <span className="mt-0.5 block text-[10px] font-semibold text-sky-700">
                      {entry.value} {item.capacity.unit}
                    </span>
                  ) : null}
                  {entry.heated ? (
                    <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                      HOT
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className="min-h-[1.5rem] rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900" aria-live="polite">
            {session.lastMessage}
          </p>

          {selected && selectedApparatus ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Visual item={selectedApparatus} className="h-12 w-12" />
                  <div>
                    <p className="font-semibold text-slate-900">{selectedApparatus.name}</p>
                    <p className="text-xs text-slate-500">
                      {selectedApparatus.purpose ?? 'Apparatus on the bench'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => session.use(selected.instanceId)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => session.rotate(selected.instanceId)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Rotate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      session.remove(selected.instanceId);
                      setSelectedId(null);
                    }}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <MeasurableApparatus
                apparatus={selectedApparatus}
                value={selected.value ?? 0}
                onChange={(next) => session.setValue(selected.instanceId, next)}
              />

              {selectedApparatus.interaction === 'heat' ? (
                <button
                  type="button"
                  onClick={() => session.setHeated(selected.instanceId, !selected.heated)}
                  className={`mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    selected.heated
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'border border-amber-300 text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  {selected.heated ? 'Turn off heat' : 'Heat apparatus'}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Personal protective equipment
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {safety.map((item) => {
                const worn = session.worn.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => session.wear(item.id)}
                    aria-pressed={worn}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      worn
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Visual item={item} className="h-8 w-8" />
                    {worn ? `${item.name} on` : `Wear ${item.name.toLowerCase()}`}
                  </button>
                );
              })}
            </div>
          </div>

          <ScorePanel
            result={session.check}
            hintsUsed={session.hintsUsed}
            onCheck={session.checkSetup}
            onHint={session.hint}
            onReset={session.reset}
          />
        </div>
      </div>

      <div
        data-dropzone="cabinet"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        aria-label="Apparatus cabinet"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Apparatus cabinet
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="apparatus-search">
              Search apparatus
            </label>
            <input
              id="apparatus-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search apparatus"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <label className="sr-only" htmlFor="apparatus-category">
              Filter by category
            </label>
            <select
              id="apparatus-category"
              value={activeCategory}
              onChange={(event) =>
                setActiveCategory(event.target.value as ApparatusCategory | 'all')
              }
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">All categories</option>
              {categoryOrder.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => {
            const onBench = session.placed.some((entry) => entry.apparatusId === item.id);
            return (
              <li key={item.id}>
                <div
                  onPointerDown={(event) => beginDrag(event, item.id)}
                  className={`flex touch-none flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${
                    onBench
                      ? 'border-sky-200 bg-sky-50/60'
                      : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40'
                  }`}
                >
                  <Visual item={item} className="h-10 w-10" />
                  <span className="line-clamp-2 min-h-[1rem] text-[10px] font-medium text-slate-700">
                    {item.name}
                  </span>
                  {requiredIds.has(item.id) ? (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0 text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                      Required
                    </span>
                  ) : (
                      <span className="rounded-full bg-amber-50 px-1.5 py-0 text-[8px] font-semibold uppercase tracking-wide text-amber-700">
                      Extra
                    </span>
                  )}
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => {
                      if (onBench) {
                        const entry = session.placed.find((row) => row.apparatusId === item.id);
                        if (entry) session.remove(entry.instanceId);
                      } else {
                        session.place(item.id, 30 + Math.random() * 40, 30 + Math.random() * 40);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    aria-label={onBench ? `Remove ${item.name}` : `Add ${item.name} to bench`}
                  >
                    {onBench ? 'Remove' : 'Add'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No apparatus matches that search.</p>
        ) : null}
      </div>

      {drag && draggingItem ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-sky-300 bg-white/95 p-1 shadow-xl"
          style={{ left: drag.x, top: drag.y }}
          aria-hidden="true"
        >
          <Visual item={draggingItem} className="h-14 w-14" />
        </div>
      ) : null}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          section[aria-label="Interactive apparatus workbench"] * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
