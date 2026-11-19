import type { ExperimentDefinition } from '../types';

const gravity = 9.81;

export const pendulumDefinition: ExperimentDefinition = {
  slug: 'simple-pendulum',
  title: 'Simple pendulum and g',
  subject: 'physics',
  summary: 'Time oscillations of a simple pendulum and determine acceleration due to gravity.',
  apparatusIds: [
    'pendulum-bob',
    'thread',
    'retort-stand',
    'rubber-bung',
    'stopwatch',
    'ruler',
    'protractor',
    'balance',
  ],
  learningGoals: [
    'Measure the period of a simple pendulum',
    'Use T = 2π√(l/g) to find g',
    'Describe how length affects the period',
  ],
  simulation: {
    kind: 'simple-pendulum',
    title: 'Pendulum simulator',
    safety: 'Clamp the stand securely and keep feet clear of the swinging bob.',
    controls: [
      {
        id: 'length',
        label: 'Pendulum length',
        min: 0.2,
        max: 2,
        step: 0.05,
        defaultValue: 1,
        unit: 'm',
        hint: 'Measure from the support to the centre of the bob.',
      },
      {
        id: 'angle',
        label: 'Release angle',
        min: 5,
        max: 30,
        step: 1,
        defaultValue: 10,
        unit: '°',
        hint: 'Use a small angle so the simple pendulum approximation remains valid.',
      },
    ],
    run: ({ length, angle }) => {
      const period = 2 * Math.PI * Math.sqrt(length / gravity);
      const frequency = 1 / period;
      const timeForTen = period * 10;
      const measuredG = (4 * Math.PI ** 2 * length) / period ** 2;
      return {
        observation: `The bob completes ten oscillations in ${timeForTen.toFixed(2)} s. A longer pendulum swings more slowly.`,
        readings: [
          { label: 'Length', value: length.toFixed(2), unit: 'm' },
          { label: 'Release angle', value: angle.toFixed(0), unit: '°' },
          { label: 'Period T', value: period.toFixed(3), unit: 's', highlight: true },
          { label: 'Frequency', value: frequency.toFixed(2), unit: 'Hz' },
          { label: 'Time for 10 swings', value: timeForTen.toFixed(2), unit: 's', highlight: true },
          { label: 'Calculated g', value: measuredG.toFixed(2), unit: 'm/s²' },
        ],
        explanation: `Rearranging T = 2π√(l/g) gives g = 4π²l/T². The period depends on length and g, not on the mass of the bob.`,
      };
    },
  },
};
