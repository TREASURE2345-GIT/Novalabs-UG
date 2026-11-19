import type { ExperimentDefinition } from '../types';

const samples = [
  { name: 'Lithium chloride', colour: 'crimson red', formula: 'LiCl' },
  { name: 'Sodium chloride', colour: 'golden yellow', formula: 'NaCl' },
  { name: 'Potassium chloride', colour: 'lilac', formula: 'KCl' },
  { name: 'Calcium chloride', colour: 'brick red', formula: 'CaCl₂' },
  { name: 'Copper(II) chloride', colour: 'blue-green', formula: 'CuCl₂' },
];

export const flameTestsDefinition: ExperimentDefinition = {
  slug: 'flame-tests',
  title: 'Flame tests for metal ions',
  subject: 'chemistry',
  summary: 'Use a clean nichrome wire to identify metal ions from characteristic flame colours.',
  apparatusIds: [
    'nichrome-wire',
    'flame-test-samples',
    'bunsen-burner',
    'white-tile',
    'forceps',
    'test-tube-rack',
    'acid-bottle',
  ],
  learningGoals: [
    'Recall characteristic flame colours for common metal ions',
    'Explain why the wire must be cleaned between tests',
    'Use flame tests to identify an unknown salt',
  ],
  simulation: {
    kind: 'flame-tests',
    title: 'Flame test simulator',
    safety: 'Tie back hair, wear goggles and keep flammable materials away from the Bunsen flame.',
    controls: [
      {
        id: 'sample',
        label: 'Metal salt sample',
        min: 0,
        max: samples.length - 1,
        step: 1,
        defaultValue: 1,
        options: samples.map((sample) => `${sample.name} (${sample.formula})`),
        hint: 'Clean the nichrome wire in acid and rinse with distilled water before each test.',
      },
    ],
    run: ({ sample }) => {
      const selected = samples[Math.round(sample)] ?? samples[0];
      return {
        observation: `The non-luminous flame turns ${selected.colour} when ${selected.name} is heated on the wire.`,
        readings: [
          { label: 'Sample', value: `${selected.name} (${selected.formula})` },
          { label: 'Flame colour', value: selected.colour, highlight: true },
        ],
        explanation:
          'Heat excites electrons in the metal ions. As the electrons return to lower energy levels they emit light of a characteristic wavelength, producing the flame colour.',
      };
    },
  },
};
