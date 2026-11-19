export type ChemicalCategory = 'acid' | 'base' | 'salt' | 'metal' | 'indicator' | 'solvent' | 'carbonate';

export type ChemicalReagent = {
  id: string;
  name: string;
  formula: string;
  category: ChemicalCategory;
  color: string;
  hazard?: string;
  note?: string;
};

export type ReactionProduct = {
  observation: string;
  mixtureColor: string;
  equation: string;
  precipitate?: string;
  gas?: string;
  temperatureChange?: number;
  safety?: string;
};

export const chemicalReagents: ChemicalReagent[] = [
  { id: 'hydrochloric-acid', name: 'Hydrochloric acid', formula: 'HCl', category: 'acid', color: '#eef2ff', hazard: 'Corrosive', note: 'Dilute bench acid' },
  { id: 'sulfuric-acid', name: 'Sulfuric acid', formula: 'H₂SO₄', category: 'acid', color: '#f8fafc', hazard: 'Corrosive' },
  { id: 'ethanoic-acid', name: 'Ethanoic acid', formula: 'CH₃COOH', category: 'acid', color: '#f8fafc', hazard: 'Irritant', note: 'Vinegar smell' },
  { id: 'sodium-hydroxide', name: 'Sodium hydroxide', formula: 'NaOH', category: 'base', color: '#f8fafc', hazard: 'Corrosive' },
  { id: 'ammonia', name: 'Ammonia solution', formula: 'NH₃', category: 'base', color: '#f0fdfa', hazard: 'Irritant vapour' },
  { id: 'sodium-carbonate', name: 'Sodium carbonate', formula: 'Na₂CO₃', category: 'carbonate', color: '#ffffff', note: 'Soluble carbonate' },
  { id: 'calcium-carbonate', name: 'Calcium carbonate', formula: 'CaCO₃', category: 'carbonate', color: '#e2e8f0', note: 'Marble chips' },
  { id: 'copper-sulfate', name: 'Copper(II) sulfate', formula: 'CuSO₄', category: 'salt', color: '#2563eb', hazard: 'Harmful' },
  { id: 'iron-filings', name: 'Iron filings', formula: 'Fe', category: 'metal', color: '#64748b' },
  { id: 'zinc-granules', name: 'Zinc granules', formula: 'Zn', category: 'metal', color: '#94a3b8' },
  { id: 'magnesium-ribbon', name: 'Magnesium ribbon', formula: 'Mg', category: 'metal', color: '#cbd5e1', hazard: 'Flammable' },
  { id: 'silver-nitrate', name: 'Silver nitrate', formula: 'AgNO₃', category: 'salt', color: '#f8fafc', hazard: 'Stains skin' },
  { id: 'sodium-chloride', name: 'Sodium chloride', formula: 'NaCl', category: 'salt', color: '#ffffff' },
  { id: 'potassium-iodide', name: 'Potassium iodide', formula: 'KI', category: 'salt', color: '#f8fafc' },
  { id: 'lead-nitrate', name: 'Lead(II) nitrate', formula: 'Pb(NO₃)₂', category: 'salt', color: '#f8fafc', hazard: 'Toxic' },
  { id: 'potassium-permanganate', name: 'Potassium manganate(VII)', formula: 'KMnO₄', category: 'salt', color: '#6b21a8', hazard: 'Oxidising' },
  { id: 'universal-indicator', name: 'Universal indicator', formula: 'UI', category: 'indicator', color: '#7c3aed', note: 'Shows pH by colour' },
  { id: 'water', name: 'Distilled water', formula: 'H₂O', category: 'solvent', color: '#bfdbfe' },
  { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', category: 'solvent', color: '#dbeafe', hazard: 'Flammable' },
];

const reagentIndex = new Map(chemicalReagents.map((reagent) => [reagent.id, reagent]));

export const getChemical = (id: string): ChemicalReagent | undefined => reagentIndex.get(id);

type ReactionRule = {
  a: string;
  b: string;
  product: ReactionProduct;
};

const reactionRules: ReactionRule[] = [
  {
    a: 'hydrochloric-acid',
    b: 'sodium-hydroxide',
    product: {
      observation: 'The mixture warms up and the indicator turns green because the acid and alkali neutralise each other.',
      mixtureColor: '#86efac',
      equation: 'HCl + NaOH → NaCl + H₂O',
      temperatureChange: 6,
      safety: 'Add the acid slowly and swirl to avoid local overheating.',
    },
  },
  {
    a: 'sulfuric-acid',
    b: 'sodium-hydroxide',
    product: {
      observation: 'The temperature rises and the solution becomes neutral as the acid reacts with the alkali.',
      mixtureColor: '#bbf7d0',
      equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
      temperatureChange: 8,
      safety: 'Corrosive reagents: wear goggles and add acid to alkali with stirring.',
    },
  },
  {
    a: 'hydrochloric-acid',
    b: 'sodium-carbonate',
    product: {
      observation: 'Colourless bubbles of carbon dioxide gas are produced and the mixture fizzes.',
      mixtureColor: '#e0f2fe',
      equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂',
      gas: 'Carbon dioxide',
      temperatureChange: 1,
    },
  },
  {
    a: 'hydrochloric-acid',
    b: 'calcium-carbonate',
    product: {
      observation: 'The marble chips fizz as carbon dioxide bubbles are released and the solid slowly dissolves.',
      mixtureColor: '#e2e8f0',
      equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂',
      gas: 'Carbon dioxide',
      temperatureChange: 1,
    },
  },
  {
    a: 'hydrochloric-acid',
    b: 'zinc-granules',
    product: {
      observation: 'Bubbles of hydrogen gas form on the zinc and the mixture becomes warm.',
      mixtureColor: '#f1f5f9',
      equation: 'Zn + 2HCl → ZnCl₂ + H₂',
      gas: 'Hydrogen',
      temperatureChange: 9,
      safety: 'Hydrogen is flammable: keep flames away.',
    },
  },
  {
    a: 'hydrochloric-acid',
    b: 'iron-filings',
    product: {
      observation: 'Hydrogen bubbles form slowly and the solution turns pale green as iron(II) ions are produced.',
      mixtureColor: '#bbf7d0',
      equation: 'Fe + 2HCl → FeCl₂ + H₂',
      gas: 'Hydrogen',
      temperatureChange: 5,
    },
  },
  {
    a: 'hydrochloric-acid',
    b: 'magnesium-ribbon',
    product: {
      observation: 'Vigorous fizzing produces hydrogen gas and the mixture becomes very warm.',
      mixtureColor: '#f1f5f9',
      equation: 'Mg + 2HCl → MgCl₂ + H₂',
      gas: 'Hydrogen',
      temperatureChange: 14,
      safety: 'Vigorous reaction: use small pieces and keep flames away.',
    },
  },
  {
    a: 'copper-sulfate',
    b: 'sodium-hydroxide',
    product: {
      observation: 'A pale blue precipitate of copper(II) hydroxide forms in the mixture.',
      mixtureColor: '#93c5fd',
      equation: 'CuSO₄ + 2NaOH → Cu(OH)₂ + Na₂SO₄',
      precipitate: 'Blue copper(II) hydroxide',
    },
  },
  {
    a: 'copper-sulfate',
    b: 'iron-filings',
    product: {
      observation: 'The blue colour fades and a brown coating of copper forms on the iron because iron is more reactive.',
      mixtureColor: '#d6d3d1',
      equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
      precipitate: 'Brown copper deposit',
      temperatureChange: 2,
    },
  },
  {
    a: 'copper-sulfate',
    b: 'zinc-granules',
    product: {
      observation: 'The blue colour fades as zinc displaces copper and a grey-red copper deposit forms.',
      mixtureColor: '#e2e8f0',
      equation: 'Zn + CuSO₄ → ZnSO₄ + Cu',
      precipitate: 'Copper deposit',
      temperatureChange: 3,
    },
  },
  {
    a: 'copper-sulfate',
    b: 'sodium-carbonate',
    product: {
      observation: 'A pale blue-green precipitate of copper(II) carbonate forms with gentle fizzing.',
      mixtureColor: '#99f6e4',
      equation: 'CuSO₄ + Na₂CO₃ → CuCO₃ + Na₂SO₄',
      precipitate: 'Copper(II) carbonate',
    },
  },
  {
    a: 'silver-nitrate',
    b: 'sodium-chloride',
    product: {
      observation: 'A thick white precipitate of silver chloride forms immediately.',
      mixtureColor: '#f8fafc',
      equation: 'AgNO₃ + NaCl → AgCl + NaNO₃',
      precipitate: 'White silver chloride',
      safety: 'Silver nitrate stains skin and clothing.',
    },
  },
  {
    a: 'silver-nitrate',
    b: 'potassium-iodide',
    product: {
      observation: 'A yellow precipitate of silver iodide forms in the mixture.',
      mixtureColor: '#fef3c7',
      equation: 'AgNO₃ + KI → AgI + KNO₃',
      precipitate: 'Yellow silver iodide',
    },
  },
  {
    a: 'lead-nitrate',
    b: 'potassium-iodide',
    product: {
      observation: 'A bright yellow precipitate of lead(II) iodide forms immediately.',
      mixtureColor: '#fde047',
      equation: 'Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃',
      precipitate: 'Yellow lead(II) iodide',
      safety: 'Lead compounds are toxic: wash hands and avoid contact.',
    },
  },
  {
    a: 'lead-nitrate',
    b: 'sodium-chloride',
    product: {
      observation: 'A white precipitate of lead(II) chloride forms in the solution.',
      mixtureColor: '#f1f5f9',
      equation: 'Pb(NO₃)₂ + 2NaCl → PbCl₂ + 2NaNO₃',
      precipitate: 'White lead(II) chloride',
      safety: 'Lead compounds are toxic: handle with care.',
    },
  },
  {
    a: 'universal-indicator',
    b: 'hydrochloric-acid',
    product: {
      observation: 'The universal indicator turns red, showing that the solution is strongly acidic.',
      mixtureColor: '#ef4444',
      equation: 'Indicator equilibrium shifts in acid',
    },
  },
  {
    a: 'universal-indicator',
    b: 'sulfuric-acid',
    product: {
      observation: 'The universal indicator turns red-orange, showing a strongly acidic solution.',
      mixtureColor: '#f97316',
      equation: 'Indicator equilibrium shifts in acid',
    },
  },
  {
    a: 'universal-indicator',
    b: 'ethanoic-acid',
    product: {
      observation: 'The universal indicator turns orange-yellow, showing a weakly acidic solution.',
      mixtureColor: '#fb923c',
      equation: 'Indicator equilibrium shifts in weak acid',
    },
  },
  {
    a: 'universal-indicator',
    b: 'sodium-hydroxide',
    product: {
      observation: 'The universal indicator turns blue-purple, showing that the solution is strongly alkaline.',
      mixtureColor: '#7c3aed',
      equation: 'Indicator equilibrium shifts in alkali',
    },
  },
  {
    a: 'universal-indicator',
    b: 'ammonia',
    product: {
      observation: 'The universal indicator turns blue-green, showing a weakly alkaline solution.',
      mixtureColor: '#22d3ee',
      equation: 'Indicator equilibrium shifts in weak alkali',
    },
  },
  {
    a: 'universal-indicator',
    b: 'water',
    product: {
      observation: 'The universal indicator stays green, showing that distilled water is neutral.',
      mixtureColor: '#4ade80',
      equation: 'Neutral solution: pH ≈ 7',
    },
  },
  {
    a: 'potassium-permanganate',
    b: 'iron-filings',
    product: {
      observation: 'The purple colour fades as the manganate(VII) ions are reduced to colourless manganese(II) ions.',
      mixtureColor: '#f1f5f9',
      equation: 'MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
      safety: 'Potassium manganate(VII) is a strong oxidising agent.',
    },
  },
];

const keyFor = (a: string, b: string): string => [a, b].sort().join('|');

const reactions = new Map<string, ReactionRule>(
  reactionRules.map((rule) => [keyFor(rule.a, rule.b), rule]),
);

export function findReaction(firstId: string, secondId: string): ReactionProduct | null {
  return reactions.get(keyFor(firstId, secondId))?.product ?? null;
}

export type MixOutcome = {
  observation: string;
  mixtureColor: string;
  equation: string;
  precipitate?: string;
  gas?: string;
  temperatureChange: number;
  safety?: string;
  reacted: boolean;
};

export function mixChemicals(firstId: string, secondId: string): MixOutcome {
  const first = getChemical(firstId);
  const second = getChemical(secondId);

  if (!first || !second) {
    return {
      observation: 'The selected reagents could not be identified, so no reaction was observed.',
      mixtureColor: '#e2e8f0',
      equation: 'No reaction data available',
      temperatureChange: 0,
      reacted: false,
    };
  }

  const reaction = findReaction(firstId, secondId);
  if (!reaction) {
    return {
      observation: `${first.name} and ${second.name} mixed without a visible reaction. The mixture stayed ${first.color === second.color ? 'the same colour' : 'largely unchanged'}.`,
      mixtureColor: first.color,
      equation: 'No reaction observed',
      temperatureChange: 0,
      reacted: false,
    };
  }

  return {
    observation: reaction.observation,
    mixtureColor: reaction.mixtureColor,
    equation: reaction.equation,
    precipitate: reaction.precipitate,
    gas: reaction.gas,
    temperatureChange: reaction.temperatureChange ?? 0,
    safety: reaction.safety,
    reacted: true,
  };
}

export const suggestedReagentsByExperiment: Record<string, string[]> = {
  'acid-base-titration': ['hydrochloric-acid', 'sodium-hydroxide', 'universal-indicator'],
  'reaction-rates': ['hydrochloric-acid', 'sodium-carbonate', 'magnesium-ribbon'],
  'thermochemistry': ['hydrochloric-acid', 'sodium-hydroxide'],
  'crystallization': ['copper-sulfate', 'water'],
  'preparing-a-salt': ['hydrochloric-acid', 'sodium-hydroxide', 'sulfuric-acid'],
  'rusting-of-iron': ['iron-filings', 'water', 'sodium-chloride'],
  'water-of-crystallisation': ['copper-sulfate', 'water'],
  'enthalpy-of-neutralisation': ['hydrochloric-acid', 'sodium-hydroxide'],
  'redox-titration': ['potassium-permanganate', 'iron-filings', 'sulfuric-acid'],
};
