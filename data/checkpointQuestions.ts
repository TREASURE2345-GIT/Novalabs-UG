import { experimentCatalog, type ExperimentEntry } from './experimentCatalog';

export type CheckpointQuestion = {
  id: string;
  stepIndex: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const hashSlug = (slug: string): number =>
  Array.from(slug).reduce((total, character) => total + character.charCodeAt(0), 0);

const truncate = (text: string, max = 150): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

const unique = (items: string[]): string[] =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const otherEntries = (slug: string): ExperimentEntry[] =>
  Object.values(experimentCatalog).filter((entry) => entry.slug !== slug);

const collect = (
  entries: ExperimentEntry[],
  selector: (entry: ExperimentEntry) => string[] | undefined,
): string[] => entries.flatMap((entry) => selector(entry) ?? []);

const pickDistractors = (pool: string[], correct: string, seed: number, count = 3): string[] => {
  const filtered = unique(pool).filter((item) => item !== correct);
  if (!filtered.length) return [];
  const picked: string[] = [];
  const start = seed % filtered.length;
  for (let index = 0; index < filtered.length && picked.length < count; index += 1) {
    picked.push(filtered[(start + index) % filtered.length]);
  }
  return picked;
};

const buildQuestion = (
  id: string,
  stepIndex: number,
  prompt: string,
  correct: string,
  pool: string[],
  seed: number,
  explanation: string,
  fallbackDistractors: string[],
): CheckpointQuestion => {
  const distractors = pickDistractors([...pool, ...fallbackDistractors], correct, seed);
  const options = [correct, ...distractors];
  const shift = seed % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];

  return {
    id,
    stepIndex,
    prompt,
    options: rotated,
    correctIndex: rotated.indexOf(correct),
    explanation,
  };
};

export function getCheckpointQuestions(experiment: ExperimentEntry): CheckpointQuestion[] {
  const seed = hashSlug(experiment.slug);
  const others = otherEntries(experiment.slug);
  const lastStep = Math.max(0, experiment.steps.length - 1);
  const questions: CheckpointQuestion[] = [];
  const usedSteps = new Set<number>();

  const precaution = experiment.precautions?.[seed % Math.max(experiment.precautions.length, 1)];
  const aim = experiment.aim ?? experiment.description;

  questions.push(
    precaution
      ? buildQuestion(
        `${experiment.slug}-safety`,
        0,
        `Which safety precaution is most important during “${experiment.title}”?`,
        truncate(precaution),
        collect(others, (entry) => entry.precautions).map((item) => truncate(item)),
        seed,
        'This precaution reduces the main risk in this practical. Read the precautions panel before starting.',
        [
          'No safety equipment or care is required for this practical.',
          'It is safe to taste or smell all chemicals directly.',
          'Waste materials can be disposed of without following school rules.',
        ],
      )
      : buildQuestion(
        `${experiment.slug}-aim`,
        0,
        `What is the main aim of “${experiment.title}”?`,
        truncate(aim),
        others.map((entry) => truncate(entry.aim ?? entry.description)),
        seed,
        'The aim states the purpose of the practical and what you are trying to find out.',
        [
          'To memorise the names of the apparatus without using them.',
          'To complete the practical as quickly as possible.',
          'To avoid recording any measurements or observations.',
        ],
      ),
  );
  usedSteps.add(0);

  const expectedResult = experiment.resultsGuidance
    ?? experiment.observationsTemplate?.[0]
    ?? experiment.theory
    ?? experiment.description;
  const resultStep = Math.min(1, lastStep);
  if (!usedSteps.has(resultStep)) {
    questions.push(
      buildQuestion(
        `${experiment.slug}-result`,
        resultStep,
        `Which result would you expect from “${experiment.title}”?`,
        truncate(expectedResult),
        others.map((entry) =>
          truncate(entry.resultsGuidance ?? entry.observationsTemplate?.[0] ?? entry.theory ?? entry.description),
        ),
        seed + 1,
        'Expected results are linked to the theory and the observations template for this practical.',
        [
          'No observable change is expected at any stage.',
          'The result stays exactly the same regardless of the variable changed.',
          'The apparatus should be left running unattended.',
        ],
      ),
    );
    usedSteps.add(resultStep);
  }

  const evaluation = experiment.evaluation?.[0] ?? experiment.theory ?? experiment.description;
  if (!usedSteps.has(lastStep)) {
    questions.push(
      buildQuestion(
        `${experiment.slug}-evaluation`,
        lastStep,
        `Which evaluation point is valid for “${experiment.title}”?`,
        truncate(evaluation),
        collect(others, (entry) => entry.evaluation).map((item) => truncate(item)),
        seed + 2,
        'Evaluation points explain sources of error and how the method could be improved.',
        [
          'The method cannot be improved in any way.',
          'All errors are random and can safely be ignored.',
          'One trial is always enough to draw a valid conclusion.',
        ],
      ),
    );
  }

  return questions.sort((a, b) => a.stepIndex - b.stepIndex);
}
