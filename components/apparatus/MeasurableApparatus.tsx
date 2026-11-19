import { useId } from 'react';
import type { Apparatus } from '../../types/apparatus';

type MeasurableApparatusProps = {
  apparatus: Apparatus;
  value: number;
  onChange: (value: number) => void;
};

type VesselKind = 'burette' | 'cylinder' | 'beaker' | 'flask' | 'thermometer';

function getVesselKind(apparatus: Apparatus): VesselKind {
  const key = `${apparatus.id} ${apparatus.name}`.toLowerCase();
  if (key.includes('burette')) return 'burette';
  if (key.includes('thermometer')) return 'thermometer';
  if (key.includes('flask')) return 'flask';
  if (key.includes('beaker')) return 'beaker';
  return 'cylinder';
}

function Vessel({ kind, clipId, percent }: { kind: VesselKind; clipId: string; percent: number }) {
  const liquidTop = 190 - (percent / 100) * 150;

  if (kind === 'burette') {
    return (
      <g>
        <rect x="58" y="18" width="44" height="172" rx="4" fill="white" stroke="#475569" strokeWidth="2" />
        <rect x="58" y={liquidTop} width="44" height={190 - liquidTop} fill="#38bdf8" opacity="0.7" clipPath={`url(#${clipId})`} />
        <ellipse cx="80" cy={liquidTop} rx="22" ry="4" fill="#0ea5e9" opacity="0.85" />
        {Array.from({ length: 9 }, (_, index) => {
          const y = 32 + index * 18;
          return <line key={y} x1="80" x2={index % 2 === 0 ? '100' : '92'} y1={y} y2={y} stroke="#64748b" strokeWidth="1.5" />;
        })}
        <path d="M70 190 L90 190 L90 200 L86 204 L74 204 L70 200 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <line x1="86" y1="202" x2="106" y2="202" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <rect x="58" y="18" width="44" height="172" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
      </g>
    );
  }

  if (kind === 'thermometer') {
    const mercuryTop = 175 - (percent / 100) * 130;
    return (
      <g>
        <rect x="72" y="24" width="16" height="160" rx="8" fill="white" stroke="#475569" strokeWidth="2" />
        <circle cx="80" cy="190" r="14" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
        <rect x="77" y={mercuryTop} width="6" height={190 - mercuryTop} fill="#ef4444" />
        {Array.from({ length: 7 }, (_, index) => {
          const y = 36 + index * 20;
          return <line key={y} x1="88" x2={index % 2 === 0 ? '104' : '98'} y1={y} y2={y} stroke="#64748b" strokeWidth="1.5" />;
        })}
      </g>
    );
  }

  if (kind === 'flask') {
    return (
      <g>
        <path d="M72 24 L88 24 L88 76 L132 188 L28 188 L72 76 Z" fill="white" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
        <path d={`M32 186 L128 186 L${80 - percent * 0.44} ${186 - percent * 1.02} L${80 + percent * 0.44} ${186 - percent * 1.02} Z`} fill="#38bdf8" opacity="0.7" clipPath={`url(#${clipId})`} />
        <line x1="42" y1="150" x2="118" y2="150" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="53" y1="120" x2="107" y2="120" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M72 24 L88 24 L88 76 L132 188 L28 188 L72 76 Z" fill="none" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
      </g>
    );
  }

  if (kind === 'beaker') {
    return (
      <g>
        <path d="M38 42 L122 42 L118 188 L42 188 Z" fill="white" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
        <path d="M122 42 L138 34 L132 50 Z" fill="white" stroke="#475569" strokeWidth="2" />
        <rect x="40" y={liquidTop} width="80" height={188 - liquidTop} fill="#38bdf8" opacity="0.7" clipPath={`url(#${clipId})`} />
        <ellipse cx="80" cy={liquidTop} rx="40" ry="4" fill="#0ea5e9" opacity="0.85" />
        {[0, 1, 2, 3].map((index) => {
          const y = 62 + index * 30;
          return <line key={y} x1="100" x2={index % 2 === 0 ? '116' : '110'} y1={y} y2={y} stroke="#64748b" strokeWidth="1.5" />;
        })}
        <path d="M38 42 L122 42 L118 188 L42 188 Z" fill="none" stroke="#475569" strokeWidth="2" />
      </g>
    );
  }

  return (
    <g>
      <rect x="52" y="28" width="56" height="160" rx="6" fill="white" stroke="#475569" strokeWidth="2" />
      <rect x="42" y="188" width="76" height="12" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
      <rect x="52" y={liquidTop} width="56" height={188 - liquidTop} fill="#38bdf8" opacity="0.7" clipPath={`url(#${clipId})`} />
      <ellipse cx="80" cy={liquidTop} rx="28" ry="4" fill="#0ea5e9" opacity="0.85" />
      {Array.from({ length: 9 }, (_, index) => {
        const y = 42 + index * 16;
        return <line key={y} x1="80" x2={index % 2 === 0 ? '104' : '94'} y1={y} y2={y} stroke="#64748b" strokeWidth="1.5" />;
      })}
      <rect x="52" y="28" width="56" height="160" rx="6" fill="none" stroke="#475569" strokeWidth="2" />
    </g>
  );
}

export default function MeasurableApparatus({ apparatus, value, onChange }: MeasurableApparatusProps) {
  const capacity = apparatus.capacity;
  const clipId = useId().replace(/:/g, '');
  if (!capacity) return null;

  const percent = Math.max(0, Math.min(100, (value / capacity.max) * 100));
  const step = capacity.step ?? 1;
  const marks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Number((capacity.max * ratio).toFixed(2)));
  const vessel = getVesselKind(apparatus);

  return (
    <div data-testid="measurable-apparatus" className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-800">Live measurement</span>
          <span className="rounded-lg bg-white px-2 py-1 text-sm font-bold text-sky-900 shadow-sm">
            {value} {capacity.unit}
          </span>
        </div>
        {capacity.correctRange ? (
          <span className="text-xs font-medium text-slate-600">
            Target {capacity.correctRange[0]}–{capacity.correctRange[1]} {capacity.unit}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        <svg viewBox="0 0 160 215" className="h-52 w-40 shrink-0" role="img" aria-label={`${apparatus.name} showing ${value} ${capacity.unit}`}>
          <defs>
            <clipPath id={clipId}>
              {vessel === 'flask' ? (
                <path d="M72 24 L88 24 L88 76 L132 188 L28 188 L72 76 Z" />
              ) : vessel === 'beaker' ? (
                <path d="M38 42 L122 42 L118 188 L42 188 Z" />
              ) : (
                <rect x="52" y="28" width="56" height="162" rx="6" />
              )}
            </clipPath>
          </defs>
          <Vessel kind={vessel} clipId={clipId} percent={percent} />
        </svg>

        <div className="min-w-0 flex-1">
          <label htmlFor="measurable-value" className="text-xs font-semibold text-slate-700">
            Adjust the {apparatus.name.toLowerCase()} reading
          </label>
          <input
            id="measurable-value"
            type="range"
            min={0}
            max={capacity.max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="mt-2 w-full accent-sky-600"
            aria-label={`Set ${apparatus.name} reading`}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {marks.map((mark) => (
              <button
                key={mark}
                type="button"
                onClick={() => onChange(mark)}
                className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                  Math.abs(mark - value) < 0.01
                    ? 'border-sky-500 bg-sky-100 text-sky-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mark} {capacity.unit}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            The liquid level, meniscus and graduation scale update as you change the reading. Use the reading in your evidence after you record the observation.
          </p>
        </div>
      </div>
    </div>
  );
}
