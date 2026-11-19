import type { ExperimentDefinition } from '../types';

const endpoint = 24.5;

export const titrationDefinition: ExperimentDefinition = {
  slug: 'acid-base-titration',
  title: 'Acid–base titration',
  subject: 'chemistry',
  summary: 'Titrate hydrochloric acid with sodium hydroxide and determine the endpoint.',
  apparatusIds: [
    'burette',
    'retort-stand',
    'pipette',
    'pipette-filler',
    'conical-flask',
    'white-tile',
    'funnel',
    'acid-bottle',
    'sodium-hydroxide',
    'indicator-bottle',
  ],
  learningGoals: [
    'Read a burette to two decimal places',
    'Identify a permanent endpoint',
    'Calculate a mean titre from concordant results',
  ],
  simulation: {
    kind: 'acid-base-titration',
    title: 'Titration simulator',
    safety: 'Acid and alkali are corrosive. Wear goggles, avoid skin contact and read the burette at eye level.',
    controls: [
      {
        id: 'volume',
        label: 'Volume of acid added',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 20,
        unit: 'cm³',
        hint: 'Add slowly near the endpoint and stop at the first permanent colour change.',
      },
    ],
    run: ({ volume }) => {
      const difference = volume - endpoint;
      if (Math.abs(difference) < 0.05) {
        return {
          observation: 'The indicator changes from pink to colourless and stays colourless for 30 seconds.',
          readings: [
            { label: 'Burette reading', value: volume.toFixed(2), unit: 'cm³', highlight: true },
            { label: 'Endpoint', value: 'Reached', unit: '' },
            { label: 'Titre', value: volume.toFixed(2), unit: 'cm³', highlight: true },
          ],
          explanation: 'The acid and alkali have neutralised each other. The endpoint is the first permanent colour change of the indicator.',
        };
      }
      if (volume < endpoint) {
        return {
          observation: 'The solution remains pink because the alkali is still in excess.',
          readings: [
            { label: 'Burette reading', value: volume.toFixed(2), unit: 'cm³' },
            { label: 'Endpoint', value: 'Not reached', unit: '' },
            { label: 'Acid still needed', value: (endpoint - volume).toFixed(2), unit: 'cm³' },
          ],
          explanation: 'More acid must be added until the alkali has been exactly neutralised.',
        };
      }
      return {
        observation: 'The solution is colourless but the endpoint has been overshot.',
        readings: [
          { label: 'Burette reading', value: volume.toFixed(2), unit: 'cm³' },
          { label: 'Endpoint', value: 'Overshot', unit: '' },
          { label: 'Excess acid', value: (volume - endpoint).toFixed(2), unit: 'cm³' },
        ],
        explanation: 'Overshooting adds excess acid. A titration must be repeated until concordant titres are obtained.',
      };
    },
  },
};
