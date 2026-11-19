import { useId } from 'react';
import type { ApparatusVisual } from '../../data/apparatusCatalog';

type ApparatusIllustrationProps = {
  visual: ApparatusVisual;
  accent?: string;
  label?: string;
  className?: string;
  title?: string;
};

const outline = '#64748b';
const dark = '#334155';
const steel = '#cbd5e1';

export default function ApparatusIllustration({
  visual,
  accent = '#38bdf8',
  label,
  className = 'h-32 w-32',
  title,
}: ApparatusIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const glassId = `glass-${uid}`;
  const metalId = `metal-${uid}`;
  const woodId = `wood-${uid}`;
  const liquidId = `liquid-${uid}`;
  const shineId = `shine-${uid}`;
  const glowId = `glow-${uid}`;
  const shadowId = `shadow-${uid}`;

  const glass = `url(#${glassId})`;
  const metal = `url(#${metalId})`;
  const wood = `url(#${woodId})`;
  const liquid = `url(#${liquidId})`;
  const shine = `url(#${shineId})`;
  const glow = `url(#${glowId})`;
  const shadow = `url(#${shadowId})`;

  const defs = (
    <defs>
      <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={steel} stopOpacity="0.95" />
        <stop offset="0.22" stopColor="#ffffff" />
        <stop offset="0.52" stopColor={accent} stopOpacity="0.16" />
        <stop offset="0.78" stopColor="#f8fafc" stopOpacity="0.9" />
        <stop offset="1" stopColor="#94a3b8" stopOpacity="0.72" />
      </linearGradient>
      <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#475569" />
        <stop offset="0.25" stopColor="#f1f5f9" />
        <stop offset="0.55" stopColor="#94a3b8" />
        <stop offset="0.8" stopColor="#e2e8f0" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>
      <linearGradient id={woodId} x1="0" y1="0" x2="1" y2="0.2">
        <stop offset="0" stopColor="#92400e" />
        <stop offset="0.45" stopColor="#d97706" />
        <stop offset="0.75" stopColor="#b45309" />
        <stop offset="1" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id={liquidId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={accent} stopOpacity="0.75" />
        <stop offset="1" stopColor={accent} stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={accent} stopOpacity="0.75" />
        <stop offset="0.6" stopColor={accent} stopOpacity="0.18" />
        <stop offset="1" stopColor={accent} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={shadowId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#0f172a" stopOpacity="0.22" />
        <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const renderVisual = () => {
    switch (visual) {
      case 'beaker':
        return (
          <g>
            <path d="M45 38h70l-5 79c-.4 6-5.2 10-11 10H61c-5.8 0-10.6-4-11-10z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M51 98h58l-2.6 20c-.3 4.2-3.6 7-7.7 7H61.3c-4.1 0-7.4-2.8-7.7-7z" fill={liquid} opacity="0.82" />
            <path d="M43 35h74" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M57 48v58" stroke={shine} strokeWidth="6" strokeLinecap="round" />
            <g stroke={dark} strokeWidth="1.3" opacity="0.7">
              <path d="M102 64h8" /><path d="M102 75h8" /><path d="M102 86h8" />
            </g>
            <ellipse cx="80" cy="99" rx="27" ry="3.6" fill="#ffffff" opacity="0.62" />
          </g>
        );
      case 'blender':
        return (
          <g>
            <ellipse cx="80" cy="143" rx="45" ry="8" fill={shadow} />
            <path d="M42 52h76l-8 73H50z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M49 96h62l-4.2 23H53z" fill={liquid} opacity="0.8" />
            <rect x="37" y="46" width="86" height="10" rx="4" fill="#475569" stroke={dark} strokeWidth="2" />
            <rect x="56" y="124" width="48" height="16" rx="5" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M71 58v58M89 58v58" stroke="#ffffff" strokeWidth="2" opacity="0.42" />
            <circle cx="80" cy="137" r="8" fill="#0f172a" />
            <circle cx="80" cy="137" r="3.2" fill={accent} />
            <path d="M63 34h34l6 12H57z" fill="#e2e8f0" stroke={outline} strokeWidth="2" />
            <rect x="84" y="30" width="8" height="8" rx="4" fill={accent} opacity="0.7" />
          </g>
        );
      case 'measuring-cylinder':
        return (
          <g>
            <path d="M60 24h40v104c0 8-6.5 14-14.5 14H74.5C66.5 142 60 136 60 128z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M64 88h32v40c0 5.7-4.6 10-10.3 10H74.3c-5.7 0-10.3-4.3-10.3-10z" fill={liquid} opacity="0.82" />
            <path d="M56 24h48M56 30h48" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M63 60h22M63 52h12M63 68h12M63 76h12M63 84h22" stroke={dark} strokeWidth="1.4" opacity="0.75" />
            <path d="M68 40v82" stroke={shine} strokeWidth="5" strokeLinecap="round" />
            <path d="M76 148h8" stroke={outline} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'test-tube':
        return (
          <g>
            <path d="M68 30h24v94c0 12-24 12-24 0z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M71 88h18v35c0 8.5-18 8.5-18 0z" fill={liquid} opacity="0.82" />
            <path d="M64 27h32" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M73 40v73" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <path d="M66 70h6M66 78h6M66 86h6" stroke={dark} strokeWidth="1.2" opacity="0.65" />
          </g>
        );
      case 'test-tube-rack':
        return (
          <g>
            <path d="M34 49h92v10H34z" fill={wood} stroke="#78350f" strokeWidth="2" />
            <path d="M38 59h84v28H38z" fill={wood} stroke="#78350f" strokeWidth="2" />
            <path d="M33 128h94v9H33z" fill={wood} stroke="#78350f" strokeWidth="2" />
            <path d="M42 68v60M118 68v60" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
            {[49, 65, 81, 97, 113].map((x) => (
              <g key={x}>
                <path d={`M${x - 4} 34h8v52c0 5-8 5-8 0z`} fill={glass} stroke={outline} strokeWidth="1.4" />
                <path d={`M${x - 2} 67h4v20c0 2.5-4 2.5-4 0z`} fill={liquid} opacity="0.72" />
                <path d={`M${x - 2} 31h4`} stroke={outline} strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
            <ellipse cx="80" cy="137" rx="50" ry="5" fill={shadow} />
          </g>
        );
      case 'conical-flask':
        return (
          <g>
            <path d="M70 27h20v24l31 65c4 8.5-2 18-11.5 18H58.5c-9.5 0-15.5-9.5-11.5-18l31-65z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M47 111h66l5 12c2.7 6.6-2.2 13-9.3 13H51.3C44.2 136 39.3 129.6 42 123z" fill={liquid} opacity="0.8" />
            <path d="M67 24h26" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M74 38v21l-17 36" stroke={shine} strokeWidth="4.5" strokeLinecap="round" />
            <ellipse cx="80" cy="121" rx="24" ry="4" fill="#ffffff" opacity="0.58" />
            <path d="M42 121h76" stroke={accent} strokeWidth="2" opacity="0.55" />
          </g>
        );
      case 'volumetric-flask':
        return (
          <g>
            <path d="M72 26h16v20c0 8 7 10 13 17 14 16 12 43-5 55-8 6-24 6-32 0-17-12-19-39-5-55 6-7 13-9 13-17z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M64 94c1 15 8 24 16 24s15-9 16-24c.4-11-7-19-16-19s-16.4 8-16 19z" fill={liquid} opacity="0.8" />
            <path d="M68 22h24" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M77 34v19c0 6-5 8-10 13" stroke={shine} strokeWidth="4.2" strokeLinecap="round" />
            <path d="M98 58h9" stroke={dark} strokeWidth="1.6" />
            <path d="M104 54v8" stroke={outline} strokeWidth="1.6" />
          </g>
        );
      case 'burette':
        return (
          <g>
            <path d="M76 18h8v101l-4 10-4-10z" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M77.5 52h5v65h-5z" fill={liquid} opacity="0.82" />
            <path d="M69 18h22M70 26h20" stroke={outline} strokeWidth="2.3" strokeLinecap="round" />
            <path d="M69 44h8M69 54h8M69 64h8M69 74h8M69 84h8M69 94h8M69 104h8" stroke={dark} strokeWidth="1.2" opacity="0.72" />
            <path d="M72 129h16" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M78 129v8M82 129v8" stroke={outline} strokeWidth="2" />
            <circle cx="80" cy="122" r="6" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M80 128v11" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M74 29v76" stroke={shine} strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'pipette':
        return (
          <g>
            <path d="M77 28h6v31l-3 4-3-4z" fill={glass} stroke={outline} strokeWidth="1.8" />
            <ellipse cx="80" cy="78" rx="10" ry="19" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M80 59v76" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M80 96v39" stroke={accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
            <path d="M76 34h8" stroke={outline} strokeWidth="2" />
            <path d="M72 72h7" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          </g>
        );
      case 'funnel':
        return (
          <g>
            <path d="M34 27h92L88 86v28h-16V86z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M48 36h64L82 72H78z" fill={liquid} opacity="0.28" />
            <path d="M83 86h14v29c0 5-14 5-14 0z" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M30 24h100" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M45 34l31 31" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 120v10" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>
        );
      case 'glass-rod':
        return (
          <g>
            <path d="M40 125L121 31" stroke={glass} strokeWidth="9" strokeLinecap="round" />
            <path d="M40 125L121 31" stroke={outline} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <path d="M52 113L113 43" stroke={shine} strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="121" cy="31" rx="4.5" ry="4.5" fill="#ffffff" stroke={outline} strokeWidth="1.2" />
            <ellipse cx="40" cy="125" rx="4.5" ry="4.5" fill="#ffffff" stroke={outline} strokeWidth="1.2" />
          </g>
        );
      case 'dropper':
        return (
          <g>
            <path d="M78 34h4v65l-2 8-2-8z" fill={glass} stroke={outline} strokeWidth="1.7" />
            <ellipse cx="80" cy="70" rx="7" ry="17" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M80 87v25" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M72 21h16v16c0 7-16 7-16 0z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
            <path d="M76 26h8" stroke="#fecaca" strokeWidth="2" strokeLinecap="round" />
            <path d="M80 92v16" stroke={accent} strokeWidth="2.3" strokeLinecap="round" opacity="0.82" />
            <circle cx="80" cy="113" r="3.2" fill={accent} opacity="0.85" />
          </g>
        );
      case 'wash-bottle':
        return (
          <g>
            <path d="M53 56h54v74c0 6.6-5.4 12-12 12H65c-6.6 0-12-5.4-12-12z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M57 90h46v38c0 4.8-3.8 8.5-8.5 8.5h-29c-4.7 0-8.5-3.7-8.5-8.5z" fill={liquid} opacity="0.75" />
            <rect x="69" y="43" width="22" height="14" rx="4" fill="#475569" stroke={dark} strokeWidth="2" />
            <path d="M80 43V29h30l10-9" fill="none" stroke={outline} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M118 17l-2 8-6-5z" fill={accent} />
            <path d="M60 66v52" stroke={shine} strokeWidth="5" strokeLinecap="round" />
            <path d="M64 22c4-8 20-8 24 0" fill="none" stroke={outline} strokeWidth="2" opacity="0.06" />
          </g>
        );
      case 'reagent-bottle':
        return (
          <g>
            <path d="M51 46h58v81c0 7.2-5.8 13-13 13H64c-7.2 0-13-5.8-13-13z" fill={glass} stroke={outline} strokeWidth="2.3" />
            <path d="M56 85h48v41c0 5.5-4.5 10-10 10H66c-5.5 0-10-4.5-10-10z" fill={liquid} opacity="0.84" />
            <path d="M68 34h24v12H68z" fill="#e2e8f0" stroke={outline} strokeWidth="2" />
            <rect x="65" y="23" width="30" height="13" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <rect x="60" y="92" width="40" height="28" rx="3" fill="#f8fafc" stroke={outline} strokeWidth="1.5" />
            <text x="80" y="105" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">{label ?? 'Reagent'}</text>
            <path d="M67 110h26M70 115h20" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M59 56v64" stroke={shine} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );
      case 'retort-stand':
        return (
          <g>
            <rect x="34" y="132" width="82" height="9" rx="3" fill={metal} stroke={dark} strokeWidth="1.8" />
            <rect x="69" y="24" width="7" height="110" rx="3" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M76 54h35" stroke={metal} strokeWidth="7" strokeLinecap="round" />
            <path d="M76 54h35" stroke={dark} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <rect x="102" y="47" width="18" height="14" rx="3" fill={dark} stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="111" cy="54" r="3" fill={accent} />
            <path d="M109 61c0 12-10 10-10 23" fill="none" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M91 84h16v28c0 6-16 6-16 0z" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M94 98h10v14c0 4-10 4-10 0z" fill={liquid} opacity="0.7" />
            <ellipse cx="80" cy="146" rx="48" ry="5" fill={shadow} />
          </g>
        );
      case 'watch-glass':
        return (
          <g>
            <path d="M37 88c4 30 21 46 43 46s39-16 43-46z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M53 99c4 18 14 27 27 27s23-9 27-27z" fill={accent} opacity="0.18" />
            <path d="M44 89c7 19 19 30 36 30s29-11 36-30" fill="none" stroke={shine} strokeWidth="5" strokeLinecap="round" />
            <circle cx="80" cy="112" r="8" fill={accent} opacity="0.55" />
            <ellipse cx="80" cy="142" rx="43" ry="6" fill={shadow} />
          </g>
        );
      case 'evaporating-dish':
      case 'crystallising-dish':
        return (
          <g>
            <path d="M38 74h84c-2 29-18 47-42 47S40 103 38 74z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M48 83h64c-4 18-16 29-32 29S52 101 48 83z" fill={liquid} opacity="0.72" />
            <path d="M34 71h92" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            {visual === 'crystallising-dish' ? (
              <g fill={accent} opacity="0.85">
                <path d="M62 93l7-11 7 11z" /><path d="M80 98l8-13 8 13z" /><path d="M98 91l6-10 6 10z" />
              </g>
            ) : (
              <path d="M48 94c12 6 52 6 64 0" stroke="#ffffff" strokeWidth="2" opacity="0.6" fill="none" />
            )}
            <ellipse cx="80" cy="129" rx="33" ry="5" fill={shadow} />
          </g>
        );
      case 'white-tile':
        return (
          <g>
            <path d="M36 70h88v48H36z" fill="#f8fafc" stroke={outline} strokeWidth="2.4" />
            <path d="M36 70h88l-54 48H36z" fill="#e2e8f0" opacity="0.55" />
            {[56, 76, 96, 116].map((x) => (
              <g key={x}><circle cx={x} cy="88" r="4" fill={accent} opacity="0.75" /><circle cx={x} cy="88" r="1.8" fill="#ffffff" opacity="0.7" /></g>
            ))}
            <path d="M43 77h6M103 111h6" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            <ellipse cx="80" cy="122" rx="45" ry="5" fill={shadow} />
          </g>
        );
      case 'mortar-pestle':
        return (
          <g>
            <path d="M40 69h80c-1 30-16 49-40 49S41 99 40 69z" fill="#e2e8f0" stroke={outline} strokeWidth="2.5" />
            <path d="M51 79h58c-4 18-14 29-29 29S55 97 51 79z" fill="#cbd5e1" />
            <path d="M106 46l20-20 8 8-20 20z" fill="#cbd5e1" stroke={outline} strokeWidth="2.2" />
            <path d="M120 32l10 10" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
            <path d="M52 43c-3 26 3 54 24 67" fill="none" stroke={outline} strokeWidth="2" opacity="0.5" />
            <ellipse cx="80" cy="126" rx="42" ry="6" fill={shadow} />
            <circle cx="74" cy="102" r="5" fill={accent} opacity="0.55" /><circle cx="89" cy="96" r="4" fill={accent} opacity="0.38" />
          </g>
        );
      case 'balance':
        return (
          <g>
            <path d="M49 51h62v9H49z" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M43 60h74l-8 43H51z" fill="#e2e8f0" stroke={outline} strokeWidth="2.3" />
            <path d="M56 68h48l-5 27H61z" fill="#0f172a" />
            <text x="80" y="85" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={accent}>100.0 g</text>
            <path d="M68 103h24l5 28H63z" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M55 132h50" stroke={dark} strokeWidth="5" strokeLinecap="round" />
            <circle cx="80" cy="61" r="3" fill={accent} />
            <path d="M112 64h10v7h-10z" fill={dark} />
            <path d="M117 61v13" stroke={accent} strokeWidth="2" />
            <ellipse cx="80" cy="141" rx="42" ry="5" fill={shadow} />
          </g>
        );
      case 'thermometer':
        return (
          <g>
            <rect x="74" y="24" width="12" height="99" rx="6" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M77 54h6v63h-6z" fill="#ef4444" opacity="0.85" />
            <circle cx="80" cy="128" r="12" fill="#ef4444" stroke={outline} strokeWidth="2" />
            <circle cx="80" cy="128" r="7" fill="#dc2626" />
            <path d="M77 32v24M83 32v24" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <g stroke={dark} strokeWidth="1.1" opacity="0.72">
              {[42, 49, 56, 63, 70, 77, 84, 91, 98, 105].map((y) => <path key={y} d={`M86 ${y}h${y % 14 === 0 ? 15 : 9}`} />)}
            </g>
            <path d="M73 34v70" stroke={shine} strokeWidth="3" strokeLinecap="round" />
            <text x="105" y="48" fontSize="7" fill={dark}>°C</text>
          </g>
        );
      case 'stopwatch':
        return (
          <g>
            <circle cx="80" cy="82" r="43" fill="#e2e8f0" stroke={dark} strokeWidth="3" />
            <circle cx="80" cy="82" r="34" fill="#f8fafc" stroke={outline} strokeWidth="2" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <path key={deg} d="M80 51v6" stroke={dark} strokeWidth="1.6" transform={`rotate(${deg} 80 82)`} />
            ))}
            <path d="M80 82V57M80 82l18 12" stroke="#dc2626" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="80" cy="82" r="3.5" fill="#dc2626" />
            <rect x="72" y="31" width="16" height="10" rx="3" fill={dark} />
            <rect x="104" y="44" width="13" height="9" rx="3" fill={dark} transform="rotate(38 104 44)" />
            <text x="80" y="103" textAnchor="middle" fontSize="7" fontWeight="700" fill={dark}>00:00</text>
          </g>
        );
      case 'ruler':
        return (
          <g>
            <rect x="22" y="67" width="116" height="26" rx="2" fill="#fde68a" stroke={dark} strokeWidth="2" />
            <path d="M30 67v11M40 67v7M50 67v11M60 67v7M70 67v11M80 67v7M90 67v11M100 67v7M110 67v11M120 67v7M130 67v11" stroke={dark} strokeWidth="1.4" />
            <path d="M28 88h104" stroke={outline} strokeWidth="1" opacity="0.7" />
            {[30, 50, 70, 90, 110, 130].map((x, index) => (
              <text key={x} x={x} y="82" textAnchor="middle" fontSize="7" fill={dark}>{index + 1}</text>
            ))}
          </g>
        );
      case 'vernier-callipers':
        return (
          <g>
            <path d="M33 59h94v15H33z" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M40 74h55v23H40z" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M30 55l-9-19h13l7 19z" fill={steel} stroke={dark} strokeWidth="2" />
            <path d="M95 74l28 46H99L83 97z" fill={steel} stroke={dark} strokeWidth="2" />
            <path d="M80 57v19M90 57v19" stroke={dark} strokeWidth="1.6" />
            <path d="M103 66v8M108 66v8" stroke={accent} strokeWidth="2" />
            <path d="M45 87h42M45 92h32" stroke={dark} strokeWidth="1.4" opacity="0.7" />
            <text x="101" y="84" fontSize="7" fill={accent}>0.02 mm</text>
          </g>
        );
      case 'bunsen-burner':
        return (
          <g>
            <path d="M69 121h22l5 15H64z" fill={metal} stroke={dark} strokeWidth="2" />
            <rect x="72" y="82" width="16" height="42" rx="3" fill={metal} stroke={dark} strokeWidth="2" />
            <rect x="61" y="78" width="38" height="8" rx="3" fill={dark} />
            <path d="M80 78c-13-17 8-25-2-44 13 11 10 21 8 28 10-8 11-17 12-27 8 19-1 39-18 43z" fill={glow} />
            <path d="M80 78c-7-11 5-19 0-30 8 8 6 17 4 22 5-4 6-9 7-14 4 11-1 19-11 22z" fill={accent} opacity="0.8" />
            <path d="M80 78c-3-7 2-11 0-18 4 5 3 11 1 14 2-2 3-4 3-7 2 6 0 9-4 11z" fill="#f8fafc" opacity="0.9" />
            <path d="M52 139h56" stroke={dark} strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="80" cy="145" rx="40" ry="5" fill={shadow} />
          </g>
        );
      case 'tripod-gauze':
        return (
          <g>
            <rect x="38" y="47" width="84" height="8" rx="2" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M64 59l-14 43M96 59l14 43" stroke={metal} strokeWidth="6" strokeLinecap="round" />
            <path d="M64 59l-14 43M96 59l14 43" stroke={dark} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
            <path d="M47 104h66" stroke={dark} strokeWidth="5" strokeLinecap="round" />
            <path d="M48 51h64M52 56h56" stroke={dark} strokeWidth="1.1" opacity="0.55" />
            <path d="M69 33h22v8H69z" fill={glass} stroke={outline} strokeWidth="1.6" />
            <path d="M72 38h16v7c0 4-16 4-16 0z" fill={liquid} opacity="0.72" />
            <path d="M70 30h20" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="80" cy="113" rx="43" ry="5" fill={shadow} />
          </g>
        );
      case 'water-bath':
        return (
          <g>
            <path d="M40 66h80v54c0 9-7 16-16 16H56c-9 0-16-7-16-16z" fill={metal} stroke={dark} strokeWidth="2.3" />
            <path d="M46 74h68v37c0 6-5 11-11 11H57c-6 0-11-5-11-11z" fill={liquid} opacity="0.78" />
            <path d="M37 62h86" stroke={dark} strokeWidth="4" strokeLinecap="round" />
            {[58, 78, 98].map((x) => (
              <g key={x}><path d={`M${x} 40h12v54H${x}z`} fill={glass} stroke={outline} strokeWidth="1.4" /><path d={`M${x + 3} 72h6v19c0 3-6 3-6 0z`} fill={accent} opacity="0.65" /></g>
            ))}
            <path d="M58 24c-4-10 5-9 3-18M80 24c-4-10 5-9 3-18M102 24c-4-10 5-9 3-18" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="80" cy="141" rx="45" ry="5" fill={shadow} />
          </g>
        );
      case 'calorimeter':
        return (
          <g>
            <path d="M45 50h70v77c0 8-6 14-14 14H59c-8 0-14-6-14-14z" fill={metal} stroke={dark} strokeWidth="2.4" />
            <ellipse cx="80" cy="50" rx="35" ry="9" fill="#e2e8f0" stroke={dark} strokeWidth="2" />
            <ellipse cx="80" cy="50" rx="27" ry="5.5" fill={accent} opacity="0.5" />
            <path d="M62 27h36M66 21h28" stroke={metal} strokeWidth="3.4" strokeLinecap="round" />
            <path d="M80 29v20" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="80" cy="51" r="4" fill={dark} />
            <path d="M80 58v41" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M80 99l8 15" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M51 60v53" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="80" cy="145" rx="43" ry="5" fill={shadow} />
          </g>
        );
      case 'vacuum-flask':
        return (
          <g>
            <path d="M66 35h28v17c0 8 14 12 14 42 0 27-12 43-28 43S52 121 52 94c0-30 14-34 14-42z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M60 90c0 24 9 38 20 38s20-14 20-38c0-20-8-27-20-27s-20 7-20 27z" fill="#dbeafe" opacity="0.5" />
            <path d="M60 78h40M59 84h42M58 92h44" stroke={accent} strokeWidth="1.6" opacity="0.6" />
            <rect x="64" y="25" width="32" height="12" rx="4" fill={dark} />
            <path d="M72 41v17" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="80" cy="141" rx="39" ry="5" fill={shadow} />
            <circle cx="80" cy="99" r="3" fill={accent} />
          </g>
        );
      case 'lamp':
        return (
          <g>
            <ellipse cx="80" cy="140" rx="44" ry="7" fill={shadow} />
            <path d="M52 105h56v31H52z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <path d="M57 94h46c8 0 13 5 13 11H44c0-6 5-11 13-11z" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <path d="M72 54h16l6 40H66z" fill={glass} stroke={outline} strokeWidth="2" />
            <path d="M76 66h8v22h-8z" fill={accent} opacity="0.65" />
            <path d="M80 57c-8-14 7-20 2-33 9 8 7 16 5 22 6-5 7-11 7-17 6 13 0 26-14 28z" fill={glow} />
            <path d="M80 57c-4-8 4-13 1-21 5 5 4 11 3 14 3-2 4-5 4-8 3 7-1 13-8 15z" fill="#fef3c7" />
            <path d="M70 46h20" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        );
      case 'screen':
        return (
          <g>
            <rect x="38" y="30" width="84" height="95" rx="3" fill="#f8fafc" stroke={dark} strokeWidth="2.4" />
            <rect x="44" y="36" width="72" height="83" fill="#e2e8f0" />
            <path d="M44 36l72 83M116 36l-72 83" stroke="#cbd5e1" strokeWidth="1" opacity="0.7" />
            <rect x="72" y="125" width="16" height="14" fill={dark} />
            <path d="M56 139h48" stroke={dark} strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="78" r="16" fill={glow} />
            <circle cx="80" cy="78" r="8" fill={accent} opacity="0.65" />
            <path d="M34 21l14 14" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'cheesecloth':
        return (
          <g>
            <path d="M42 36h76v87c-12-5-25 5-38 0-11-4-24 5-38 0z" fill="#f8fafc" stroke={outline} strokeWidth="2" />
            <path d="M49 43v74M60 40v74M71 40v76M82 40v76M93 40v74M104 40v74M115 42v67" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M42 49h76M42 62h76M42 75h76M42 88h76M42 101h76M42 114h76" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M43 37c13 8 24-3 37 2 13 4 25-6 37-1" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M57 73c10 8 25 8 35 0M55 91c11 9 31 9 42 0" fill="none" stroke={accent} strokeWidth="2" opacity="0.45" />
            <ellipse cx="80" cy="131" rx="42" ry="6" fill={shadow} />
          </g>
        );
      case 'filter-paper':
        return (
          <g>
            <circle cx="80" cy="81" r="44" fill="#f8fafc" stroke={outline} strokeWidth="2.2" />
            <circle cx="80" cy="81" r="37" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M48 59c12 8 26 10 39 5 11-4 20-2 27 2" fill="none" stroke={accent} strokeWidth="2" opacity="0.35" />
            <path d="M47 93c15-7 31-7 47 1 8 4 15 4 22 2" fill="none" stroke={accent} strokeWidth="2" opacity="0.24" />
            <path d="M62 44c6 17 10 35 9 57M93 43c-4 18-7 35-4 58" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.65" />
            <circle cx="80" cy="81" r="7" fill={accent} opacity="0.5" />
            <path d="M80 81l21 23" stroke={dark} strokeWidth="1.2" opacity="0.35" />
          </g>
        );
      case 'chromatography-paper':
        return (
          <g>
            <path d="M49 26h62v111H49z" fill="#f8fafc" stroke={outline} strokeWidth="2.2" />
            <path d="M53 31h54v101H53z" fill="#f1f5f9" />
            <path d="M56 121h48" stroke={accent} strokeWidth="3" opacity="0.7" />
            <circle cx="80" cy="88" r="9" fill="#0f172a" opacity="0.65" />
            <circle cx="80" cy="73" r="7" fill="#ef4444" opacity="0.7" />
            <circle cx="72" cy="66" r="5" fill="#2563eb" opacity="0.65" />
            <circle cx="87" cy="63" r="4" fill="#f59e0b" opacity="0.7" />
            <path d="M50 116h60" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" />
            <text x="80" y="43" textAnchor="middle" fontSize="7" fill={dark}>solvent front</text>
            <path d="M74 28h12v5H74z" fill={dark} opacity="0.7" />
          </g>
        );
      case 'capillary-tube':
        return (
          <g>
            <path d="M76 37h8v82c0 5-8 5-8 0z" fill={glass} stroke={outline} strokeWidth="1.8" />
            <path d="M78 88h4v31h-4z" fill={accent} opacity="0.72" />
            <path d="M70 34h20" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M78 45v33" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M64 122h32" stroke={dark} strokeWidth="2" strokeLinecap="round" />
            <path d="M80 22c-9 9-9 18 0 24 9-6 9-15 0-24z" fill={accent} opacity="0.75" />
            <text x="80" y="140" textAnchor="middle" fontSize="7" fill={dark}>capillary action</text>
          </g>
        );
      case 'sieve':
        return (
          <g>
            <ellipse cx="80" cy="52" rx="45" ry="12" fill={metal} stroke={dark} strokeWidth="2.4" />
            <path d="M35 52v45c0 7 20 12 45 12s45-5 45-12V52" fill={metal} stroke={dark} strokeWidth="2.4" />
            <ellipse cx="80" cy="47" rx="42" ry="9" fill="#f1f5f9" stroke={outline} strokeWidth="1.5" />
            <g fill={dark} opacity="0.65">
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 9 }).map((__, col) => (
                  <circle key={`${row}-${col}`} cx={46 + col * 8.5} cy={43 + row * 3.8} r="1.1" />
                ))
              )}
            </g>
            <path d="M44 58c13 5 59 5 72-1" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" />
            <path d="M55 100c7 7 43 7 50 0" fill="none" stroke={accent} strokeWidth="2" opacity="0.45" />
            <ellipse cx="80" cy="124" rx="44" ry="6" fill={shadow} />
          </g>
        );
      case 'eureka-can':
        return (
          <g>
            <path d="M40 50h76v68c0 8-7 14-15 14H55c-8 0-15-6-15-14z" fill={metal} stroke={dark} strokeWidth="2.3" />
            <ellipse cx="78" cy="50" rx="38" ry="9" fill="#f1f5f9" stroke={dark} strokeWidth="2" />
            <path d="M95 58h20v30c0 5-4 8-8 8s-8-3-8-8z" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M47 65v45" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <path d="M86 58h12" stroke={accent} strokeWidth="3" strokeLinecap="round" />
            <path d="M113 101v12" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.72" />
            <ellipse cx="78" cy="138" rx="42" ry="5" fill={shadow} />
          </g>
        );
      case 'microscope':
        return (
          <g>
            <path d="M51 132h58v9H51z" fill="#0f172a" />
            <path d="M66 132c-6-24 2-55 22-75l20 20c-15 14-18 36-14 55z" fill={metal} stroke={dark} strokeWidth="2" />
            <rect x="84" y="37" width="18" height="60" rx="7" fill="#475569" stroke="#1e293b" strokeWidth="2" transform="rotate(10 84 37)" />
            <path d="M92 36l10-18 13 7-10 18z" fill="#1e293b" />
            <path d="M98 93h18v15H98z" fill={dark} />
            <circle cx="107" cy="108" r="7" fill={accent} opacity="0.75" />
            <path d="M60 108h44v10H60z" fill="#e2e8f0" stroke={outline} strokeWidth="2" />
            <circle cx="82" cy="112" r="8" fill={glass} stroke={outline} strokeWidth="1.8" />
            <path d="M75 123l14 9M89 123l-14 9" stroke={dark} strokeWidth="2" />
            <rect x="56" y="119" width="52" height="5" rx="2" fill={metal} />
            <path d="M92 48h8" stroke="#ffffff" strokeWidth="2" opacity="0.55" />
          </g>
        );
      case 'glass-slide':
      case 'prepared-slide':
        return (
          <g>
            <rect x="27" y="68" width="106" height="28" rx="3" fill="#e0f2fe" stroke={outline} strokeWidth="2" />
            <rect x="27" y="63" width="106" height="5" rx="2" fill="#ffffff" opacity="0.55" />
            <circle cx="71" cy="82" r="10" fill={accent} opacity="0.28" />
            <rect x="62" y="73" width="18" height="18" fill="none" stroke={outline} strokeWidth="1.2" />
            {visual === 'prepared-slide' ? (
              <g fill={accent}>
                <circle cx="68" cy="79" r="2.2" /><circle cx="75" cy="86" r="1.8" /><circle cx="77" cy="77" r="1.3" />
              </g>
            ) : (
              <path d="M66 82h10M71 77v10" stroke={accent} strokeWidth="1.4" opacity="0.65" />
            )}
            <text x="112" y="78" textAnchor="middle" fontSize="6" fill={dark}>slide</text>
            {visual === 'prepared-slide' && <path d="M89 73h9v18h-9z" fill="#ffffff" opacity="0.65" stroke={outline} strokeWidth="1" />}
            <ellipse cx="80" cy="104" rx="49" ry="5" fill={shadow} />
          </g>
        );
      case 'hand-lens':
        return (
          <g>
            <circle cx="72" cy="70" r="34" fill={glass} stroke={dark} strokeWidth="5" />
            <circle cx="72" cy="70" r="27" fill={accent} opacity="0.18" stroke="#ffffff" strokeWidth="2" />
            <path d="M53 57c8-11 20-14 31-10" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            <path d="M91 97l30 31" stroke={metal} strokeWidth="13" strokeLinecap="round" />
            <path d="M91 97l30 31" stroke={dark} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
            <circle cx="72" cy="70" r="7" fill={accent} opacity="0.55" />
            <path d="M59 69h26M72 56v26" stroke={accent} strokeWidth="1" opacity="0.55" />
          </g>
        );
      case 'stroboscope':
        return (
          <g>
            <rect x="45" y="45" width="70" height="78" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="80" cy="79" r="27" fill="#0f172a" stroke={steel} strokeWidth="3" />
            <circle cx="80" cy="79" r="20" fill={accent} opacity="0.12" />
            {Array.from({ length: 8 }).map((_, index) => (
              <path key={index} d="M80 60v10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${index * 45} 80 79)`} />
            ))}
            <circle cx="80" cy="79" r="6" fill={accent} />
            <rect x="56" y="111" width="48" height="6" rx="3" fill={steel} />
            <circle cx="112" cy="55" r="4" fill="#22c55e" />
            <path d="M51 132h58" stroke={dark} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'ripple-tank':
        return (
          <g>
            <path d="M28 64h104v54H28z" fill={glass} stroke={dark} strokeWidth="3" />
            <path d="M36 80c8-5 16 5 24 0s16 5 24 0 16 5 24 0 12 5 18 0v30H36z" fill={liquid} opacity="0.48" />
            <path d="M36 91c8-4 16 4 24 0s16 4 24 0 16 4 24 0 12 4 18 0M36 101c8-4 16 4 24 0s16 4 24 0 16 4 24 0 12 4 18 0" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.6" />
            <path d="M49 121v9M111 121v9M35 130h90" stroke={metal} strokeWidth="6" strokeLinecap="round" />
            <path d="M66 49v15" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <circle cx="66" cy="45" r="7" fill={accent} />
            <path d="M76 41h22v5H76z" fill={metal} stroke={dark} strokeWidth="1.4" />
            <path d="M104 46c8 4 8 12 0 16" fill="none" stroke={accent} strokeWidth="2" />
          </g>
        );
      case 'forceps':
        return (
          <g>
            <path d="M52 35l18 60 7 37 7-3-5-37-7-60z" fill={metal} stroke={dark} strokeWidth="2" strokeLinejoin="round" />
            <path d="M108 35L90 95l-7 37-7-3 5-37 7-60z" fill={metal} stroke={dark} strokeWidth="2" strokeLinejoin="round" />
            <path d="M62 41l12 42" stroke={shine} strokeWidth="2" strokeLinecap="round" />
            <path d="M98 41L86 83" stroke={shine} strokeWidth="2" strokeLinecap="round" />
            <path d="M73 101h14" stroke={dark} strokeWidth="1.4" opacity="0.55" />
            <path d="M57 35h12M91 35h12" stroke={dark} strokeWidth="2" />
          </g>
        );
      case 'scalpel':
        return (
          <g>
            <path d="M44 116l-8 12 10 4 14-10z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <rect x="55" y="101" width="54" height="18" rx="5" fill={dark} transform="rotate(-38 55 101)" />
            <path d="M94 52l23 23-14 14L80 66z" fill={steel} stroke={outline} strokeWidth="2" />
            <path d="M94 52l23 23-6 6-23-23z" fill="#f8fafc" />
            <path d="M101 61l11 11" stroke={shine} strokeWidth="2" strokeLinecap="round" />
            <path d="M69 89l13 13" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          </g>
        );
      case 'mounted-needle':
        return (
          <g>
            <rect x="42" y="96" width="53" height="13" rx="6" fill={wood} stroke="#78350f" strokeWidth="2" transform="rotate(-22 42 96)" />
            <path d="M89 92l40-51" stroke={metal} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M129 41l7-9" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M94 87l32-40" stroke={shine} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M57 98l12-5" stroke="#ffffff" strokeWidth="2" opacity="0.35" />
            <circle cx="121" cy="50" r="3" fill={accent} opacity="0.55" />
          </g>
        );
      case 'cork-borer':
        return (
          <g>
            <path d="M66 35h28v79c0 8-6 14-14 14s-14-6-14-14z" fill={metal} stroke={dark} strokeWidth="2.2" />
            <ellipse cx="80" cy="35" rx="14" ry="5" fill="#f1f5f9" stroke={dark} strokeWidth="2" />
            <ellipse cx="80" cy="35" rx="8" ry="2.4" fill={dark} opacity="0.55" />
            <rect x="70" y="20" width="20" height="15" rx="4" fill={wood} stroke="#78350f" strokeWidth="2" />
            <path d="M72 48v55" stroke={shine} strokeWidth="4" strokeLinecap="round" />
            <path d="M61 118h38" stroke={dark} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="49" cy="117" r="13" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <circle cx="49" cy="117" r="6" fill="#92400e" />
            <ellipse cx="80" cy="136" rx="37" ry="5" fill={shadow} />
          </g>
        );
      case 'spatula':
        return (
          <g>
            <path d="M34 111l71-66" stroke={metal} strokeWidth="5" strokeLinecap="round" />
            <path d="M34 111l71-66" stroke={dark} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
            <path d="M103 49l16-15 9 9-16 15z" fill={steel} stroke={outline} strokeWidth="2" />
            <path d="M112 38l8 8" stroke={shine} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M30 114c-7 5-6 12 3 14l14-13-8-8z" fill={wood} stroke="#78350f" strokeWidth="1.8" />
            <circle cx="129" cy="30" r="4" fill={accent} opacity="0.45" />
          </g>
        );
      case 'weighing-boat':
        return (
          <g>
            <path d="M40 75h80l-8 48H48z" fill="#f8fafc" stroke={outline} strokeWidth="2.2" />
            <path d="M43 91h74l-5 27H48z" fill="#e2e8f0" opacity="0.6" />
            <path d="M57 88c8-8 16 4 24-3s17 5 26-2" fill="none" stroke={accent} strokeWidth="2" opacity="0.55" />
            <path d="M38 72h84" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M48 80l-6 43M112 80l6 43" stroke={outline} strokeWidth="1.5" opacity="0.65" />
            <text x="80" y="110" textAnchor="middle" fontSize="7" fill={dark}>2.50 g</text>
            <ellipse cx="80" cy="130" rx="38" ry="5" fill={shadow} />
          </g>
        );
      case 'syringe':
        return (
          <g>
            <rect x="41" y="66" width="78" height="24" rx="4" fill={glass} stroke={outline} strokeWidth="2" />
            <rect x="48" y="70" width="53" height="16" fill={liquid} opacity="0.55" />
            <rect x="96" y="62" width="10" height="32" rx="3" fill={dark} />
            <path d="M119 78h16M126 67v22" stroke={outline} strokeWidth="4" strokeLinecap="round" />
            <path d="M41 78H26M31 69v18" stroke={outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M52 66v24M60 66v24M68 66v24M76 66v24M84 66v24M92 66v24" stroke={dark} strokeWidth="1" opacity="0.55" />
            <path d="M31 33h4v55h-4z" stroke={outline} strokeWidth="2" opacity="0.28" />
            <text x="72" y="60" textAnchor="middle" fontSize="6.5" fill={dark}>100 cm³</text>
          </g>
        );
      case 'delivery-tube':
        return (
          <g>
            <path d="M38 32h18v22c0 9 7 13 16 13h26c10 0 17 7 17 17v31" fill="none" stroke={glass} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 32h18v22c0 9 7 13 16 13h26c10 0 17 7 17 17v31" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
            <path d="M45 33v20c0 9 7 13 16 13" fill="none" stroke={shine} strokeWidth="3" strokeLinecap="round" />
            <rect x="31" y="22" width="32" height="12" rx="5" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <path d="M115 119v13" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="115" cy="135" r="3.5" fill={accent} opacity="0.7" />
            <path d="M34 44h10" stroke={dark} strokeWidth="1.4" opacity="0.55" />
          </g>
        );
      case 'thread':
        return (
          <g>
            <ellipse cx="71" cy="82" rx="30" ry="31" fill="none" stroke="#e2e8f0" strokeWidth="14" />
            <ellipse cx="71" cy="82" rx="30" ry="31" fill="none" stroke={accent} strokeWidth="2" opacity="0.45" />
            <path d="M71 51c18 3 25 19 21 34-4 14-18 22-31 17" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
            <path d="M99 98c12 9 22 20 31 33" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M71 31v-9" stroke={outline} strokeWidth="2" />
            <circle cx="71" cy="20" r="3" fill={dark} />
            <path d="M43 82h58M71 51v62" stroke={outline} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          </g>
        );
      case 'cotton-wool':
        return (
          <g>
            <path d="M41 107c-18-13 1-31 18-24 3-18 27-23 37-8 17-7 31 12 21 27 13 14-3 33-20 28-11 14-33 9-35-7-9 3-17-2-21-16z" fill="#f8fafc" stroke={outline} strokeWidth="2.2" />
            <path d="M53 88c7-8 18-8 24-1M77 79c8-6 19-1 20 8M98 95c8 1 12 8 8 15M58 111c7 5 17 4 22-2" fill="none" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M45 95c4-8 11-11 18-10" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="80" cy="132" rx="41" ry="6" fill={shadow} />
          </g>
        );
      case 'rubber-bung':
        return (
          <g>
            <path d="M55 60h50v17c0 6-4 9-9 9h-3v36c0 7-21 7-21 0V86h-3c-9 0-14-5-14-11z" fill="#92400e" stroke="#78350f" strokeWidth="2.2" />
            <ellipse cx="80" cy="61" rx="25" ry="9" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <path d="M66 63h28v15c0 4-4 6-8 6H74c-4 0-8-2-8-6z" fill="#451a03" opacity="0.55" />
            <path d="M70 64h8M82 64h8" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            <path d="M67 90v25" stroke="#b45309" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="80" cy="127" rx="33" ry="5" fill={shadow} />
          </g>
        );
      case 'labels':
        return (
          <g>
            <rect x="38" y="43" width="58" height="75" rx="3" fill="#f8fafc" stroke={outline} strokeWidth="2" transform="rotate(-6 38 43)" />
            <rect x="62" y="42" width="58" height="75" rx="3" fill="#ffffff" stroke={outline} strokeWidth="2" transform="rotate(5 62 42)" />
            <path d="M51 60h34M51 71h28M51 82h32M51 93h22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" transform="rotate(-6 38 43)" />
            <path d="M75 59h34M75 70h26M75 81h32" stroke={dark} strokeWidth="2" strokeLinecap="round" transform="rotate(5 62 42)" />
            <path d="M72 46l22-6 4 15-22 6z" fill={accent} opacity="0.55" />
            <circle cx="106" cy="112" r="9" fill={accent} opacity="0.4" />
          </g>
        );
      case 'pen':
        return (
          <g>
            <path d="M46 127l-8 12 14-2 12-12z" fill={dark} />
            <path d="M51 119l-9 11 7 7 52-79-7-7z" fill={accent} stroke={outline} strokeWidth="1.5" />
            <path d="M94 58l9-12 7 7-9 12z" fill="#e2e8f0" stroke={outline} strokeWidth="1.5" />
            <path d="M105 39l7-9 8 8-8 8z" fill={metal} stroke={dark} strokeWidth="1.5" />
            <path d="M55 116l46-70" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            <path d="M35 142h89" stroke={accent} strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />
          </g>
        );
      case 'calculator':
        return (
          <g>
            <rect x="42" y="28" width="76" height="111" rx="9" fill="#334155" stroke="#1e293b" strokeWidth="2.5" />
            <rect x="51" y="38" width="58" height="25" rx="3" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="1.5" />
            <text x="102" y="55" textAnchor="end" fontSize="11" fontFamily="monospace" fontWeight="700" fill="#065f46">0.035</text>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect key={`${row}-${col}`} x={53 + col * 15} y={74 + row * 14} width="11" height="9" rx="2" fill={row === 0 && col === 3 ? accent : '#94a3b8'} />
              ))
            )}
            <rect x="53" y="130" width="56" height="5" rx="2" fill="#0f172a" />
            <circle cx="108" cy="124" r="4" fill="#22c55e" />
          </g>
        );
      case 'potato':
        return (
          <g>
            <ellipse cx="80" cy="88" rx="44" ry="31" fill="#d97706" stroke="#92400e" strokeWidth="2.4" transform="rotate(-16 80 88)" />
            <ellipse cx="81" cy="86" rx="36" ry="22" fill="#f59e0b" opacity="0.65" transform="rotate(-16 80 88)" />
            <circle cx="65" cy="78" r="4" fill="#92400e" opacity="0.6" />
            <circle cx="88" cy="93" r="3" fill="#92400e" opacity="0.55" />
            <circle cx="99" cy="76" r="2.5" fill="#92400e" opacity="0.55" />
            <path d="M50 98c8 8 25 14 43 10" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            {[
              [40, 60], [118, 68], [70, 119], [103, 113],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <rect x={x} y={y} width="16" height="11" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" transform={`rotate(${x % 2 ? 14 : -12} ${x} ${y})`} />
              </g>
            ))}
            <ellipse cx="80" cy="128" rx="45" ry="6" fill={shadow} />
          </g>
        );
      case 'onion':
        return (
          <g>
            <path d="M80 39c27 11 43 34 39 57-4 24-22 36-39 36S45 120 41 96c-4-23 12-46 39-57z" fill="#fef3c7" stroke="#d97706" strokeWidth="2.4" />
            <path d="M80 48c19 12 30 29 27 49-2 17-13 27-27 30-14-3-25-13-27-30-3-20 8-37 27-49z" fill="#fde68a" opacity="0.65" />
            <path d="M80 39c-2-11 1-18 7-25M80 39c-6-10-12-14-20-17M80 39c6-9 13-12 21-14" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
            <path d="M58 91c10 8 34 8 44 0M64 111c8 5 24 5 32 0M70 72c6 4 15 4 21 0" fill="none" stroke="#d97706" strokeWidth="1.6" opacity="0.65" />
            <ellipse cx="80" cy="133" rx="39" ry="5" fill={shadow} />
          </g>
        );
      case 'leaf':
        return (
          <g>
            <path d="M34 111C45 58 79 29 127 31c-4 48-31 85-93 80z" fill="#16a34a" stroke="#166534" strokeWidth="2.4" />
            <path d="M34 111C58 90 84 68 119 41" fill="none" stroke="#14532d" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M58 92l-4-19M72 81l-1-23M87 69l3-20M101 57l7-17M53 103l21 4M69 92l22 2M87 80l21 0" stroke="#166534" strokeWidth="1.5" opacity="0.75" />
            <path d="M44 103c20-14 40-29 65-49" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
            <circle cx="107" cy="46" r="4" fill={accent} opacity="0.45" />
          </g>
        );
      case 'pondweed':
        return (
          <g>
            <path d="M42 132h76v10H42z" fill="#92400e" opacity="0.35" />
            <path d="M62 127c-10-28-5-57 3-87M84 127c9-28 4-58-4-85M101 127c-3-24 2-47 9-70" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
            {[
              [56, 49], [69, 43], [57, 72], [72, 65], [89, 45], [94, 72], [83, 92], [108, 74], [105, 99], [68, 102],
            ].map(([x, y]) => (
              <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="10" ry="3.2" fill="#22c55e" opacity="0.82" transform={`rotate(${x % 2 ? -28 : 26} ${x} ${y})`} />
            ))}
            <circle cx="75" cy="26" r="2.2" fill="#ffffff" opacity="0.8" />
            <circle cx="82" cy="19" r="1.8" fill="#ffffff" opacity="0.7" />
            <circle cx="69" cy="15" r="1.4" fill="#ffffff" opacity="0.6" />
          </g>
        );
      case 'germinating-seeds':
        return (
          <g>
            <ellipse cx="78" cy="105" rx="36" ry="16" fill="#92400e" opacity="0.3" />
            {[[55, 91], [78, 95], [99, 89]].map(([x, y], index) => (
              <g key={x}>
                <ellipse cx={x} cy={y} rx="13" ry="9" fill={index === 1 ? '#a16207' : '#854d0e'} stroke="#713f12" strokeWidth="1.7" transform={`rotate(${index * 18 - 15} ${x} ${y})`} />
                <path d={`M${x} ${y - 7}c${index === 1 ? -7 : 6}-15 ${index === 1 ? 8 : -9}-22 ${index === 1 ? 13 : -4}-30`} fill="none" stroke="#65a30d" strokeWidth="2.6" strokeLinecap="round" />
                <ellipse cx={x + (index === 1 ? 11 : -3)} cy={y - (index === 1 ? 33 : 27)} rx="7" ry="4" fill="#84cc16" transform={`rotate(${index === 1 ? -25 : 20} ${x + (index === 1 ? 11 : -3)} ${y - (index === 1 ? 33 : 27)})`} />
              </g>
            ))}
            <path d="M52 118c17 5 35 5 52 0" fill="none" stroke="#a16207" strokeWidth="2" opacity="0.6" />
          </g>
        );
      case 'potted-plant':
        return (
          <g>
            <path d="M49 92h62l-8 43H57z" fill="#b45309" stroke="#78350f" strokeWidth="2.4" />
            <path d="M45 88h70v10H45z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <path d="M80 88V63" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 70C66 70 54 60 51 44c15 0 26 8 29 21M80 62c12-2 22-13 23-28-14 1-22 10-23 22M80 54c-7-9-7-22-1-33 7 10 8 22 1 33z" fill="#22c55e" stroke="#15803d" strokeWidth="1.8" />
            <path d="M80 74c8-4 17-2 22 4-6 7-16 7-22 1zM80 80c-8-3-17 0-21 6 6 7 16 6 21 0z" fill="#16a34a" stroke="#166534" strokeWidth="1.4" />
            <path d="M61 112h38M60 124h40" stroke="#fbbf24" strokeWidth="2" opacity="0.45" />
            <ellipse cx="80" cy="140" rx="42" ry="5" fill={shadow} />
          </g>
        );
      case 'food-sample':
        return (
          <g>
            <ellipse cx="80" cy="96" rx="43" ry="24" fill="#f8fafc" stroke={outline} strokeWidth="2.4" />
            <ellipse cx="80" cy="92" rx="34" ry="18" fill="#fde68a" opacity="0.8" />
            <path d="M52 91c8-11 21-15 31-8 7-8 19-6 24 3-5 13-17 20-29 16-10 6-21 2-26-11z" fill="#d97706" opacity="0.72" />
            <circle cx="67" cy="86" r="4" fill="#fbbf24" /><circle cx="91" cy="94" r="3" fill="#f59e0b" />
            <path d="M46 82c7 3 12 10 13 19" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <ellipse cx="80" cy="126" rx="42" ry="5" fill={shadow} />
            <path d="M103 63h15v15h-15z" fill="#ffffff" stroke={outline} strokeWidth="1.6" />
            <text x="110" y="73" textAnchor="middle" fontSize="6" fill={dark}>food</text>
          </g>
        );
      case 'soil-sample':
        return (
          <g>
            <path d="M39 81h82v43c0 9-8 15-17 15H56c-9 0-17-6-17-15z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M44 95h72v28c0 6-5 10-11 10H55c-6 0-11-4-11-10z" fill="#78350f" opacity="0.82" />
            <path d="M44 101c14-8 25 3 38-3 12-6 23 4 34-2v14c-13 5-23-2-35 3-12 4-24-5-37-1z" fill="#92400e" opacity="0.75" />
            <path d="M39 79h82" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="61" cy="109" r="3" fill="#d97706" /><circle cx="94" cy="115" r="2.5" fill="#a16207" /><circle cx="78" cy="104" r="2" fill="#fbbf24" />
            <text x="80" y="72" textAnchor="middle" fontSize="7" fill={dark}>soil sample</text>
          </g>
        );
      case 'crop-plot':
        return (
          <g>
            <path d="M30 111h100v22H30z" fill="#78350f" opacity="0.55" />
            <path d="M39 106c2-20 4-41 8-65M60 106c2-22 3-43 6-65M82 106c-1-22 1-44 4-65M103 106c0-22 2-44 6-65M121 106c-1-21 1-42 4-63" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
            {[45, 66, 88, 109, 125].map((x, index) => (
              <g key={x} fill="#facc15" stroke="#a16207" strokeWidth="1">
                <ellipse cx={x} cy={49 + index * 2} rx="3" ry="7" transform={`rotate(${index % 2 ? 18 : -18} ${x} ${49 + index * 2})`} />
                <ellipse cx={x - 5} cy={60 + index * 2} rx="3" ry="6" transform={`rotate(${index % 2 ? -28 : 28} ${x - 5} ${60 + index * 2})`} />
                <ellipse cx={x + 5} cy={72 + index * 2} rx="3" ry="6" transform={`rotate(${index % 2 ? 32 : -32} ${x + 5} ${72 + index * 2})`} />
              </g>
            ))}
            <path d="M28 106h104" stroke="#92400e" strokeWidth="2" />
          </g>
        );
      case 'sucrose-solutions':
        return (
          <g>
            {[43, 67, 91, 115].map((x, index) => (
              <g key={x}>
                <path d={`M${x} 51h17v67c0 5-4 9-8.5 9S${x} 123 ${x} 118z`} fill={glass} stroke={outline} strokeWidth="1.7" />
                <path d={`M${x + 2.5} ${83 + index * 6}h12v35c0 3.4-2.7 6-6 6s-6-2.6-6-6z`} fill={accent} opacity={0.42 + index * 0.12} />
                <rect x={x - 1} y="44" width="19" height="8" rx="2" fill={dark} />
                <text x={x + 8.5} y="73" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={dark}>{index * 0.2}</text>
                <text x={x + 8.5} y="80" textAnchor="middle" fontSize="4.5" fill={dark}>mol/dm³</text>
              </g>
            ))}
            <ellipse cx="80" cy="135" rx="45" ry="5" fill={shadow} />
          </g>
        );
      case 'iron-nails':
        return (
          <g>
            {[52, 68, 84, 100].map((x, index) => (
              <g key={x} transform={`rotate(${index % 2 ? 9 : -7} ${x} 86)`}>
                <rect x={x} y="48" width="8" height="65" rx="2" fill={metal} stroke={dark} strokeWidth="1.4" />
                <path d={`M${x - 5} 48h18l-4 8H${x - 1}z`} fill={steel} stroke={dark} strokeWidth="1.3" />
                <path d={`M${x + 2} 58v48`} stroke="#ffffff" strokeWidth="1.6" opacity="0.6" />
                {index > 1 && <circle cx={x + 10} cy={80 + index * 3} r="3.2" fill="#b45309" opacity="0.72" />}
                {index > 2 && <circle cx={x - 3} cy={64} r="2.4" fill="#92400e" opacity="0.65" />}
              </g>
            ))}
            <ellipse cx="80" cy="127" rx="45" ry="6" fill={shadow} />
          </g>
        );
      case 'ticker-timer':
        return (
          <g>
            <rect x="38" y="45" width="84" height="57" rx="7" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
            <circle cx="61" cy="74" r="15" fill="#0f172a" stroke={steel} strokeWidth="2" />
            <circle cx="61" cy="74" r="4" fill={accent} />
            <path d="M61 63v7M61 78v4M50 74h6M66 74h5" stroke={steel} strokeWidth="1.5" />
            <rect x="83" y="59" width="27" height="11" rx="3" fill="#0f172a" />
            <circle cx="108" cy="64" r="3" fill="#22c55e" />
            <path d="M42 102h76" stroke={metal} strokeWidth="6" strokeLinecap="round" />
            <path d="M49 102v25M111 102v25M35 129h90" stroke={dark} strokeWidth="4" strokeLinecap="round" />
            <path d="M87 114c10-3 18 1 23 8" fill="none" stroke={accent} strokeWidth="1.6" strokeDasharray="4 3" />
            <text x="80" y="86" textAnchor="middle" fontSize="6" fill={steel}>50 Hz</text>
          </g>
        );
      case 'ticker-tape':
        return (
          <g>
            <path d="M30 48c18-9 23 16 39 7 17-9 21 13 36 5 11-6 16 4 25 0v58c-15 6-23-4-34 2-15 8-20-12-35-4-16 9-22-14-31-5z" fill="#f8fafc" stroke={outline} strokeWidth="2" />
            <g fill={dark}>
              {[40, 48, 57, 67, 78, 90, 103, 117].map((x, index) => (
                <circle key={x} cx={x} cy={78 + Math.sin(index) * 3} r="1.8" />
              ))}
            </g>
            <path d="M35 94c26 8 56 7 88-2" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            <path d="M35 106h90M35 114h90" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
          </g>
        );
      case 'carbon-disc':
        return (
          <g>
            <circle cx="80" cy="82" r="45" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <circle cx="80" cy="82" r="36" fill="#334155" stroke="#475569" strokeWidth="2" />
            <circle cx="80" cy="82" r="8" fill="#0f172a" stroke={steel} strokeWidth="1.5" />
            <path d="M80 45v17M80 102v17M43 82h17M100 82h17" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M54 56l11 11M95 97l11 11M106 56L95 67M65 97l-11 11" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="80" y="84" textAnchor="middle" fontSize="6" fill={accent}>C</text>
            <circle cx="80" cy="82" r="45" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" strokeDasharray="3 4" />
          </g>
        );
      case 'trolley':
        return (
          <g>
            <path d="M41 78h78v35H41z" fill="#dc2626" stroke="#991b1b" strokeWidth="2.3" />
            <path d="M49 64h62l9 14H40z" fill="#ef4444" stroke="#991b1b" strokeWidth="2.3" />
            <rect x="49" y="68" width="26" height="8" rx="2" fill="#fecaca" opacity="0.55" />
            <circle cx="54" cy="117" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="106" cy="117" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="54" cy="117" r="3.5" fill={steel} /><circle cx="106" cy="117" r="3.5" fill={steel} />
            <path d="M40 88h80" stroke="#ffffff" strokeWidth="2" opacity="0.35" />
            <path d="M119 87h13" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <path d="M128 84l8 3-8 3z" fill={accent} />
            <ellipse cx="80" cy="132" rx="49" ry="5" fill={shadow} />
          </g>
        );
      case 'runway':
        return (
          <g>
            <path d="M27 96l108-25 6 18-108 25z" fill={wood} stroke="#78350f" strokeWidth="2.2" />
            <path d="M35 96l98-22M31 103l103-24" stroke="#fbbf24" strokeWidth="1.3" opacity="0.55" />
            <path d="M44 91v22M120 77v22" stroke={dark} strokeWidth="2.2" />
            <path d="M49 104l-7 17M116 87l-7 17" stroke={metal} strokeWidth="4" strokeLinecap="round" />
            <path d="M52 88h24" stroke={accent} strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
            <text x="82" y="120" textAnchor="middle" fontSize="6" fill={dark}>runway</text>
          </g>
        );
      case 'adhesive-tape':
        return (
          <g>
            <circle cx="82" cy="81" r="42" fill="#f8fafc" stroke={outline} strokeWidth="2.5" />
            <circle cx="82" cy="81" r="29" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="82" cy="81" r="15" fill="#ffffff" stroke={outline} strokeWidth="2" />
            <path d="M82 39c10-2 18 5 19 15" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <path d="M82 123c-10 2-18-5-19-15" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <path d="M82 39c10-2 18 5 19 15" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M40 81h-9" stroke={dark} strokeWidth="2" strokeLinecap="round" />
            <path d="M28 77l8 4-8 4z" fill={accent} />
          </g>
        );
      case 'graph-paper':
        return (
          <g>
            <rect x="35" y="34" width="90" height="94" rx="2" fill="#f8fafc" stroke={outline} strokeWidth="2" />
            <g stroke="#bfdbfe" strokeWidth="0.8">
              {Array.from({ length: 10 }).map((_, index) => (
                <path key={`v-${index}`} d={`M${44 + index * 8} 34v94`} />
              ))}
              {Array.from({ length: 11 }).map((_, index) => (
                <path key={`h-${index}`} d={`M35 ${42 + index * 8}h90`} />
              ))}
            </g>
            <path d="M44 117L119 48" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
            {[55, 70, 85, 100].map((x, index) => (
              <circle key={x} cx={x} cy={108 - index * 15} r="2.5" fill="#0f172a" />
            ))}
            <path d="M35 128h90" stroke={dark} strokeWidth="1.5" />
            <path d="M35 34v94" stroke={dark} strokeWidth="1.5" />
            <text x="112" y="124" textAnchor="middle" fontSize="6" fill={dark}>x</text>
            <text x="40" y="43" textAnchor="middle" fontSize="6" fill={dark}>y</text>
          </g>
        );
      case 'power-supply':
        return (
          <g>
            <rect x="35" y="50" width="90" height="63" rx="8" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="45" y="61" width="41" height="20" rx="3" fill="#0f172a" />
            <text x="65" y="75" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent}>12.0 V</text>
            <circle cx="99" cy="71" r="9" fill="#1e293b" stroke={steel} strokeWidth="2" />
            <path d="M99 63v8l5 4" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
            <rect x="48" y="90" width="20" height="7" rx="3" fill={accent} opacity="0.7" />
            <rect x="76" y="90" width="20" height="7" rx="3" fill="#475569" />
            <circle cx="111" cy="94" r="4" fill="#ef4444" />
            <circle cx="48" cy="122" r="4" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="112" cy="122" r="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <path d="M48 113v5M112 113v5M48 126v5M112 126v5" stroke={dark} strokeWidth="2" />
            <ellipse cx="80" cy="139" rx="45" ry="5" fill={shadow} />
          </g>
        );
      case 'connecting-wires':
        return (
          <g>
            <path d="M34 63c17-17 31 9 46 4 13-4 15-15 27-11 11 4 8 18 18 18" fill="none" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
            <path d="M34 93c17-17 31 9 46 4 13-4 15-15 27-11 11 4 8 18 18 18" fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
            <path d="M34 123c17-17 31 9 46 4 13-4 15-15 27-11 11 4 8 18 18 18" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
            <g fill={metal} stroke={dark} strokeWidth="1.5">
              <rect x="26" y="57" width="13" height="12" rx="3" /><rect x="121" y="68" width="13" height="12" rx="3" />
              <rect x="26" y="87" width="13" height="12" rx="3" /><rect x="121" y="98" width="13" height="12" rx="3" />
              <rect x="26" y="117" width="13" height="12" rx="3" /><rect x="121" y="128" width="13" height="12" rx="3" />
            </g>
          </g>
        );
      case 'ammeter':
      case 'voltmeter':
        return (
          <g>
            <rect x="38" y="39" width="84" height="84" rx="10" fill="#f8fafc" stroke={dark} strokeWidth="2.5" />
            <circle cx="80" cy="80" r="32" fill="#ffffff" stroke={outline} strokeWidth="2" />
            <path d="M53 92c4-19 15-30 27-30s23 11 27 30" fill="none" stroke={accent} strokeWidth="2.2" />
            <path d="M80 80l15-17" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="80" cy="80" r="4" fill={dark} />
            <text x="80" y="58" textAnchor="middle" fontSize="15" fontWeight="700" fill={dark}>{visual === 'ammeter' ? 'A' : 'V'}</text>
            <circle cx="53" cy="108" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.4" />
            <circle cx="107" cy="108" r="5" fill="#0f172a" stroke="#334155" strokeWidth="1.4" />
            <path d="M53 108h-9M107 108h9" stroke={dark} strokeWidth="1.5" />
            <path d="M80 28v10" stroke={dark} strokeWidth="2" />
            <ellipse cx="80" cy="134" rx="39" ry="5" fill={shadow} />
          </g>
        );
      case 'resistor':
        return (
          <g>
            <path d="M27 81h27M106 81h27" stroke={metal} strokeWidth="4" strokeLinecap="round" />
            <rect x="50" y="65" width="60" height="32" rx="8" fill="#e2e8f0" stroke={dark} strokeWidth="2.2" />
            <path d="M60 65v32M70 65v32M80 65v32M90 65v32M100 65v32" stroke="#94a3b8" strokeWidth="1.6" />
            <path d="M64 73h32" stroke={accent} strokeWidth="2" opacity="0.6" />
            <text x="80" y="87" textAnchor="middle" fontSize="7" fill={dark}>10 Ω</text>
            <path d="M34 72h10M34 76h10M34 80h10" stroke={dark} strokeWidth="1" opacity="0.55" />
            <path d="M80 40v15M76 44l4-4 4 4" fill="none" stroke={accent} strokeWidth="1.6" />
          </g>
        );
      case 'bulb':
        return (
          <g>
            <path d="M62 93c-9-9-14-19-14-31 0-21 15-37 32-37s32 16 32 37c0 12-5 22-14 31z" fill={glass} stroke={outline} strokeWidth="2.3" />
            <path d="M67 91h26l-4 16H71z" fill={accent} opacity="0.18" />
            <path d="M74 106h12v10H74z" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M70 116h20l4 9H66z" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M74 93c-5-10 2-16 0-24M86 93c5-10-2-16 0-24M80 94V69" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M71 70c2-5 6-7 9-8M89 70c-2-5-6-7-9-8" fill="none" stroke="#d97706" strokeWidth="1.8" />
            <circle cx="80" cy="76" r="20" fill={glow} />
            <path d="M58 58c5-11 15-17 25-18" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
            <path d="M72 130h16" stroke={dark} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'switch':
        return (
          <g>
            <rect x="34" y="68" width="92" height="42" rx="7" fill="#f1f5f9" stroke={dark} strokeWidth="2.4" />
            <circle cx="52" cy="89" r="6" fill={metal} stroke={dark} strokeWidth="1.8" />
            <circle cx="108" cy="89" r="6" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M57 87l47-20" stroke={metal} strokeWidth="7" strokeLinecap="round" />
            <path d="M57 87l47-20" stroke={dark} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M38 89h8M114 89h8" stroke={dark} strokeWidth="2" />
            <path d="M67 78h20" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <text x="80" y="102" textAnchor="middle" fontSize="7" fill={dark}>open</text>
            <ellipse cx="80" cy="120" rx="41" ry="5" fill={shadow} />
          </g>
        );
      case 'rheostat':
        return (
          <g>
            <rect x="35" y="81" width="90" height="30" rx="5" fill={wood} stroke="#78350f" strokeWidth="2.2" />
            <path d="M45 81c4-25 13-39 26-39h18c13 0 22 14 26 39" fill="none" stroke="#b45309" strokeWidth="5" />
            <path d="M45 81c4-25 13-39 26-39h18c13 0 22 14 26 39" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7" />
            <path d="M48 63l10 8M112 63l-10 8" stroke={metal} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="80" cy="37" r="8" fill={metal} stroke={dark} strokeWidth="2" />
            <path d="M80 37v32" stroke={dark} strokeWidth="2.2" />
            <path d="M48 91h64M48 97h64" stroke="#fbbf24" strokeWidth="1" opacity="0.55" />
            <path d="M36 111h88" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <circle cx="49" cy="111" r="5" fill={accent} opacity="0.7" />
          </g>
        );
      case 'resistance-wire':
        return (
          <g>
            <path d="M33 87h94" stroke={metal} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M49 87c2-23 8-39 15-39s13 16 15 39M80 87c2-23 8-39 15-39s13 16 15 39" fill="none" stroke="#b45309" strokeWidth="3" />
            <path d="M49 87c2-23 8-39 15-39s13 16 15 39M80 87c2-23 8-39 15-39s13 16 15 39" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.65" />
            <path d="M35 112h90" stroke={wood} strokeWidth="13" strokeLinecap="round" />
            <path d="M46 105v14M114 105v14" stroke={dark} strokeWidth="2" />
            <path d="M44 107h-9M116 107h9" stroke={dark} strokeWidth="2" />
            <text x="80" y="133" textAnchor="middle" fontSize="6.5" fill={dark}>nichrome wire</text>
          </g>
        );
      case 'vibrator':
        return (
          <g>
            <rect x="42" y="72" width="76" height="52" rx="6" fill="#334155" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="51" y="81" width="25" height="16" rx="3" fill="#0f172a" />
            <text x="63" y="92" textAnchor="middle" fontSize="7" fill={accent}>12 V</text>
            <circle cx="98" cy="90" r="10" fill="#1e293b" stroke={steel} strokeWidth="2" />
            <path d="M98 82v8l5 3" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M80 72V55" stroke={dark} strokeWidth="3" />
            <path d="M80 54h19v8H80z" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M99 46c8 0 8 20-6 20" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3 3" />
            <path d="M44 124h72" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="80" cy="134" rx="43" ry="5" fill={shadow} />
          </g>
        );
      case 'slinky':
        return (
          <g>
            <path d="M30 102c8-37 28-50 50-50s42 13 50 50" fill="none" stroke={metal} strokeWidth="3" />
            {Array.from({ length: 16 }).map((_, index) => {
              const x = 31 + index * 6.6;
              const y = 76 + Math.sin((index / 15) * Math.PI) * -24;
              return <ellipse key={index} cx={x} cy={y} rx="3.4" ry="7" fill="none" stroke={index % 4 === 0 ? accent : steel} strokeWidth="2" transform={`rotate(${index * 6 - 48} ${x} ${y})`} />;
            })}
            <path d="M27 105h106" stroke={dark} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <path d="M38 53c4-6 9-10 15-12" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.55" />
          </g>
        );
      case 'rope':
        return (
          <g>
            <path d="M31 65c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
            <path d="M31 65c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            <path d="M31 86c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
            <path d="M31 86c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            <path d="M31 107c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
            <path d="M31 107c14-20 25 20 39 0s25 20 39 0 18 12 20 14" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      case 'wooden-block':
        return (
          <g>
            <path d="M43 72l33-15 49 9-33 15z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <path d="M43 72v37l49 15V81z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <path d="M92 81l33-15v37l-33 15z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <path d="M52 80v19M60 85v19M69 88v19M98 88v19M107 84v19" stroke="#fbbf24" strokeWidth="1.2" opacity="0.4" />
            <path d="M48 76l25-10" stroke="#fde68a" strokeWidth="2" opacity="0.45" />
            <ellipse cx="81" cy="130" rx="43" ry="6" fill={shadow} />
            <text x="76" y="103" textAnchor="middle" fontSize="6" fill="#fde68a" opacity="0.65">l × w × h</text>
          </g>
        );
      case 'slotted-weights':
        return (
          <g>
            {[0, 1, 2, 3, 4].map((index) => (
              <g key={index}>
                <path d={`M48 ${58 + index * 15}h64v11H48z`} fill={index % 2 === 0 ? '#475569' : metal} stroke={dark} strokeWidth="1.8" />
                <path d={`M54 ${58 + index * 15}l12 11h28l12-11z`} fill="#0f172a" opacity="0.35" />
                <rect x="74" y={58 + index * 15} width="12" height="11" fill="#0f172a" />
                <text x="108" y={66 + index * 15} textAnchor="middle" fontSize="5.5" fill="#f8fafc">{['100 g', '50 g', '50 g', '20 g', '20 g'][index]}</text>
              </g>
            ))}
            <path d="M80 49v-12" stroke={dark} strokeWidth="2.4" />
            <circle cx="80" cy="33" r="5" fill="none" stroke={metal} strokeWidth="2" />
            <ellipse cx="80" cy="136" rx="37" ry="5" fill={shadow} />
          </g>
        );
      case 'surfaces':
        return (
          <g>
            <path d="M36 118l22-15 68 8-22 14z" fill={wood} stroke="#78350f" strokeWidth="2" />
            <path d="M36 118v8l68 7v-8z" fill="#92400e" stroke="#78350f" strokeWidth="1.4" />
            <path d="M47 99l20-11 64 7-20 12z" fill="#cbd5e1" stroke={outline} strokeWidth="2" />
            <path d="M47 99v7l64 7v-7z" fill="#94a3b8" stroke={outline} strokeWidth="1.4" />
            <path d="M58 82l18-9 57 6-18 10z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <path d="M58 82v6l57 7v-6z" fill="#451a03" />
            <path d="M62 91l8-4M49 106l9-5M39 121l12-8" stroke="#fbbf24" strokeWidth="1.4" opacity="0.45" />
            <ellipse cx="82" cy="136" rx="42" ry="5" fill={shadow} />
          </g>
        );
      case 'spring-balance':
        return (
          <g>
            <rect x="62" y="28" width="36" height="86" rx="12" fill="#f8fafc" stroke={outline} strokeWidth="2.3" />
            <path d="M69 39h22M69 46h22" stroke={dark} strokeWidth="1.2" opacity="0.65" />
            <path d="M75 38v50" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 87h20l-5 20H75z" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M80 107v12" stroke={dark} strokeWidth="2" />
            <path d="M76 119c0 10 8 10 8 0" fill="none" stroke={metal} strokeWidth="3" />
            <path d="M65 31c-9 0-13 8-8 13" fill="none" stroke={outline} strokeWidth="2.2" />
            <text x="91" y="56" fontSize="5.5" fill={dark}>N</text>
            <text x="90" y="47" fontSize="5.5" fill={dark}>10</text>
            <path d="M59 94h-8M59 100h-8M59 106h-8" stroke={dark} strokeWidth="1.3" opacity="0.55" />
          </g>
        );
      case 'spiral-spring':
        return (
          <g>
            <path d="M80 28v11" stroke={dark} strokeWidth="2.4" />
            <path d="M80 39c-16 5 16 12 0 18s-16 12 0 18 16 12 0 18-16 12 0 18" fill="none" stroke={metal} strokeWidth="3" strokeLinecap="round" />
            <path d="M80 39c-16 5 16 12 0 18s-16 12 0 18 16 12 0 18-16 12 0 18" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.55" />
            <path d="M67 111h26v8H67z" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M80 119v10" stroke={dark} strokeWidth="2" />
            <path d="M72 129h16" stroke={dark} strokeWidth="4" strokeLinecap="round" />
            <path d="M94 58h-8M95 77h-9M95 96h-8" stroke={accent} strokeWidth="1.4" opacity="0.6" />
          </g>
        );
      case 'weight-hanger':
        return (
          <g>
            <path d="M48 48h64" stroke={metal} strokeWidth="5" strokeLinecap="round" />
            <path d="M56 48v13M104 48v13" stroke={dark} strokeWidth="2" />
            <path d="M52 61c0 14 8 20 15 20h26c7 0 15-6 15-20" fill="none" stroke={metal} strokeWidth="3" />
            <rect x="72" y="79" width="16" height="10" fill={dark} />
            {[0, 1, 2].map((index) => (
              <g key={index}>
                <path d={`M52 ${89 + index * 15}h56v10H52z`} fill={index === 1 ? metal : '#475569'} stroke={dark} strokeWidth="1.5" />
                <rect x="74" y={89 + index * 15} width="12" height="10" fill="#0f172a" />
                <text x="100" y={96 + index * 15} textAnchor="middle" fontSize="5.5" fill="#f8fafc">{index === 0 ? '100 g' : '50 g'}</text>
              </g>
            ))}
            <path d="M80 134v5" stroke={dark} strokeWidth="2.4" />
          </g>
        );
      case 'irregular-solid':
        return (
          <g>
            <path d="M45 67l26-18 39 8 12 35-21 29-38-4-20-27z" fill="#64748b" stroke="#334155" strokeWidth="2.4" />
            <path d="M45 67l26 9 39-19M71 76l-8 41M110 92l-25 27" fill="none" stroke="#94a3b8" strokeWidth="1.7" opacity="0.75" />
            <path d="M52 72l16-11 33 6" fill="none" stroke="#cbd5e1" strokeWidth="2.2" opacity="0.6" />
            <circle cx="92" cy="111" r="4" fill={accent} opacity="0.4" />
            <circle cx="61" cy="98" r="3" fill={accent} opacity="0.3" />
            <ellipse cx="82" cy="131" rx="43" ry="6" fill={shadow} />
            <path d="M124 47l12 12M130 47l-12 12" stroke={accent} strokeWidth="1.5" opacity="0.55" />
          </g>
        );
      case 'pendulum-bob':
        return (
          <g>
            <path d="M80 26v68" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M58 25h44" stroke={metal} strokeWidth="5" strokeLinecap="round" />
            <path d="M58 25l-7 10M102 25l7 10" stroke={dark} strokeWidth="2" />
            <circle cx="80" cy="111" r="23" fill={metal} stroke={dark} strokeWidth="2.4" />
            <circle cx="73" cy="103" r="8" fill="#ffffff" opacity="0.45" />
            <path d="M80 88v-7" stroke={dark} strokeWidth="2" />
            <path d="M80 111l19 25" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.45" />
            <path d="M99 136c-8 4-18 4-26 0" fill="none" stroke={dark} strokeWidth="1.3" strokeDasharray="3 3" opacity="0.55" />
            <ellipse cx="80" cy="140" rx="35" ry="4" fill={shadow} />
          </g>
        );
      case 'protractor':
        return (
          <g>
            <path d="M27 113a53 53 0 0 1 106 0z" fill={glass} stroke={outline} strokeWidth="2.3" />
            <path d="M80 113V64M40 113a40 40 0 0 1 80 0z" fill="none" stroke="#cbd5e1" strokeWidth="1.4" />
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => (
              <path key={deg} d="M80 66v8" stroke={dark} strokeWidth={deg % 45 === 0 ? 1.8 : 1} transform={`rotate(${deg - 90} 80 113)`} />
            ))}
            <text x="80" y="91" textAnchor="middle" fontSize="8" fill={dark}>90°</text>
            <text x="52" y="109" textAnchor="middle" fontSize="6" fill={dark}>45°</text>
            <text x="108" y="109" textAnchor="middle" fontSize="6" fill={dark}>45°</text>
            <path d="M27 113h106" stroke={dark} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="80" cy="113" r="4" fill={accent} />
          </g>
        );
      case 'dry-cell':
        return (
          <g>
            <rect x="58" y="35" width="44" height="93" rx="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="58" y="35" width="44" height="32" rx="7" fill="#b91c1c" />
            <rect x="58" y="64" width="44" height="7" fill="#fbbf24" />
            <rect x="70" y="25" width="20" height="11" rx="3" fill={metal} stroke={dark} strokeWidth="1.8" />
            <text x="80" y="82" textAnchor="middle" fontSize="12" fontWeight="700" fill={accent}>1.5 V</text>
            <text x="80" y="108" textAnchor="middle" fontSize="6" fill="#f8fafc">DRY CELL</text>
            <path d="M70 114h20" stroke="#475569" strokeWidth="2" />
            <path d="M80 57v-7" stroke={metal} strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="80" cy="133" rx="33" ry="5" fill={shadow} />
          </g>
        );
      case 'clear-jar':
        return (
          <g>
            <path d="M51 48h58v73c0 8-6 14-14 14H65c-8 0-14-6-14-14z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M56 80h48v41c0 5-4 9-9 9H65c-5 0-9-4-9-9z" fill={liquid} opacity="0.42" />
            <rect x="54" y="41" width="52" height="9" rx="3" fill={metal} stroke={dark} strokeWidth="1.8" />
            <path d="M59 56v59" stroke={shine} strokeWidth="5" strokeLinecap="round" />
            <circle cx="92" cy="96" r="4" fill="#ffffff" opacity="0.65" />
            <circle cx="76" cy="110" r="3" fill="#ffffff" opacity="0.5" />
            <path d="M60 126h40" stroke={accent} strokeWidth="1.5" opacity="0.35" />
            <ellipse cx="80" cy="139" rx="38" ry="5" fill={shadow} />
          </g>
        );
      case 'rain-gauge':
        return (
          <g>
            <path d="M49 63h62v64c0 7-6 12-13 12H62c-7 0-13-5-13-12z" fill={glass} stroke={outline} strokeWidth="2.4" />
            <path d="M54 91h52v33c0 5-4 8-9 8H63c-5 0-9-3-9-8z" fill={liquid} opacity="0.55" />
            <path d="M45 58h70l-7-12H52z" fill={metal} stroke={dark} strokeWidth="2.2" />
            <path d="M65 46l15 12 15-12" fill="none" stroke={dark} strokeWidth="1.5" />
            <path d="M57 93h46M57 103h46M57 113h46M57 123h46" stroke={dark} strokeWidth="1" opacity="0.55" />
            <path d="M65 72v-6M80 72v-6M95 72v-6" stroke={accent} strokeWidth="1.5" />
            <text x="80" y="76" textAnchor="middle" fontSize="6" fill={dark}>mm</text>
            <ellipse cx="80" cy="145" rx="38" ry="4" fill={shadow} />
          </g>
        );
      case 'record-sheet':
        return (
          <g>
            <path d="M36 31h88v105H36z" fill="#ffffff" stroke={outline} strokeWidth="2.2" />
            <path d="M36 31h88v18H36z" fill={accent} opacity="0.2" />
            <path d="M44 40h51" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M44 57h72M44 72h72M44 87h72M44 102h72M44 117h72" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M68 49v87M94 49v87" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M49 64h12M73 64h16M99 64h12M49 79h13M73 79h14M99 79h10M49 94h10M73 94h17M99 94h13M49 109h14M73 109h12M99 109h9" stroke={dark} strokeWidth="1.3" opacity="0.55" />
            <path d="M35 139h91" stroke={dark} strokeWidth="1.5" />
            <circle cx="108" cy="126" r="5" fill={accent} opacity="0.35" />
          </g>
        );
      case 'punnett-square':
        return (
          <g>
            <rect x="39" y="38" width="82" height="82" rx="2" fill="#ffffff" stroke={dark} strokeWidth="2.2" />
            <path d="M39 66h82M39 92h82M66 38v82M93 38v82" stroke={dark} strokeWidth="1.8" />
            <path d="M39 38h82v82H39z" fill={accent} opacity="0.08" />
            {[
              ['A', 52, 56], ['a', 79, 56], ['A', 52, 83], ['a', 79, 83],
              ['A', 52, 109], ['a', 79, 109], ['A', 106, 56], ['a', 106, 83],
            ].map(([letter, x, y], index) => (
              <text key={`${x}-${y}-${index}`} x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="700" fill={index < 4 ? '#0f172a' : accent}>{letter}</text>
            ))}
            <text x="80" y="132" textAnchor="middle" fontSize="7" fill={dark}>monohybrid cross</text>
            <path d="M106 83l9 8" stroke={accent} strokeWidth="1.5" opacity="0.5" />
          </g>
        );
      case 'coloured-beads':
        return (
          <g>
            <path d="M50 54h60v67c0 9-7 16-16 16H66c-9 0-16-7-16-16z" fill={glass} stroke={outline} strokeWidth="2.3" />
            <rect x="47" y="44" width="66" height="12" rx="4" fill={metal} stroke={dark} strokeWidth="1.8" />
            <g>
              <circle cx="68" cy="95" r="8" fill="#ef4444" /><circle cx="87" cy="96" r="8" fill="#2563eb" />
              <circle cx="57" cy="111" r="7" fill="#22c55e" /><circle cx="75" cy="113" r="8" fill="#f59e0b" />
              <circle cx="96" cy="112" r="7" fill="#a855f7" /><circle cx="105" cy="97" r="6" fill="#ef4444" />
              <circle cx="50" cy="89" r="6" fill="#2563eb" /><circle cx="64" cy="78" r="7" fill="#f59e0b" />
              <circle cx="82" cy="80" r="7" fill="#22c55e" /><circle cx="99" cy="81" r="6" fill="#a855f7" />
            </g>
            <ellipse cx="68" cy="90" rx="3" ry="2" fill="#ffffff" opacity="0.55" />
            <ellipse cx="85" cy="92" rx="3" ry="2" fill="#ffffff" opacity="0.55" />
            <path d="M60 64c8-4 28-4 37 0" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
            <ellipse cx="80" cy="142" rx="38" ry="4" fill={shadow} />
          </g>
        );
      case 'coin':
        return (
          <g>
            <circle cx="64" cy="88" r="30" fill="#fbbf24" stroke="#b45309" strokeWidth="2.4" />
            <circle cx="64" cy="88" r="23" fill="#fde68a" stroke="#d97706" strokeWidth="1.7" />
            <circle cx="105" cy="103" r="24" fill="#f59e0b" stroke="#b45309" strokeWidth="2.2" />
            <circle cx="105" cy="103" r="17" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
            <text x="64" y="94" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e">H</text>
            <text x="105" y="109" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">T</text>
            <path d="M47 77c5-6 12-9 18-9M91 94c4-5 9-7 14-7" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="85" cy="137" rx="42" ry="5" fill={shadow} />
          </g>
        );
      case 'dice':
        return (
          <g>
            <path d="M40 61l29-15 47 9-29 15z" fill="#f8fafc" stroke={outline} strokeWidth="2" />
            <path d="M40 61v39l47 15V70z" fill="#e2e8f0" stroke={outline} strokeWidth="2" />
            <path d="M87 70l29-15v39l-29 15z" fill="#cbd5e1" stroke={outline} strokeWidth="2" />
            <g fill={dark}>
              <circle cx="55" cy="77" r="3" /><circle cx="74" cy="85" r="3" /><circle cx="55" cy="94" r="3" /><circle cx="74" cy="103" r="3" />
              <circle cx="100" cy="78" r="3" /><circle cx="100" cy="96" r="3" />
            </g>
            <circle cx="62" cy="49" r="3" fill={accent} />
            <ellipse cx="77" cy="128" rx="42" ry="5" fill={shadow} />
            <text x="113" y="47" textAnchor="middle" fontSize="7" fill={dark}>1/6</text>
          </g>
        );
      case 'gamete-container':
        return (
          <g>
            <path d="M34 66h42v50c0 8-5 13-12 13H46c-7 0-12-5-12-13z" fill={glass} stroke={outline} strokeWidth="2.2" />
            <path d="M84 66h42v50c0 8-5 13-12 13H96c-7 0-12-5-12-13z" fill={glass} stroke={outline} strokeWidth="2.2" />
            <path d="M38 99h34v16c0 5-3 8-8 8H46c-5 0-8-3-8-8z" fill="#ef4444" opacity="0.32" />
            <path d="M88 99h34v16c0 5-3 8-8 8H96c-5 0-8-3-8-8z" fill="#2563eb" opacity="0.32" />
            <text x="55" y="92" textAnchor="middle" fontSize="17" fontWeight="700" fill="#b91c1c">A</text>
            <text x="55" y="111" textAnchor="middle" fontSize="13" fontWeight="700" fill="#991b1b">a</text>
            <text x="105" y="92" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1d4ed8">B</text>
            <text x="105" y="111" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e40af">b</text>
            <path d="M34 62h42M84 62h42" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M55 129v8M105 129v8" stroke={dark} strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="80" cy="142" rx="47" ry="4" fill={shadow} />
          </g>
        );
      case 'paper-clip':
        return (
          <g>
            <path d="M105 44c-19-18-45 8-29 25l31 31c13 13 34-8 21-21L86 37c-18-18-45 9-27 27l35 35" fill="none" stroke={metal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M105 44c-19-18-45 8-29 25l31 31c13 13 34-8 21-21L86 37c-18-18-45 9-27 27l35 35" fill="none" stroke={dark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
            <path d="M99 47c-11-11-27 3-18 15" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <path d="M35 30l8 8M28 38l8 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
          </g>
        );
      case 'watering-can':
        return (
          <g>
            <path d="M47 70h52v45c0 8-6 14-14 14H61c-8 0-14-6-14-14z" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2.3" />
            <path d="M99 83l28-34 9 7-29 37z" fill="#38bdf8" stroke="#0369a1" strokeWidth="2.2" />
            <path d="M128 50l14-8 4 6-12 10z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.8" />
            <path d="M69 70V58h24c13 0 23 8 27 18" fill="none" stroke="#0284c7" strokeWidth="4" />
            <path d="M114 68c4 2 6 6 6 10" fill="none" stroke="#0369a1" strokeWidth="2" />
            <path d="M84 128l8 11M93 126l5 12M102 121l2 12" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M54 86v32" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
            <ellipse cx="80" cy="138" rx="43" ry="5" fill={shadow} />
          </g>
        );
      case 'seeds-fertiliser':
        return (
          <g>
            <path d="M44 48h72l-7 83H51z" fill="#d97706" stroke="#92400e" strokeWidth="2.3" />
            <path d="M44 48l11-14h56l5 14z" fill="#f59e0b" stroke="#92400e" strokeWidth="2.2" />
            <path d="M54 64h52v42H54z" fill="#fffbeb" stroke="#b45309" strokeWidth="1.5" />
            <path d="M64 78c8-10 19-10 27 0-7 12-20 12-27 0z" fill="#65a30d" />
            <path d="M73 99h22v30H73z" fill="#92400e" opacity="0.4" />
            {[45, 56, 67, 78, 89, 100, 111].map((x) => (
              <circle key={x} cx={x} cy="119" r="2.4" fill="#fde68a" opacity="0.75" />
            ))}
            <text x="80" y="73" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#78350f">NPK</text>
            <text x="80" y="101" textAnchor="middle" fontSize="6" fill="#78350f">SEEDS</text>
            <ellipse cx="80" cy="137" rx="38" ry="5" fill={shadow} />
          </g>
        );
      default: {
        const unreachable: never = visual;
        return unreachable;
      }
    }
  };

  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label={title ?? label ?? visual}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title ?? label ?? visual}</title>
      {defs}
      {renderVisual()}
    </svg>
  );
}
