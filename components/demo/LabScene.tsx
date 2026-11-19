type LabSceneProps = {
  step: number;
  selected: string[];
  completed: boolean;
};

const sceneStyles = `
@keyframes demo-spin { to { transform: rotate(360deg); } }
@keyframes demo-drip { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(56px); opacity: 0; } }
@keyframes demo-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes demo-dna { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
@keyframes demo-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes demo-glow { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.8; } }
.demo-scene-in { animation: demo-fade-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }
`;

export default function LabScene({ step, selected, completed }: LabSceneProps) {
  return (
    <svg
      viewBox="0 0 820 600"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label="Animated virtual laboratory bench"
    >
      <style>{sceneStyles}</style>
      <defs>
        <radialGradient id="demo-bg" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#0c2038" />
          <stop offset="55%" stopColor="#071423" />
          <stop offset="100%" stopColor="#040b14" />
        </radialGradient>
        <radialGradient id="demo-cyan-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="demo-green-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="demo-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.16" />
          <stop offset="45%" stopColor="#f8fafc" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="demo-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="demo-ethanol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="demo-dna" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cffafe" stopOpacity="0.45" />
        </linearGradient>
        <pattern id="demo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e3a5f" strokeWidth="0.6" opacity="0.45" />
        </pattern>
        <filter id="demo-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="demo-tight-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="820" height="600" fill="url(#demo-bg)" />
      <rect width="820" height="600" fill="url(#demo-grid)" />
      <circle cx="650" cy="155" r="220" fill="url(#demo-cyan-halo)" />
      <circle cx="160" cy="420" r="230" fill="url(#demo-green-halo)" opacity="0.55" />

      <g opacity="0.7">
        <line x1="40" y1="500" x2="780" y2="500" stroke="#1e3a5f" strokeWidth="1" />
        <line x1="80" y1="512" x2="740" y2="512" stroke="#0f2740" strokeWidth="2" />
        <rect x="60" y="520" width="700" height="8" rx="4" fill="#0a1a2c" />
      </g>

      {step === 0 && <SetupScene selected={selected} />}
      {step === 1 && <SampleScene />}
      {step === 2 && <ExtractionScene />}
      {step === 3 && <ObservationScene completed={completed} />}

      <g fill="#64748b" fontSize="10" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.18em">
        <text x="40" y="575">VIRTUAL BENCH</text>
        <text x="690" y="575">NOVALAB AI</text>
      </g>
    </svg>
  );
}

function SetupScene({ selected }: { selected: string[] }) {
  return (
    <g className="demo-scene-in">
      <g>
        <rect x="62" y="398" width="170" height="50" rx="12" fill="#0b1b2e" stroke="#1e3a5f" />
        <rect x="74" y="408" width="146" height="30" rx="8" fill="#10263e" />
        <path d="M96 431c10-24 26-30 38-18 10 10 22 15 40 8 12-5 24 0 28 10-18 8-54 12-106 0Z" fill="#facc15" opacity="0.9" />
        <circle cx="143" cy="421" r="3" fill="#fef3c7" opacity="0.8" />
        <text x="80" y="478" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Specimen tray</text>
        <SelectionMark x={210} y={394} active={selected.includes('apparatus-0')} />
      </g>

      <g>
        <rect x="292" y="306" width="74" height="142" rx="18" fill="url(#demo-glass)" stroke="#7dd3fc" strokeOpacity="0.55" />
        <rect x="300" y="386" width="58" height="54" rx="12" fill="url(#demo-liquid)" opacity="0.9" />
        <line x1="302" y1="390" x2="356" y2="390" stroke="#fef3c7" strokeOpacity="0.6" />
        {[330, 350, 370, 390].map((y, index) => (
          <line key={y} x1="360" y1={y} x2={index % 2 === 0 ? 370 : 366} y2={y} stroke="#bae6fd" strokeOpacity="0.65" />
        ))}
        <text x="292" y="478" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Measuring cylinder</text>
        <SelectionMark x={348} y={302} active={selected.includes('apparatus-1')} />
      </g>

      <g>
        <path d="M468 465L539 322" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
        <path d="M554 465L486 322" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <circle cx="539" cy="322" r="5" fill="#e2e8f0" />
        <circle cx="486" cy="322" r="5" fill="#e2e8f0" />
        <path d="M566 314L606 438" stroke="#7dd3fc" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <circle cx="606" cy="438" r="6" fill="#bae6fd" opacity="0.7" />
        <text x="468" y="478" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Forceps and rod</text>
        <SelectionMark x={596} y={318} active={selected.includes('apparatus-2')} />
      </g>

      <g>
        <rect x="644" y="430" width="112" height="18" rx="9" fill="#0f2740" stroke="#1e3a5f" />
        <path d="M660 430V348c0-34 26-58 56-58h14" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.8" />
        <rect x="704" y="282" width="42" height="18" rx="6" fill="#0e7490" />
        <path d="M704 300l-14 34" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" />
        <circle cx="686" cy="340" r="10" fill="#a5f3fc" opacity="0.75" filter="url(#demo-tight-glow)" />
        <circle cx="690" cy="398" r="24" fill="#0b1b2e" stroke="#1e3a5f" />
        <text x="644" y="478" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Microscope</text>
        <SelectionMark x={738} y={278} active={selected.includes('apparatus-3')} />
      </g>

      <g opacity="0.55">
        <path d="M100 250h130" stroke="#1e3a5f" strokeDasharray="4 6" />
        <path d="M350 258h120" stroke="#1e3a5f" strokeDasharray="4 6" />
        <path d="M610 258h120" stroke="#1e3a5f" strokeDasharray="4 6" />
      </g>
    </g>
  );
}

