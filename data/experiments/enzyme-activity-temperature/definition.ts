import type { ExperimentDefinition } from '../types';

function gasRate(temperature: number): number {
  if (temperature >= 65) return Math.max(0, 4 - (temperature - 65) * 0.4);
  const optimum = 37;
  return 64 * Math.exp(-((temperature - optimum) ** 2) / (2 * 11 ** 2));
}

export const enzymeDefinition: ExperimentDefinition = {
  slug: 'enzyme-activity-temperature',
  title: 'Enzyme activity and temperature',
  subject: 'biology',
  summary: 'Measure catalase activity in potato at different temperatures and find the optimum.',
  apparatusIds: [
    'potato',
    'cork-borer',
    'scalpel',
    'ruler',
    'hydrogen-peroxide-bottle',
    'test-tube',
    'test-tube-rack',
    'measuring-cylinder',
    'water-bath',
    'thermometer',
    'stopwatch',
    'syringe',
    'delivery-tube',
  ],
  learningGoals: [
    'Describe the effect of temperature on enzyme activity',
    'Explain denaturation at high temperature',
    'Identify the optimum temperature from data',
  ],
  simulation: {
    kind: 'enzyme-temperature',
    title: 'Catalase temperature simulator',
    safety: 'Hydrogen peroxide irritates skin and eyes. Wear goggles and rinse spills immediately.',
    controls: [
      {
        id: 'temperature',
        label: 'Water bath temperature',
        min: 10,
        max: 80,
        step: 1,
        defaultValue: 35,
        unit: '°C',
        hint: 'Use a thermometer to confirm the water bath temperature before adding the potato.',
      },
    ],
    run: ({ temperature }) => {
      const rate = gasRate(temperature);
      const observation =
        temperature >= 65
          ? 'Very few bubbles form because the catalase has been denatured by the high temperature.'
          : temperature >= 30 && temperature <= 45
            ? 'Bubbles are produced rapidly; this is close to the optimum temperature.'
            : 'Bubbles are produced slowly, showing that the enzyme is working below its optimum rate.';
      return {
        observation,
        readings: [
          { label: 'Temperature', value: temperature.toFixed(0), unit: '°C' },
          { label: 'Gas volume in 1 minute', value: rate.toFixed(0), unit: 'cm³', highlight: true },
          { label: 'Relative activity', value: `${Math.round((rate / 64) * 100)}`, unit: '%' },
        ],
        explanation:
          'Enzyme activity rises with temperature until the optimum, then falls sharply as the enzyme active site changes shape and the enzyme denatures.',
      };
    },
  },
};
