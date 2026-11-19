import { describe, expect, it } from 'vitest';
import {
  chemicalReagents,
  findReaction,
  getChemical,
  mixChemicals,
  suggestedReagentsByExperiment,
} from './chemicalReagents';

describe('chemical selection and mixing', () => {
  it('has a unique, valid reagent catalog', () => {
    expect(chemicalReagents.length).toBeGreaterThan(10);
    expect(new Set(chemicalReagents.map((reagent) => reagent.id)).size).toBe(chemicalReagents.length);

    for (const reagent of chemicalReagents) {
      expect(reagent.name.length).toBeGreaterThan(0);
      expect(reagent.formula.length).toBeGreaterThan(0);
      expect(getChemical(reagent.id)).toBe(reagent);
    }
  });

  it('only suggests known reagents for experiments', () => {
    for (const ids of Object.values(suggestedReagentsByExperiment)) {
      for (const id of ids) {
        expect(getChemical(id), `missing reagent: ${id}`).toBeDefined();
      }
    }
  });

  it('matches reactions regardless of the order reagents are added', () => {
    const forward = findReaction('hydrochloric-acid', 'sodium-hydroxide');
    const reverse = findReaction('sodium-hydroxide', 'hydrochloric-acid');
    expect(forward).not.toBeNull();
    expect(forward).toEqual(reverse);
  });

  it('reports a neutralisation with a temperature rise', () => {
    const outcome = mixChemicals('hydrochloric-acid', 'sodium-hydroxide');
    expect(outcome.reacted).toBe(true);
    expect(outcome.temperatureChange).toBeGreaterThan(0);
    expect(outcome.observation.toLowerCase()).toContain('neutralise');
    expect(outcome.equation).toContain('NaCl');
  });

  it('detects a gas-producing carbonate reaction', () => {
    const outcome = mixChemicals('hydrochloric-acid', 'calcium-carbonate');
    expect(outcome.reacted).toBe(true);
    expect(outcome.gas).toBe('Carbon dioxide');
    expect(outcome.observation.toLowerCase()).toContain('bubbles');
  });

  it('detects a coloured precipitate', () => {
    const outcome = mixChemicals('lead-nitrate', 'potassium-iodide');
    expect(outcome.reacted).toBe(true);
    expect(outcome.precipitate).toContain('lead(II) iodide');
    expect(outcome.mixtureColor).toBe('#fde047');
  });

  it('handles mixtures with no visible reaction', () => {
    const outcome = mixChemicals('sodium-chloride', 'water');
    expect(outcome.reacted).toBe(false);
    expect(outcome.equation).toBe('No reaction observed');
    expect(outcome.observation).toContain('without a visible reaction');
  });

  it('handles unknown reagent ids safely', () => {
    const outcome = mixChemicals('missing-a', 'missing-b');
    expect(outcome.reacted).toBe(false);
    expect(outcome.observation).toContain('could not be identified');
    expect(outcome.temperatureChange).toBe(0);
  });
});
