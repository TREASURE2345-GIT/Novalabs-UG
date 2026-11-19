import ExperimentSimulator from './ExperimentSimulator';
import { titrationDefinition } from '../../../data/experiments/acid-base-titration/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function TitrationSimulation(props: Props) {
  return <ExperimentSimulator definition={titrationDefinition} {...props} />;
}
