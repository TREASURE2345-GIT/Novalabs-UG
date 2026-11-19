import ExperimentSimulator from './ExperimentSimulator';
import { pendulumDefinition } from '../../../data/experiments/simple-pendulum/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function PendulumSimulation(props: Props) {
  return <ExperimentSimulator definition={pendulumDefinition} {...props} />;
}
