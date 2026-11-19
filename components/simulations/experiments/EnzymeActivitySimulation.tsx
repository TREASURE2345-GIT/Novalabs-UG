import ExperimentSimulator from './ExperimentSimulator';
import { enzymeDefinition } from '../../../data/experiments/enzyme-activity-temperature/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function EnzymeActivitySimulation(props: Props) {
  return <ExperimentSimulator definition={enzymeDefinition} {...props} />;
}
