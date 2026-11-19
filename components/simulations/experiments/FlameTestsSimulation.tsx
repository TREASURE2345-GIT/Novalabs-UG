import ExperimentSimulator from './ExperimentSimulator';
import { flameTestsDefinition } from '../../../data/experiments/flame-tests/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function FlameTestsSimulation(props: Props) {
  return <ExperimentSimulator definition={flameTestsDefinition} {...props} />;
}
