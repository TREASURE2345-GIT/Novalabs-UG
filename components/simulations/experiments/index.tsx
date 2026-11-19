import type { ComponentType } from 'react';
import OsmosisSimulation from './OsmosisSimulation';
import EnzymeActivitySimulation from './EnzymeActivitySimulation';
import TitrationSimulation from './TitrationSimulation';
import CircuitsSimulation from './CircuitsSimulation';
import PendulumSimulation from './PendulumSimulation';
import FlameTestsSimulation from './FlameTestsSimulation';

export type SimulationProps = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export const experimentSimulations: Record<string, ComponentType<SimulationProps>> = {
  'osmosis-in-potato-cells': OsmosisSimulation,
  'enzyme-activity-temperature': EnzymeActivitySimulation,
  'acid-base-titration': TitrationSimulation,
  'simple-circuits': CircuitsSimulation,
  'simple-pendulum': PendulumSimulation,
  'flame-tests': FlameTestsSimulation,
};
