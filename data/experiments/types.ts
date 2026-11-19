import type { ExperimentEntry } from '../experimentCatalog';

export type SimulationControl = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  hint?: string;
  options?: string[];
};

export type SimulationReading = {
  label: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
};

export type SimulationRun = {
  observation: string;
  readings: SimulationReading[];
  explanation: string;
};

export type SimulationConfig = {
  kind: string;
  title: string;
  safety: string;
  controls: SimulationControl[];
  run: (inputs: Record<string, number>) => SimulationRun;
};

export type ExperimentDefinition = {
  slug: string;
  title: string;
  subject: ExperimentEntry['subject'];
  summary: string;
  apparatusIds: string[];
  learningGoals: string[];
  simulation: SimulationConfig;
};
