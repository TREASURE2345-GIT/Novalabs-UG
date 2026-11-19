import type { ExperimentDefinition } from './experiments/types';
import { osmosisDefinition } from './experiments/osmosis-in-potato-cells/definition';
import { enzymeDefinition } from './experiments/enzyme-activity-temperature/definition';
import { titrationDefinition } from './experiments/acid-base-titration/definition';
import { circuitsDefinition } from './experiments/simple-circuits/definition';
import { pendulumDefinition } from './experiments/simple-pendulum/definition';
import { flameTestsDefinition } from './experiments/flame-tests/definition';
import {
  getApparatusById,
  getApparatusForExperiment,
  getDistractorsForExperiment,
} from './apparatus';
import type { Apparatus } from '../types/apparatus';

export const experimentDefinitions: ExperimentDefinition[] = [
  osmosisDefinition,
  enzymeDefinition,
  titrationDefinition,
  circuitsDefinition,
  pendulumDefinition,
  flameTestsDefinition,
];

export const experimentDefinitionsBySlug: Record<string, ExperimentDefinition> =
  Object.fromEntries(experimentDefinitions.map((definition) => [definition.slug, definition]));

export function getExperimentDefinition(slug: string | undefined): ExperimentDefinition | undefined {
  if (!slug) return undefined;
  return experimentDefinitionsBySlug[slug];
}

export function getRequiredApparatus(slug: string): Apparatus[] {
  const definition = getExperimentDefinition(slug);
  if (definition) {
    return definition.apparatusIds.flatMap((id) => {
      const item = getApparatusById(id);
      return item ? [item] : [];
    });
  }
  return getApparatusForExperiment(slug);
}

export function getDistractorApparatus(slug: string): Apparatus[] {
  return getDistractorsForExperiment(slug);
}

export type { ExperimentDefinition };
