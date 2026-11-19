import { useMemo, useState } from 'react';
import type { ExperimentEntry } from '../../data/experimentCatalog';
import type { PracticalEvidence } from '../../types';
import { experimentCurriculum, experimentReadings } from '../../data/apparatusCatalog';
import { apparatus } from '../../data/apparatus';
import { getDistractorApparatus, getRequiredApparatus } from '../../data/experiments';
import { useAuth } from '../../hooks/useAuth';
import { useExperimentSession } from '../../hooks/useExperimentSession';
import ApparatusWorkbench from './ApparatusWorkbench';

type ApparatusSectionProps = {
  experiment: ExperimentEntry;
  currentStep: number;
  initialEvidence?: PracticalEvidence;
  onPracticalComplete: () => void;
  onEvidenceChange?: (evidence: PracticalEvidence) => void;
};

const subjectAccent: Record<ExperimentEntry['subject'], string> = {
  biology: '#22c55e',
  chemistry: '#a855f7',
  physics: '#f59e0b',
  agriculture: '#eab308',
};

const safetyApparatus = apparatus.filter((item) => item.category === 'safety');

export default function ApparatusSection({
  experiment,
  currentStep,
  initialEvidence,
  onPracticalComplete,
  onEvidenceChange,
}: ApparatusSectionProps) {
  const { user } = useAuth();
  const required = useMemo(() => getRequiredApparatus(experiment.slug), [experiment.slug]);
  const distractors = useMemo(() => getDistractorApparatus(experiment.slug), [experiment.slug]);
  const apparatusById = useMemo(() => new Map(apparatus.map((item) => [item.id, item])), []);
  const session = useExperimentSession({
    experimentId: experiment.slug,
    required,
    distractors,
    apparatusById,
    userId: user?.id ?? null,
  });

  const [measurement, setMeasurement] = useState(initialEvidence?.measurement ?? '');
  const [observation, setObservation] = useState(initialEvidence?.observation ?? '');
  const [submitted, setSubmitted] = useState(initialEvidence?.submitted ?? false);
  const [message, setMessage] = useState('');

  const curriculum = experimentCurriculum[experiment.slug];
  const reading =
    experimentReadings[experiment.slug] ??
    'The apparatus responds as expected and the observation is ready to record.';
  const activeStep = experiment.steps[Math.min(currentStep, Math.max(experiment.steps.length - 1, 0))];
  const accent = subjectAccent[experiment.subject];

  const evidence = useMemo<PracticalEvidence>(
    () => ({
      measurement,
      observation,
      submitted,
      apparatusPlaced: session.placed.length,
      apparatusUsed: session.usedIds.length,
      totalApparatus: required.length,
      trialReadings: session.events.filter((event) => event.action === 'dispense').length,
    }),
    [measurement, observation, session.events, session.placed.length, session.usedIds.length, submitted, required.length],
  );

  const updateMeasurement = (value: string) => {
    setMeasurement(value);
    setSubmitted(false);
    onEvidenceChange?.({ ...evidence, measurement: value, submitted: false });
  };

  const updateObservation = (value: string) => {
    setObservation(value);
    setSubmitted(false);
    onEvidenceChange?.({ ...evidence, observation: value, submitted: false });
  };

  const submitPractical = () => {
    const result = session.checkSetup();
    if (!result.ok) {
      setMessage('Finish the apparatus setup before submitting. Follow the feedback in the score panel.');
      return;
    }
    if (!measurement.trim() || !observation.trim()) {
      setMessage('Record both your measurement and your observation before submitting.');
      return;
    }
    setSubmitted(true);
    setMessage('Practical evidence submitted. Your setup and readings have been saved.');
    onEvidenceChange?.({ ...evidence, submitted: true });
    onPracticalComplete();
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Interactive practical bench</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            {activeStep
              ? `Step ${Math.min(currentStep + 1, experiment.steps.length)}: ${activeStep.title}`
              : 'Set up the apparatus, add protective equipment and record your evidence.'}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          {required.length} required items
        </span>
      </div>

      <ApparatusWorkbench
        session={session}
        required={required}
        distractors={distractors}
        safety={safetyApparatus}
        accent={accent}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="practical-measurement" className="text-sm font-semibold text-slate-800">
            Measurement
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Record the key reading with its unit, for example 24.50 cm3 or 35 °C.
          </p>
          <input
            id="practical-measurement"
            value={measurement}
            onChange={(event) => updateMeasurement(event.target.value)}
            placeholder="Enter your measurement"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="practical-observation" className="text-sm font-semibold text-slate-800">
            Observation
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Describe what you saw happen on the bench, using scientific terms.
          </p>
          <textarea
            id="practical-observation"
            value={observation}
            onChange={(event) => updateObservation(event.target.value)}
            rows={3}
            placeholder="Describe the colour change, gas bubbles, movement or reading trend."
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-sky-950">Expected observation</p>
        <p className="mt-1 text-sm text-sky-800">{reading}</p>
        {curriculum ? (
          <p className="mt-2 text-xs text-sky-700">
            <span className="font-semibold">Curriculum:</span> {curriculum.ncdc}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submitPractical}
          disabled={submitted}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        >
          {submitted ? 'Evidence submitted' : 'Submit practical evidence'}
        </button>
        <p className="text-sm text-slate-600" aria-live="polite">
          {message ||
            (submitted
              ? 'You can still adjust your readings, which will reopen the submission.'
              : 'Add the required apparatus and protective equipment, then check your setup.')}
        </p>
      </div>

      <ul className="grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
        <li className="rounded-lg bg-white px-3 py-2 shadow-sm">
          Apparatus placed: <span className="font-semibold">{session.placed.length}</span>
        </li>
        <li className="rounded-lg bg-white px-3 py-2 shadow-sm">
          Apparatus used: <span className="font-semibold">{session.usedIds.length}</span>
        </li>
        <li className="rounded-lg bg-white px-3 py-2 shadow-sm">
          Trials recorded: <span className="font-semibold">{evidence.trialReadings}</span>
        </li>
      </ul>
    </section>
  );
}
