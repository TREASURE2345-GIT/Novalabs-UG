import { describe, expect, it } from 'vitest';
import { experimentDefinitions, getExperimentDefinition, getRequiredApparatus } from './experiments';
import { getApparatusById } from './apparatus';
import { experimentCatalog } from './experimentCatalog';
import { simulationOverrides } from './simulationConfigs';

describe('experiment definitions', () => {
  it('ships at least six dedicated interactive experiments', () => {
    expect(experimentDefinitions.length).toBeGreaterThanOrEqual(6);
  });

  it('uses unique slugs and valid apparatus ids', () => {
    const slugs = new Set<string>();
    for (const definition of experimentDefinitions) {
      expect(slugs.has(definition.slug)).toBe(false);
      slugs.add(definition.slug);
      expect(definition.apparatusIds.length).toBeGreaterThan(0);
      for (const id of definition.apparatusIds) {
        expect(getApparatusById(id), `Missing apparatus ${id} for ${definition.slug}`).toBeDefined();
      }
    }
  });

  it('resolves required apparatus in definition order', () => {
    const required = getRequiredApparatus('flame-tests');
    expect(required.map((item) => item.id)).toEqual([
      'nichrome-wire',
      'flame-test-samples',
      'bunsen-burner',
      'white-tile',
      'forceps',
      'test-tube-rack',
      'acid-bottle',
    ]);
  });

  it('produces deterministic readings from each simulator', () => {
    for (const definition of experimentDefinitions) {
      const inputs = Object.fromEntries(
        definition.simulation.controls.map((control) => [control.id, control.defaultValue]),
      );
      const first = definition.simulation.run(inputs);
      const second = definition.simulation.run(inputs);
      expect(first.readings.length).toBeGreaterThan(0);
      expect(first.observation.length).toBeGreaterThan(0);
      expect(first).toEqual(second);
    }
  });

  it('gives every catalog experiment apparatus and a runnable simulation', () => {
    for (const slug of Object.keys(experimentCatalog)) {
      const apparatus = getRequiredApparatus(slug);
      expect(apparatus.length, `${slug} has no apparatus mapping`).toBeGreaterThan(0);
      const hasDedicated = Boolean(getExperimentDefinition(slug));
      const hasModel = Boolean(simulationOverrides[slug]);
      expect(hasDedicated || hasModel, `${slug} has no dedicated simulation or data model`).toBe(true);
    }
  });

  it('has complete practical content for every catalog experiment', () => {
    const issues: string[] = [];
    for (const [slug, experiment] of Object.entries(experimentCatalog)) {
      if (!experiment.aim?.trim()) issues.push(`${slug}: missing aim`);
      if (!experiment.theory?.trim()) issues.push(`${slug}: missing theory`);
      if (experiment.materials.length < 3) issues.push(`${slug}: too few materials`);
      if (experiment.learningObjectives.length === 0) issues.push(`${slug}: no objectives`);
      if ((experiment.precautions?.length ?? 0) === 0) issues.push(`${slug}: no precautions`);
      if (experiment.steps.length < 3) issues.push(`${slug}: too few procedure steps`);
      for (const step of experiment.steps) {
        if (!step.title.trim()) issues.push(`${slug}: untitled step`);
        if (step.instructions.length === 0) issues.push(`${slug}: step "${step.title}" has no instructions`);
      }
    }
    expect(issues).toEqual([]);
  });

  it('keeps every simulation model finite across its control range', () => {
    for (const [slug, config] of Object.entries(simulationOverrides)) {
      for (const value of [config.independent.min, config.independent.defaultValue, config.independent.max]) {
        const result = config.model(value);
        expect(Number.isFinite(result), `${slug} produced a non-finite result at ${value}`).toBe(true);
      }
    }
  });
});
