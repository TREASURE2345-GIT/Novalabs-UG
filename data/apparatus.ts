import {
  apparatusLibrary,
  experimentApparatus,
  type ApparatusItem as CatalogApparatus,
} from './apparatusCatalog';
import type {
  Apparatus,
  ApparatusCapacity,
  ApparatusCategory,
  ApparatusHotspot,
  ApparatusInteraction,
} from '../types/apparatus';

const categoryMap: Record<CatalogApparatus['category'], ApparatusCategory> = {
  Glassware: 'glassware',
  Measuring: 'measuring',
  Heating: 'heating',
  Separation: 'glassware',
  Observation: 'handling',
  Handling: 'handling',
  Electrical: 'measuring',
  Data: 'handling',
  Sample: 'biological',
  Chemical: 'glassware',
  Biological: 'biological',
};

const capacityOverrides: Record<string, ApparatusCapacity> = {
  beaker: { unit: 'ml', max: 250, step: 10, correctRange: [50, 200] },
  'measuring-cylinder': { unit: 'ml', max: 100, step: 1, correctRange: [10, 80] },
  'conical-flask': { unit: 'ml', max: 250, step: 5, correctRange: [25, 150] },
  'volumetric-flask': { unit: 'ml', max: 250, step: 5, correctRange: [250, 250] },
  'test-tube': { unit: 'ml', max: 20, step: 1 },
  burette: { unit: 'ml', max: 50, step: 0.05, correctRange: [20, 30] },
  pipette: { unit: 'ml', max: 25, step: 1, correctRange: [25, 25] },
  thermometer: { unit: '°C', max: 100, step: 1, correctRange: [0, 100] },
  balance: { unit: 'g', max: 500, step: 0.1 },
  'water-bath': { unit: '°C', max: 100, step: 1, correctRange: [30, 60] },
};

const hotspotOverrides: Record<string, ApparatusHotspot> = {
  beaker: { x: 34, y: 30 },
  'test-tube': { x: 38, y: 24 },
  'measuring-cylinder': { x: 40, y: 22 },
  burette: { x: 42, y: 18 },
  thermometer: { x: 44, y: 16 },
  microscope: { x: 42, y: 24 },
  'bunsen-burner': { x: 40, y: 56 },
  balance: { x: 44, y: 38 },
};

const distractorMap: Record<string, string[]> = {
  'dna-extraction': ['bunsen-burner', 'burette', 'voltmeter'],
  'osmosis-in-potato-cells': ['bunsen-burner', 'burette', 'ammeter'],
  'enzyme-activity-temperature': ['burette', 'voltmeter', 'mortar-pestle'],
  'acid-base-titration': ['volumetric-flask', 'thermometer', 'mortar-pestle', 'ammeter'],
  'simple-circuits': ['burette', 'beaker', 'test-tube-rack', 'microscope'],
  'simple-pendulum': ['burette', 'beaker', 'microscope', 'test-tube'],
  'flame-tests': ['beaker', 'measuring-cylinder', 'stopwatch'],
  'photosynthesis-lab': ['burette', 'voltmeter', 'mortar-pestle'],
  'food-tests-and-nutrition': ['burette', 'voltmeter', 'microscope'],
};

const correctFor = new Map<string, string[]>();
for (const [experimentId, ids] of Object.entries(experimentApparatus)) {
  for (const id of ids) {
    const entries = correctFor.get(id) ?? [];
    if (!entries.includes(experimentId)) entries.push(experimentId);
    correctFor.set(id, entries);
  }
}

function interactionFor(item: CatalogApparatus): ApparatusInteraction {
  if (item.visual === 'microscope') return 'microscope';
  if (item.category === 'Heating' || item.visual === 'bunsen-burner') return 'heat';
  if (['burette', 'pipette', 'dropper', 'syringe'].includes(item.id)) return 'dispense';
  if (item.category === 'Measuring' || item.category === 'Glassware') return 'fill';
  return 'none';
}

function toApparatus(item: CatalogApparatus): Apparatus {
  return {
    id: item.id,
    name: item.name,
    category: categoryMap[item.category],
    svg: item.visual,
    correctFor: correctFor.get(item.id) ?? [],
    distractorsFor: Object.entries(distractorMap)
      .filter(([, ids]) => ids.includes(item.id))
      .map(([experimentId]) => experimentId),
    capacity: capacityOverrides[item.id],
    safeHandling: item.safety.slice(0, 3),
    hotspot: hotspotOverrides[item.id] ?? { x: 46, y: 36 },
    purpose: item.purpose,
    interaction: interactionFor(item),
  };
}

