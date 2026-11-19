import ExperimentSimulator from './ExperimentSimulator';
import { circuitsDefinition } from '../../../data/experiments/simple-circuits/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function CircuitsSimulation(props: Props) {
  return <ExperimentSimulator definition={circuitsDefinition} {...props} />;
}