function SampleScene() {
  return (
    <g className="demo-scene-in">
      <ellipse cx="250" cy="486" rx="120" ry="16" fill="#03101d" opacity="0.7" />
      <g>
        <rect x="176" y="424" width="150" height="56" rx="16" fill="#0f2740" stroke="#1e3a5f" />
        <path d="M196 424L212 272h84l16 152Z" fill="url(#demo-glass)" stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M210 392h84l10 28h-104Z" fill="url(#demo-liquid)" opacity="0.92" />
        <rect x="208" y="262" width="88" height="14" rx="7" fill="#0e7490" />
        <g style={{ transformOrigin: '252px 414px', animation: 'demo-spin 1.1s linear infinite' }}>
          <path d="M252 414l-26-8M252 414l26-8M252 414v-28M252 414v28" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
          <circle cx="252" cy="414" r="7" fill="#a5f3fc" />
        </g>
        {[226, 244, 268].map((x, index) => (
          <circle key={x} cx={x} cy={340 + index * 14} r={4 + index} fill="#fbbf24" opacity="0.9" />
        ))}
        <text x="176" y="510" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Blend the sample</text>
      </g>

      <path d="M360 350h92" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 7" opacity="0.65" />
      <path d="M435 342l18 8-18 8" fill="none" stroke="#22d3ee" strokeWidth="2" />

      <g>
        <rect x="506" y="452" width="156" height="18" rx="9" fill="#0f2740" stroke="#1e3a5f" />
        <path d="M526 452V286" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
        <path d="M526 310h44" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        <path d="M489 328h120l-60 88Z" fill="#fed7aa" fillOpacity="0.18" stroke="#fdba74" strokeOpacity="0.8" strokeWidth="2" />
        <path d="M549 416v18" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <rect x="510" y="434" width="86" height="62" rx="10" fill="url(#demo-glass)" stroke="#7dd3fc" strokeOpacity="0.5" />
        <rect x="517" y="466" width="72" height="23" rx="8" fill="url(#demo-liquid)" opacity="0.9" />
        {[0, 1, 2].map((index) => (
          <circle
            key={index}
            cx="552"
            cy="418"
            r="4"
            fill="#fbbf24"
            style={{ animation: `demo-drip 1.8s ease-in ${index * 0.55}s infinite` }}
          />
        ))}
        <text x="506" y="510" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">Filter the mixture</text>
      </g>

      <g opacity="0.6">
        <circle cx="250" cy="230" r="46" fill="none" stroke="#22d3ee" strokeDasharray="3 7" />
        <text x="214" y="225" fill="#67e8f9" fontSize="11" fontFamily="Inter, system-ui, sans-serif">lysis</text>
      </g>
    </g>
  );
}

function ExtractionScene() {
  return (
    <g className="demo-scene-in">
      <circle cx="410" cy="320" r="210" fill="url(#demo-cyan-halo)" />
      <ellipse cx="410" cy="510" rx="160" ry="18" fill="#03101d" opacity="0.75" />

      <g>
        <path d="M340 120h140v300c0 52-30 74-70 74s-70-22-70-74Z" fill="url(#demo-glass)" stroke="#7dd3fc" strokeOpacity="0.65" strokeWidth="2" />
        <clipPath id="demo-tube-clip">
          <path d="M342 122h136v298c0 48-28 70-68 70s-68-22-68-70Z" />
        </clipPath>
        <g clipPath="url(#demo-tube-clip)">
          <rect x="340" y="354" width="140" height="140" fill="url(#demo-liquid)" opacity="0.92" />
          <rect x="340" y="226" width="140" height="130" fill="url(#demo-ethanol)" />
          <line x1="340" y1="354" x2="480" y2="354" stroke="#fef3c7" strokeOpacity="0.75" />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <path
              key={index}
              d={`M${362 + index * 22} 356c-8-12 8-18 0-30s8-18 0-28`}
              fill="none"
              stroke="url(#demo-dna)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#demo-tight-glow)"
              style={{ animation: `demo-dna ${2 + index * 0.2}s ease-in-out ${index * 0.15}s infinite` }}
            />
          ))}
          {[372, 408, 444].map((x, index) => (
            <circle key={x} cx={x} cy={400 + index * 14} r={3 + index} fill="#fef3c7" opacity="0.5" />
          ))}
        </g>

        <g>
          <rect x="392" y="54" width="36" height="58" rx="10" fill="#0f2740" stroke="#1e3a5f" />
          <path d="M404 112h12v24h-12Z" fill="#bae6fd" opacity="0.8" />
          <circle cx="410" cy="152" r="5" fill="#67e8f9" filter="url(#demo-tight-glow)" style={{ animation: 'demo-drip 1.7s ease-in infinite' }} />
        </g>

        <g stroke="#38bdf8" strokeWidth="1" opacity="0.7">
          <line x1="486" y1="262" x2="570" y2="234" />
          <line x1="486" y1="356" x2="570" y2="356" />
        </g>
        <g fill="#bae6fd" fontSize="12" fontFamily="Inter, system-ui, sans-serif">
          <text x="578" y="238">Ice-cold ethanol</text>
          <text x="578" y="360">DNA layer</text>
        </g>
      </g>

      <g opacity="0.7">
        <path d="M230 250c20-16 40 16 60 0" stroke="#67e8f9" strokeWidth="2" fill="none" />
        <path d="M222 290c20-16 40 16 60 0" stroke="#67e8f9" strokeWidth="2" fill="none" opacity="0.6" />
        <text x="216" y="214" fill="#67e8f9" fontSize="11" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.18em">COLD</text>
      </g>
    </g>
  );
}

