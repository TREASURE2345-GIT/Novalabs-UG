import type { ExperimentDefinition } from '../types';

const initialMass = 2.0;

export const osmosisDefinition: ExperimentDefinition = {
  slug: 'osmosis-in-potato-cells',
  title: 'Osmosis in potato cells',
  subject: 'biology',
  summary: 'Measure how potato tissue changes mass in sucrose solutions of different concentration.',
  apparatusIds: [
    'potato',
    'cork-borer',
    'scalpel',
    'ruler',
    'balance',
    'sucrose-solutions',
    'beaker',
    'boiling-tube',
    'test-tube-rack',
    'stopwatch',
  ],
  learningGoals: [
    'Explain osmosis in plant tissue',
    'Calculate percentage change in mass',
    'Identify the isotonic concentration from a graph',
  ],
  simulation: {
    kind: 'potato-osmosis',
    title: 'Potato osmosis simulator',
    safety: 'Cut away from your body and wear goggles when handling potato cylinders and sucrose solutions.',
    controls: [
      {
        id: 'concentration',
        label: 'Sucrose concentration',
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 0.3,
        unit: 'mol/dm³',
        hint: 'Distilled water is 0.0 mol/dm³; concentrated sucrose is 1.0 mol/dm³.',
      },
    ],
    run: ({ concentration }) => {
      const percentChange = 8 - 18 * concentration;
      const finalMass = initialMass * (1 + percentChange / 100);
      const change = finalMass - initialMass;
      const direction = change > 0.005 ? 'gained mass' : change < -0.005 ? 'lost mass' : 'showed no change';
      const observation =
        change > 0.005
          ? 'The potato cylinder feels firm and has gained mass because water moved into the cells by osmosis.'
          : change < -0.005
            ? 'The potato cylinder feels limp and has lost mass because water moved out of the cells by osmosis.'
            : 'The potato cylinder kept the same mass, so the solution is approximately isotonic to the cell sap.';
      return {
        observation,
        readings: [
          { label: 'Initial mass', value: initialMass.toFixed(2), unit: 'g' },
          { label: 'Final mass', value: finalMass.toFixed(2), unit: 'g', highlight: true },
          { label: 'Change in mass', value: change.toFixed(2), unit: 'g' },
          { label: 'Percentage change', value: percentChange.toFixed(1), unit: '%', highlight: true },
        ],
        explanation: `The cylinder ${direction}. Water moves from a region of higher water potential to lower water potential across the partially permeable membrane.`,
      };
    },
  },
};
