import { describe, expect, it } from 'vitest';
import { experimentCatalog } from './experimentCatalog';
import { getCheckpointQuestions } from './checkpointQuestions';

describe('checkpoint questions', () => {
  const experiments = Object.values(experimentCatalog);

  it('generates valid, step-aligned questions for every experiment', () => {
    for (const experiment of experiments) {
      const questions = getCheckpointQuestions(experiment);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(3);

      for (const question of questions) {
        expect(question.stepIndex).toBeGreaterThanOrEqual(0);
        expect(question.stepIndex).toBeLessThan(experiment.steps.length);
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThan(question.options.length);
        expect(new Set(question.options).size).toBe(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(0);
      }

      const stepIndexes = questions.map((question) => question.stepIndex);
      expect(new Set(stepIndexes).size).toBe(stepIndexes.length);
    }
  });

  it('is deterministic for the same experiment', () => {
    const experiment = experimentCatalog['acid-base-titration'];
    expect(getCheckpointQuestions(experiment)).toEqual(getCheckpointQuestions(experiment));
  });

  it('uses experiment-specific safety content when available', () => {
    const experiment = experimentCatalog['dna-extraction'];
    const [safety] = getCheckpointQuestions(experiment);
    const correct = safety.options[safety.correctIndex];
    const expected = experiment.precautions?.some((precaution) => correct.startsWith(precaution.slice(0, 40)));

    expect(expected).toBe(true);
  });
});