const gogglesSvg = `<svg viewBox="0 0 120 80" role="img" aria-label="Safety goggles"><rect x="10" y="26" width="100" height="30" rx="14" fill="#0f172a" opacity="0.12"/><path d="M14 34h34c4 0 6 3 6 8s-4 10-12 10H24c-8 0-14-6-14-12 0-4 2-6 4-6Z" fill="#38bdf8" opacity="0.75" stroke="#0f172a" stroke-width="3"/><path d="M106 34H72c-4 0-6 3-6 8s4 10 12 10h18c8 0 14-6 14-12 0-4-2-6-4-6Z" fill="#38bdf8" opacity="0.75" stroke="#0f172a" stroke-width="3"/><path d="M54 38h12" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/><path d="M20 40c8-4 20-4 26 0" stroke="#f8fafc" stroke-width="3" fill="none" opacity="0.7"/><path d="M74 40c8-4 20-4 26 0" stroke="#f8fafc" stroke-width="3" fill="none" opacity="0.7"/></svg>`;

const glovesSvg = `<svg viewBox="0 0 120 110" role="img" aria-label="Protective gloves"><path d="M44 104V54c0-8 10-8 10 0v18-30c0-8 10-8 10 0v30-32c0-8 10-8 10 0v34-24c0-8 10-8 10 0v32c0 12-4 20-10 26l-2 18H44Z" fill="#f59e0b" opacity="0.82" stroke="#92400e" stroke-width="3"/><path d="M64 52v22M74 50v24M84 54v20" stroke="#fde68a" stroke-width="3" stroke-linecap="round" opacity="0.8"/></svg>`;

const coatSvg = `<svg viewBox="0 0 120 120" role="img" aria-label="Laboratory coat"><path d="M42 18 30 26 18 86l18 6 6-30v40h36V62l6 30 18-6-12-60-12-8-14 10-14-10Z" fill="#f8fafc" stroke="#475569" stroke-width="3"/><path d="M60 28v64M48 44h24M48 60h24" stroke="#cbd5e1" stroke-width="3"/><circle cx="60" cy="48" r="2" fill="#38bdf8"/><circle cx="60" cy="64" r="2" fill="#38bdf8"/></svg>`;

const fumeHoodSvg = `<svg viewBox="0 0 140 120" role="img" aria-label="Fume hood"><rect x="12" y="10" width="116" height="98" rx="8" fill="#e2e8f0" stroke="#334155" stroke-width="4"/><rect x="22" y="20" width="96" height="42" rx="4" fill="#0f172a" opacity="0.82"/><path d="M34 56c10-12 22-12 32 0M74 56c10-12 22-12 32 0" stroke="#38bdf8" stroke-width="4" fill="none"/><rect x="22" y="70" width="96" height="28" rx="4" fill="#94a3b8" opacity="0.55"/><path d="M52 96h36" stroke="#334155" stroke-width="4" stroke-linecap="round"/></svg>`;

const eyeWashSvg = `<svg viewBox="0 0 120 120" role="img" aria-label="Eye wash station"><rect x="34" y="24" width="52" height="70" rx="10" fill="#0ea5e9" opacity="0.2" stroke="#0369a1" stroke-width="4"/><circle cx="60" cy="52" r="16" fill="#38bdf8" opacity="0.8"/><path d="M60 44c6 4 10 8 10 12a10 10 0 0 1-20 0c0-4 4-8 10-12Z" fill="#f8fafc" stroke="#0369a1" stroke-width="3"/><path d="M46 84h28" stroke="#0369a1" stroke-width="5" stroke-linecap="round"/><rect x="26" y="94" width="68" height="10" rx="5" fill="#64748b"/></svg>`;

const nichromeSvg = `<svg viewBox="0 0 140 80" role="img" aria-label="Nichrome wire loop"><path d="M8 58h102" stroke="#475569" stroke-width="5" stroke-linecap="round"/><path d="M104 58c14 0 22-6 22-14s-8-14-18-14-16 6-16 12 6 10 14 10" fill="none" stroke="#94a3b8" stroke-width="4"/><circle cx="116" cy="40" r="6" fill="#38bdf8" opacity="0.7"/><path d="M12 58h30" stroke="#334155" stroke-width="9" stroke-linecap="round"/></svg>`;