function ObservationScene({ completed }: { completed: boolean }) {
  return (
    <g className="demo-scene-in">
      <circle cx="350" cy="320" r="210" fill={completed ? 'url(#demo-green-halo)' : 'url(#demo-cyan-halo)'} />
      <ellipse cx="350" cy="510" rx="140" ry="18" fill="#03101d" opacity="0.75" />

      <g>
        <path d="M292 176h116v268c0 46-26 66-58 66s-58-20-58-66Z" fill="url(#demo-glass)" stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="2" />
        <rect x="300" y="404" width="100" height="70" rx="18" fill="url(#demo-liquid)" opacity="0.55" />
        {[0, 1, 2, 3, 4].map((index) => (
          <path
            key={index}
            d={`M${312 + index * 20} 398c-8-14 8-20 0-34s8-20 0-34`}
            fill="none"
            stroke="url(#demo-dna)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#demo-tight-glow)"
            style={{ animation: `demo-dna ${1.8 + index * 0.25}s ease-in-out ${index * 0.12}s infinite` }}
          />
        ))}
        <path d="M366 96L430 340" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        <path d="M414 322c14-8 28-2 30 10 2 14-12 24-26 18-12-6-16-22-4-28Z" fill="#f8fafc" opacity="0.92" filter="url(#demo-tight-glow)" />
        <text x="292" y="552" fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">DNA spooled on a glass rod</text>
        {completed && (
          <circle cx="350" cy="330" r="156" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="8 10" opacity="0.8" style={{ animation: 'demo-glow 2s ease-in-out infinite' }} />
        )}
      </g>

      <g>
        <line x1="454" y1="250" x2="506" y2="250" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
        <circle cx="600" cy="270" r="104" fill="#071423" fillOpacity="0.85" stroke="#67e8f9" strokeWidth="2" />
        <circle cx="600" cy="270" r="94" fill="none" stroke="#164e63" strokeWidth="1" />
        <g opacity="0.9">
          <path d="M560 200c60 30 20 110 80 140" stroke="#a5f3fc" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M640 200c-60 30-20 110-80 140" stroke="#f8fafc" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
          {[220, 250, 280, 310].map((y, index) => (
            <line key={y} x1={index % 2 === 0 ? 572 : 594} y1={y} x2={index % 2 === 0 ? 606 : 628} y2={y} stroke="#cffafe" strokeWidth="3" opacity="0.75" />
          ))}
        </g>
        <text x="548" y="400" fill="#a5f3fc" fontSize="12" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.14em">DNA VISIBLE</text>
      </g>
    </g>
  );
}

function SelectionMark({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g opacity={active ? 1 : 0} style={{ transition: 'opacity 350ms ease' }}>
      <circle cx={x} cy={y} r="13" fill="#34d399" />
      <path d={`M${x - 5} ${y}l4 4 7-9`} fill="none" stroke="#052e1b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
