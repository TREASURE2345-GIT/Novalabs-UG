import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type PpeId = 'goggles' | 'coat' | 'gloves';

const ENDPOINT = 24.5;
const TOLERANCE = 0.05;
const BURETTE_CAPACITY = 50;

const ppeItems: Array<{ id: PpeId; label: string }> = [
  { id: 'goggles', label: 'Safety goggles' },
  { id: 'coat', label: 'Lab coat' },
  { id: 'gloves', label: 'Gloves' },
];

const clamp = (value: number) => Math.min(BURETTE_CAPACITY, Math.max(0, Math.round(value * 20) / 20));

export default function PhysicalTitrationLab() {
  const [worn, setWorn] = useState<PpeId[]>([]);
  const [filled, setFilled] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [volume, setVolume] = useState(0);
  const [trials, setTrials] = useState<number[]>([]);
  const [message, setMessage] = useState('Put on your protective equipment, then fill the burette.');
  const [pouring, setPouring] = useState(false);

  const state = useMemo(() => {
    const difference = volume - ENDPOINT;
    if (!filled || !indicator) return 'setup';
    if (Math.abs(difference) <= TOLERANCE) return 'endpoint';
    if (difference < 0) return 'acidic';
    return 'overshot';
  }, [filled, indicator, volume]);

  const flaskColor = state === 'endpoint' ? '#e2f3ec' : state === 'overshot' ? '#bae6fd' : '#f472b6';
  const liquidTop = 120 + (volume / BURETTE_CAPACITY) * 240;
  const safetyReady = worn.length === ppeItems.length;

  const observation =
    state === 'endpoint'
      ? 'The pink colour has just disappeared and stays colourless for 30 seconds. Endpoint reached.'
      : state === 'overshot'
        ? 'The solution is colourless, but the endpoint was overshot. Repeat the titration.'
        : state === 'acidic'
          ? 'The solution is still pink: alkali remains in excess. Add acid a little at a time.'
          : 'Set up the apparatus before adding acid.';

  const togglePpe = (id: PpeId) => {
    setWorn((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setMessage(safetyReady ? 'Protective equipment checked.' : 'Protective equipment updated.');
  };

  const fillBurette = () => {
    if (!safetyReady) {
      setMessage('Put on goggles, lab coat and gloves before handling acid.');
      return;
    }
    setVolume(0);
    setFilled(true);
    setMessage('Burette filled to 50.00 cm³ with hydrochloric acid. Read the meniscus at eye level.');
  };

  const addIndicator = () => {
    if (!safetyReady) {
      setMessage('Put on your protective equipment first.');
      return;
    }
    setIndicator(true);
    setMessage('Two drops of phenolphthalein added. The alkali in the flask turns pink.');
  };

  const addAcid = (amount: number) => {
    if (!filled || !indicator) {
      setMessage('Fill the burette and add the indicator before titrating.');
      return;
    }
    setVolume((current) => clamp(current + amount));
    setPouring(true);
    window.setTimeout(() => setPouring(false), 260);
    setMessage(`Acid added. Burette reading ${clamp(volume + amount).toFixed(2)} cm³.`);
  };

  const recordTrial = () => {
    if (state !== 'endpoint') {
      setMessage('Record a trial only at the first permanent colour change.');
      return;
    }
    const next = [...trials, volume];
    setTrials(next);
    setMessage(
      next.length < 3
        ? `Trial ${next.length} recorded at ${volume.toFixed(2)} cm³. Repeat for concordant titres.`
        : `Three titres recorded. Mean titre ${meanTitre(next).toFixed(2)} cm³.`,
    );
  };

  const resetTrial = () => {
    setVolume(0);
    setMessage('Burette refilled to 50.00 cm³. Ready for the next titre.');
  };

  const resetAll = () => {
    setWorn([]);
    setFilled(false);
    setIndicator(false);
    setVolume(0);
    setTrials([]);
    setMessage('Bench reset. Put on your protective equipment to begin again.');
  };

  const mean = trials.length > 0 ? meanTitre(trials) : 0;
  const complete = trials.length >= 3 && trials.every((value) => Math.abs(value - mean) <= 0.1);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Hands-on virtual lab</p>
            <h1 className="mt-1 text-3xl font-bold">Acid–base titration</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              Set up real apparatus, add the reagents, run the titration and record three concordant titres.
            </p>
          </div>
          <Link
            to="/login"
            className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-300/20"
          >
            Sign in to save progress
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
            <div className="border-b border-slate-700 px-5 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Physical apparatus bench</h2>
            </div>
            <svg viewBox="0 0 900 470" className="w-full" role="img" aria-label="Titration apparatus: burette on a retort stand above a conical flask on a white tile">
              <defs>
                <linearGradient id="bench-wood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#78350f" />
                  <stop offset="1" stopColor="#451a03" />
                </linearGradient>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#94a3b8" stopOpacity="0.8" />
                  <stop offset="0.3" stopColor="#f8fafc" stopOpacity="0.85" />
                  <stop offset="0.7" stopColor="#e2e8f0" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#64748b" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="acid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#bae6fd" />
                  <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>

              <rect x="0" y="402" width="900" height="68" fill="url(#bench-wood)" />
              <rect x="0" y="398" width="900" height="6" fill="#b45309" />

              <rect x="150" y="386" width="180" height="16" rx="4" fill="#334155" />
              <rect x="228" y="118" width="14" height="270" fill="url(#glass)" stroke="#475569" />
              <rect x="234" y="146" width="130" height="10" rx="4" fill="#64748b" />
              <circle cx="238" cy="151" r="8" fill="#94a3b8" stroke="#334155" />

              <rect x="352" y="118" width="28" height="244" rx="10" fill="url(#glass)" stroke="#475569" strokeWidth="2" />
              {filled ? (
                <rect x="355" y={liquidTop} width="22" height={Math.max(0, 362 - liquidTop)} fill="url(#acid)" opacity="0.92" />
              ) : null}
              {Array.from({ length: 11 }, (_, index) => index * 5).map((mark) => (
                <g key={mark}>
                  <line x1="380" y1={120 + (mark / BURETTE_CAPACITY) * 240} x2={mark % 10 === 0 ? 394 : 387} y2={120 + (mark / BURETTE_CAPACITY) * 240} stroke="#cbd5e1" strokeWidth="1.5" />
                  {mark % 10 === 0 ? (
                    <text x="398" y={124 + (mark / BURETTE_CAPACITY) * 240} fill="#94a3b8" fontSize="10">{mark}</text>
                  ) : null}
                </g>
              ))}
              <path d="M366 362 L366 374" stroke="#64748b" strokeWidth="4" />
              <circle cx="366" cy="378" r="4" fill={pouring ? '#0ea5e9' : '#334155'} />

              <rect x="508" y="384" width="230" height="16" rx="3" fill="#f8fafc" stroke="#cbd5e1" />
              <path d="M610 206 L610 256 L548 360 Q542 374 558 374 L688 374 Q704 374 698 360 L636 256 L636 206 Z" fill="url(#glass)" stroke="#475569" strokeWidth="2" />
              <path d="M606 202 L640 202" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
              <path d="M566 328 L680 328 L694 368 L552 368 Z" fill={filled && indicator ? flaskColor : '#e2e8f0'} opacity={filled && indicator ? 0.9 : 0.4} />
              {state === 'acidic' && filled && indicator ? (
                <g>
                  <circle cx="600" cy="352" r="4" fill="#f9a8d4" />
                  <circle cx="625" cy="344" r="3" fill="#fbcfe8" />
                  <circle cx="648" cy="358" r="4" fill="#f9a8d4" />
                </g>
              ) : null}
              <text x="366" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">Burette</text>
              <text x="623" y="192" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">Conical flask</text>
              <text x="623" y="414" textAnchor="middle" fill="#94a3b8" fontSize="12">White tile</text>
              <text x="240" y="414" textAnchor="middle" fill="#94a3b8" fontSize="12">Retort stand</text>
            </svg>
          </section>

          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">1. Safety and setup</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {ppeItems.map((item) => {
                  const active = worn.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => togglePpe(item.id)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        active
                          ? 'border-emerald-300 bg-emerald-400/10 text-emerald-200'
                          : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {active ? `${item.label} on` : `Wear ${item.label.toLowerCase()}`}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={fillBurette} className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-500">
                  Fill burette with acid
                </button>
                <button type="button" onClick={addIndicator} className="rounded-lg bg-fuchsia-600 px-3 py-2 text-xs font-semibold text-white hover:bg-fuchsia-500">
                  Add indicator
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">2. Run the titration</h2>
                <p className="font-mono text-lg font-bold text-cyan-200" aria-live="polite">{volume.toFixed(2)} cm³</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => addAcid(1)} className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700">Add 1.00 cm³</button>
                <button type="button" onClick={() => addAcid(0.1)} className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700">Add 0.10 cm³</button>
                <button type="button" onClick={() => addAcid(0.05)} className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/20">Add 0.05 cm³</button>
              </div>
              <p className="mt-3 rounded-lg bg-slate-800/70 px-3 py-2 text-sm text-slate-200" aria-live="polite">{message}</p>
              <p className={`mt-2 text-sm font-semibold ${state === 'endpoint' ? 'text-emerald-300' : state === 'overshot' ? 'text-rose-300' : 'text-slate-300'}`}>
                {observation}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={recordTrial} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500">Record trial</button>
                <button type="button" onClick={resetTrial} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800">Refill burette</button>
                <button type="button" onClick={resetAll} className="rounded-lg border border-rose-400/40 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-400/10">Reset bench</button>
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">3. Results</h2>
            <p className="text-sm text-slate-300">
              Titres: {trials.map((value) => value.toFixed(2)).join(', ') || 'none yet'}
              {trials.length > 0 ? ` · Mean ${mean.toFixed(2)} cm³` : ''}
            </p>
          </div>
          {complete ? (
            <p className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Experiment complete. Three concordant titres give a mean of {mean.toFixed(2)} cm³.
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              Aim for three titres within 0.10 cm³ of each other. The accepted endpoint is {ENDPOINT.toFixed(2)} cm³.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function meanTitre(values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}
