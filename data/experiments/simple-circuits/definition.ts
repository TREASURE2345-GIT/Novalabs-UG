import type { ExperimentDefinition } from '../types';

export const circuitsDefinition: ExperimentDefinition = {
  slug: 'simple-circuits',
  title: 'Simple electric circuits',
  subject: 'physics',
  summary: 'Build a series circuit and investigate how voltage and resistance affect current.',
  apparatusIds: [
    'power-supply',
    'connecting-wires',
    'ammeter',
    'voltmeter',
    'resistor',
    'bulb',
    'switch',
    'rheostat',
  ],
  learningGoals: [
    'Apply Ohm’s law to a series circuit',
    'Measure current in amperes and voltage in volts',
    'Explain how resistance changes bulb brightness',
  ],
  simulation: {
    kind: 'simple-circuits',
    title: 'Circuit simulator',
    safety: 'Keep the power supply off while connecting wires. Do not exceed the rated voltage of the bulb.',
    controls: [
      {
        id: 'voltage',
        label: 'Power supply voltage',
        min: 1.5,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: 'V',
      },
      {
        id: 'resistance',
        label: 'Resistance',
        min: 2,
        max: 50,
        step: 1,
        defaultValue: 10,
        unit: 'Ω',
        hint: 'Use the rheostat to vary resistance while keeping the voltage constant.',
      },
    ],
    run: ({ voltage, resistance }) => {
      const current = voltage / resistance;
      const power = voltage * current;
      const brightness = current > 0.6 ? 'bright' : current > 0.25 ? 'moderately bright' : 'dim';
      return {
        observation: `The bulb glows ${brightness}. Increasing resistance reduces the current in the series circuit.`,
        readings: [
          { label: 'Voltage', value: voltage.toFixed(1), unit: 'V' },
          { label: 'Resistance', value: resistance.toFixed(0), unit: 'Ω' },
          { label: 'Current', value: current.toFixed(2), unit: 'A', highlight: true },
          { label: 'Power', value: power.toFixed(2), unit: 'W' },
        ],
        explanation: `Using I = V / R, a voltage of ${voltage.toFixed(1)} V across ${resistance.toFixed(0)} Ω gives ${current.toFixed(2)} A.`,
      };
    },
  },
};
