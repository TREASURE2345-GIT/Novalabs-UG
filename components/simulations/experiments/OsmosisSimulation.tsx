import ExperimentSimulator from './ExperimentSimulator';
import { osmosisDefinition } from '../../../data/experiments/osmosis-in-potato-cells/definition';

type Props = {
  onObservation?: (observation: string) => void;
  onTrial?: (trialCount: number) => void;
};

export default function OsmosisSimulation(props: Props) {
  return <ExperimentSimulator definition={osmosisDefinition} {...props} />;
}