const flameSamplesSvg = `<svg viewBox="0 0 120 100" role="img" aria-label="Flame test sample tubes"><rect x="14" y="46" width="22" height="40" rx="8" fill="#cbd5e1" opacity="0.8" stroke="#475569" stroke-width="3"/><rect x="49" y="38" width="22" height="48" rx="8" fill="#fecdd3" opacity="0.85" stroke="#475569" stroke-width="3"/><rect x="84" y="52" width="22" height="34" rx="8" fill="#bfdbfe" opacity="0.85" stroke="#475569" stroke-width="3"/><path d="M20 40c0-10 10-10 10 0M55 32c0-10 10-10 10 0M90 46c0-10 10-10 10 0" stroke="#f97316" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

const safetyExtras: Apparatus[] = [
  {
    id: 'safety-goggles',
    name: 'Safety goggles',
    category: 'safety',
    svg: gogglesSvg,
    correctFor: Object.keys(experimentApparatus),
    safeHandling: ['Wear goggles for every practical involving heat, glassware or chemicals.', 'Inspect the strap and lenses before use.'],
    hotspot: { x: 50, y: 42 },
    purpose: 'Protect the eyes from splashes, fumes and flying fragments.',
    interaction: 'wear',
  },
  {
    id: 'lab-gloves',
    name: 'Protective gloves',
    category: 'safety',
    svg: glovesSvg,
    correctFor: Object.keys(experimentApparatus),
    safeHandling: ['Check for tears before handling reagents.', 'Remove gloves before touching taps, phones or your face.'],
    hotspot: { x: 50, y: 54 },
    purpose: 'Create a barrier between the skin and hazardous substances.',
    interaction: 'wear',
  },
  {
    id: 'lab-coat',
    name: 'Laboratory coat',
    category: 'safety',
    svg: coatSvg,
    correctFor: Object.keys(experimentApparatus),
    safeHandling: ['Fasten the coat and keep sleeves away from flames.', 'Remove the coat before leaving the laboratory.'],
    hotspot: { x: 50, y: 58 },
    purpose: 'Protect clothing and skin from spills and stains.',
    interaction: 'wear',
  },
  {
    id: 'fume-hood',
    name: 'Fume hood',
    category: 'safety',
    svg: fumeHoodSvg,
    correctFor: ['dna-extraction', 'acid-base-titration', 'testing-leaf-for-starch'],
    safeHandling: ['Keep the sash low and never place your head inside the hood.', 'Switch on extraction before opening volatile reagents.'],
    hotspot: { x: 50, y: 40 },
    purpose: 'Remove toxic or flammable vapours from the working area.',
    interaction: 'none',
  },
  {
    id: 'eye-wash',
    name: 'Eye wash station',
    category: 'safety',
    svg: eyeWashSvg,
    correctFor: Object.keys(experimentApparatus),
    safeHandling: ['Flush splashes for at least 15 minutes and report the incident.', 'Keep the path to the station clear.'],
    hotspot: { x: 50, y: 50 },
    purpose: 'Provide immediate irrigation if a chemical enters the eye.',
    interaction: 'none',
  },
  {
    id: 'nichrome-wire',
    name: 'Nichrome wire loop',
    category: 'handling',
    svg: nichromeSvg,
    correctFor: ['flame-tests'],
    distractorsFor: ['acid-base-titration'],
    safeHandling: ['Clean the loop in concentrated acid and rinse before each test.', 'Hold the loop in the hottest part of the flame.'],
    hotspot: { x: 80, y: 50 },
    purpose: 'Carry a small sample into a non-luminous flame for flame tests.',
    interaction: 'none',
  },
  {
    id: 'flame-test-samples',
    name: 'Flame test samples',
    category: 'biological',
    svg: flameSamplesSvg,
    correctFor: ['flame-tests'],
    safeHandling: ['Label each sample and use a separate clean loop for each salt.', 'Do not taste or inhale the salts.'],
    hotspot: { x: 50, y: 60 },
    purpose: 'Supply known metal salts for identifying characteristic flame colours.',
    interaction: 'none',
  },
];

const derived: Apparatus[] = Object.values(apparatusLibrary).map(toApparatus);
const apparatusById = new Map<string, Apparatus>();
for (const item of [...derived, ...safetyExtras]) apparatusById.set(item.id, item);

export const apparatus: Apparatus[] = Array.from(apparatusById.values());

export function getApparatusById(id: string): Apparatus | undefined {
  return apparatusById.get(id);
}

export function getApparatusForExperiment(experimentId: string): Apparatus[] {
  return apparatus.filter((item) => item.correctFor.includes(experimentId));
}

export function getDistractorsForExperiment(experimentId: string): Apparatus[] {
  return apparatus.filter((item) => item.distractorsFor?.includes(experimentId));
}

export { distractorMap };
