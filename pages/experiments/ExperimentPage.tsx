import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import LabAIGuide from '@components/ai/LabAIGuide';
import ApparatusSection from '@components/apparatus/ApparatusSection';
import ChemicalMixer from '@components/chemistry/ChemicalMixer';
import CheckpointCard from '@components/experiments/CheckpointCard';
import QuantitativeSimulation from '@components/simulations/QuantitativeSimulation';
import { experimentSimulations } from '@components/simulations/experiments';
import { experimentCatalog } from '../../data/experimentCatalog';
import { getExperimentDefinition } from '../../data/experiments';
import { getCheckpointQuestions } from '../../data/checkpointQuestions';
import { getProgress, setProgress } from '../../services/progressService';
import { getReportsForStudent, submitReport } from '../../services/reportService';
import { validatePractical } from '../../services/validationService';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import type { PracticalEvidence } from '../../types';

const clampStep = (value: unknown, totalSteps: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, Math.floor(value)), Math.max(0, totalSteps - 1));
};

export default function ExperimentPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { can } = usePermissions();
  const experiment = useMemo(() => slug ? experimentCatalog[slug] : undefined, [slug]);
  const SimulationComponent = useMemo(
    () => (slug ? experimentSimulations[slug] : undefined),
    [slug],
  );
  const hasDedicatedSimulation = useMemo(() => Boolean(getExperimentDefinition(slug)), [slug]);

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [practicalComplete, setPracticalComplete] = useState(false);
  const [evidence, setEvidence] = useState<PracticalEvidence>({
    measurement: '',
    observation: '',
    submitted: false,
    apparatusPlaced: 0,
    apparatusUsed: 0,
    totalApparatus: 0,
    trialReadings: 0,
  });
  const [conclusion, setConclusion] = useState('');
  const [chemicalObservation, setChemicalObservation] = useState('');
  const [chemicalMeasurement, setChemicalMeasurement] = useState('');
  const [simulationTrialCount, setSimulationTrialCount] = useState(0);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, boolean>>({});
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportGraded, setReportGraded] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportAttachment, setReportAttachment] = useState<{ name: string; url: string } | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const progressLoaded = useRef(false);

  useEffect(() => {
    progressLoaded.current = false;
    if (!experiment) {
      setCurrentStep(0);
      setScore(0);
      setPracticalComplete(false);
      setLoadedSlug(null);
      return;
    }

    const progress = getProgress(slug ?? 'unknown', user?.id ?? null);
    progressLoaded.current = true;
    if (progress) {
      setCurrentStep(clampStep(progress.currentStep, experiment.steps.length));
      setScore(progress.score ?? 0);
      setPracticalComplete(progress.practicalComplete === true);
      setEvidence({
        measurement: typeof progress.measurement === 'string' ? progress.measurement : '',
        observation: typeof progress.observation === 'string' ? progress.observation : '',
        submitted: progress.practicalComplete === true,
        apparatusPlaced: 0,
        apparatusUsed: 0,
        totalApparatus: 0,
        trialReadings: 0,
      });
      setConclusion(typeof progress.conclusion === 'string' ? progress.conclusion : '');
      setChemicalObservation(typeof progress.chemicalObservation === 'string' ? progress.chemicalObservation : '');
      setChemicalMeasurement(typeof progress.chemicalMeasurement === 'string' ? progress.chemicalMeasurement : '');
      setSimulationTrialCount(typeof progress.dataPoints === 'number' ? progress.dataPoints : 0);
      setCheckpointAnswers(progress.checkpoints ?? {});
      const existingReport = user?.id
        ? getReportsForStudent(user.id).find((report) => report.experimentSlug === slug)
        : undefined;
      setReportSubmitted(Boolean(existingReport));
      setReportGraded(existingReport?.status === 'graded');
      setReportAttachment(
        existingReport?.teacherAttachmentUrl
          ? {
            name: existingReport.teacherAttachmentName ?? 'Teacher attachment',
            url: existingReport.teacherAttachmentUrl,
          }
          : null,
      );
      setReportMessage(
        existingReport
          ? existingReport.status === 'graded'
            ? `Report graded: ${existingReport.teacherScore}%${existingReport.teacherFeedback ? ` · ${existingReport.teacherFeedback}` : ''}`
            : `Report submitted ${new Date(existingReport.submittedAt).toLocaleString()} · awaiting teacher review`
          : '',
      );
    } else {
      setProgress(slug ?? 'unknown', { currentStep: 0, score: 0, totalSteps: experiment.steps.length }, user?.id ?? null);
      setCurrentStep(0);
      setScore(0);
      setPracticalComplete(false);
      setEvidence({
        measurement: '',
        observation: '',
        submitted: false,
        apparatusPlaced: 0,
        apparatusUsed: 0,
        totalApparatus: 0,
        trialReadings: 0,
      });
      setConclusion('');
      setChemicalObservation('');
      setChemicalMeasurement('');
      setSimulationTrialCount(0);
      setCheckpointAnswers({});
      setReportSubmitted(false);
      setReportGraded(false);
      setReportMessage('');
      setReportAttachment(null);
    }
    progressLoaded.current = true;
    setLoadedSlug(slug ?? null);
  }, [experiment, slug, user?.id]);

  useEffect(() => {
    if (!experiment || !slug || !progressLoaded.current) {
      return;
    }

    const completed = score >= 50;
    setProgress(slug, {
      currentStep,
      score,
      totalSteps: experiment.steps.length,
      completedSteps: completed ? experiment.steps.length : Math.min(currentStep, experiment.steps.length),
      completed,
      practicalComplete,
      measurement: evidence.measurement,
      observation: evidence.observation,
      conclusion,
      chemicalObservation,
      chemicalMeasurement,
      dataPoints: simulationTrialCount,
      checkpoints: checkpointAnswers,
    }, user?.id ?? null);
  }, [currentStep, score, practicalComplete, evidence, conclusion, chemicalObservation, chemicalMeasurement, simulationTrialCount, checkpointAnswers, experiment, slug, user?.id]);

  useEffect(() => {
    if (searchParams.get('setup') !== '1') return;
    const timer = window.setTimeout(() => {
      document.getElementById('apparatus-setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [searchParams, slug]);

  const combinedEvidence = useMemo(
    () => ({
      ...evidence,
      observation: [evidence.observation, chemicalObservation].filter(Boolean).join(' ').trim(),
      measurement: evidence.measurement || chemicalMeasurement,
      submitted: practicalComplete || evidence.submitted,
    }),
    [evidence, chemicalObservation, chemicalMeasurement, practicalComplete],
  );

  const validation = useMemo(
    () => (experiment ? validatePractical(experiment, combinedEvidence, conclusion, simulationTrialCount) : null),
    [experiment, combinedEvidence, conclusion, simulationTrialCount],
  );

  const checkpointQuestions = useMemo(
    () => (experiment ? getCheckpointQuestions(experiment) : []),
    [experiment],
  );

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-5xl mb-4">🔎</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Experiment not found</h1>
          <p className="text-gray-600 mb-6">This experiment is not available yet or the link is invalid.</p>
          <Link to="/dashboard" className="btn-primary inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loadedSlug !== slug) {
    return (
      <div className="mx-auto max-w-4xl py-16 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-semibold text-gray-600">Loading your experiment evidence…</p>
        </div>
      </div>
    );
  }

  const totalSteps = experiment.steps.length;
  const checkpoint = checkpointQuestions.find((question) => question.stepIndex === currentStep);
  const checkpointAnswered = !checkpoint || checkpointAnswers[checkpoint.stepIndex] !== undefined;

  const handleAdvance = () => {
    if (!checkpointAnswered) {
      setFeedback('Answer the checkpoint question for this step before continuing.');
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setFeedback('');
      return;
    }

    if (!practicalComplete) {
      setFeedback('Complete the virtual bench and submit your practical evidence before finishing.');
      return;
    }

    if (!validation?.readyForSubmission) {
      setFeedback('Write a conclusion of at least a few sentences, with reasoning, before finishing.');
      return;
    }

    setScore(validation.score);
    setFeedback(
      validation.score >= 50
        ? `✓ Experiment graded: ${validation.score}% (${validation.grade}). Review any remaining feedback to improve your report.`
        : `Graded ${validation.score}% (${validation.grade}). Improve the highlighted criteria and finish again to raise your score.`,
    );
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setFeedback('');
  };

  const handleSubmitReport = () => {
    if (!experiment || !validation || !can('progress.write.self')) {
      return;
    }
    if (!validation.readyForSubmission) {
      setReportMessage('Complete the bench evidence and write a conclusion before submitting the report.');
      return;
    }

    const report = submitReport({
      experimentSlug: experiment.slug,
      experimentTitle: experiment.title,
      subject: experiment.subject,
      studentId: user?.id ?? 'guest',
      studentName: user?.name ?? 'Guest learner',
      measurement: combinedEvidence.measurement,
      observation: combinedEvidence.observation,
      conclusion,
      apparatusPlaced: combinedEvidence.apparatusPlaced,
      apparatusUsed: combinedEvidence.apparatusUsed,
      totalApparatus: combinedEvidence.totalApparatus,
      trials: simulationTrialCount,
      autoScore: validation.score,
      autoGrade: validation.grade,
      criteria: validation.criteria,
    });

    setReportSubmitted(true);
    setReportGraded(false);
    setReportAttachment(null);
    setReportMessage(`Report submitted ${new Date(report.submittedAt).toLocaleString()} · awaiting teacher review`);
  };

  const subjectTheme: Record<string, string> = {
    biology: 'from-green-600 to-green-800',
    chemistry: 'from-purple-600 to-purple-800',
    physics: 'from-yellow-500 to-yellow-700',
    agriculture: 'from-amber-500 to-amber-700'
  };

  const step = experiment.steps[clampStep(currentStep, totalSteps)];

  return (
    <div className="max-w-7xl mx-auto">
      <div className={`bg-gradient-to-r ${subjectTheme[experiment.subject]} text-white rounded-lg p-8 mb-8`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{experiment.icon}</span>
          <h1 className="text-3xl font-bold">{experiment.title}</h1>
        </div>
        <p className="text-white/90">{experiment.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aim</h2>
          <p className="text-gray-700 mb-4">{experiment.aim ?? experiment.description}</p>
          {experiment.theory && (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Theory</h3>
              <p className="text-gray-700 leading-7">{experiment.theory}</p>
            </>
          )}
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            {experiment.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Apparatus &amp; Materials</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            {experiment.materials.map((material) => (
              <li key={material} className="flex items-start gap-2">
                <span className="mt-1 text-blue-600">•</span>
                <span>{material}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {experiment.precautions && experiment.precautions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg shadow p-6 mb-8 border border-amber-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Precautions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {experiment.precautions.map((precaution) => (
              <li key={precaution}>{precaution}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8">
        <LabAIGuide
          labName={experiment.title}
          topic={experiment.title}
          relatedTopics={experiment.learningObjectives}
        />
      </div>

      <div id="apparatus-setup" className="scroll-mt-24">
        <ApparatusSection
          key={experiment.slug}
          experiment={experiment}
          currentStep={currentStep}
          initialEvidence={evidence}
          onEvidenceChange={setEvidence}
          onPracticalComplete={() => {
            setPracticalComplete(true);
            setFeedback('Practical evidence submitted. Continue with the procedure.');
          }}
        />
      </div>

      {experiment.subject === 'chemistry' && !hasDedicatedSimulation && (
        <ChemicalMixer
          experiment={experiment}
          onObservation={(observation) =>
            setChemicalObservation((current) => (current ? `${current} ${observation}` : observation))
          }
          onMeasurement={setChemicalMeasurement}
        />
      )}

      {SimulationComponent ? (
        <SimulationComponent
          onObservation={(observation) =>
            setChemicalObservation((current) => (current ? `${current} ${observation}` : observation))
          }
          onTrial={setSimulationTrialCount}
        />
      ) : (
        <QuantitativeSimulation
          experiment={experiment}
          onDataChange={(trials) => setSimulationTrialCount(trials.length)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Procedure</h2>
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {totalSteps}</span>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-700 mb-4">{step.description}</p>

              <ul className="space-y-2">
                {step.instructions.map((instruction) => (
                  <li key={instruction} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 text-blue-600">→</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>

              {checkpoint && (
                <CheckpointCard
                  key={checkpoint.id}
                  question={checkpoint}
                  answered={checkpointAnswers[checkpoint.stepIndex] !== undefined}
                  onAnswered={(correct) =>
                    setCheckpointAnswers((current) => ({ ...current, [checkpoint.stepIndex]: correct }))
                  }
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button onClick={handlePrevious} disabled={currentStep === 0} className="btn-secondary disabled:opacity-50">
                ← Previous
              </button>

              <div className="flex-1 px-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              <button onClick={handleAdvance} className="btn-success">
                {currentStep === totalSteps - 1 ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Experiment Summary</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold">Subject:</span> {experiment.subject}</p>
              <p><span className="font-semibold">Level:</span> {experiment.level}</p>
              <p><span className="font-semibold">Difficulty:</span> {experiment.difficulty}</p>
              <p><span className="font-semibold">Duration:</span> {experiment.duration}</p>
              <p>
                <span className="font-semibold">Checkpoints:</span>{' '}
                {Object.values(checkpointAnswers).filter(Boolean).length}/{checkpointQuestions.length} correct
              </p>
            </div>
          </div>

          {feedback && (
            <div className="rounded-lg p-4 mb-6 font-medium bg-green-50 text-green-800 border border-green-200">
              {feedback}
            </div>
          )}

          {validation && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Practical validation</h3>
                  <p className="text-xs text-gray-500">Live marks out of {validation.maxScore}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  validation.score >= 70
                    ? 'bg-green-100 text-green-800'
                    : validation.score >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                }`}>
                  {validation.score}% · {validation.grade}
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all ${
                    validation.score >= 70 ? 'bg-green-600' : validation.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${validation.score}%` }}
                />
              </div>

              <ul className="mt-4 space-y-3">
                {validation.criteria.map((criterion) => (
                  <li key={criterion.id}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 font-semibold text-gray-800">
                        <span className={criterion.passed ? 'text-green-600' : 'text-rose-500'}>
                          {criterion.passed ? '✓' : '✕'}
                        </span>
                        {criterion.label}
                      </span>
                      <span className="font-mono text-xs text-gray-600">{criterion.marks}/{criterion.maxMarks}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${criterion.passed ? 'bg-green-500' : 'bg-rose-400'}`}
                        style={{ width: `${(criterion.marks / criterion.maxMarks) * 100}%` }}
                      />
                    </div>
                    {!criterion.passed && (
                      <p className="mt-1 text-xs leading-5 text-gray-600">{criterion.feedback}</p>
                    )}
                  </li>
                ))}
              </ul>

              <label htmlFor="experiment-conclusion" className="mt-5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Conclusion
              </label>
              <textarea
                id="experiment-conclusion"
                value={conclusion}
                onChange={(event) => setConclusion(event.target.value)}
                rows={4}
                placeholder="Explain what happened and why, using your evidence. E.g. 'The rate increased because...'"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                {conclusion.trim() ? `${conclusion.trim().split(/\s+/).length} words written.` : 'A conclusion is required before finishing.'}
              </p>

              {can('progress.write.self') ? (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-bold text-blue-950">Lab report</p>
                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Send your evidence, conclusion and automatic assessment to your teacher for grading.
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmitReport}
                    disabled={!validation.readyForSubmission || reportGraded}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {reportGraded ? 'Report graded' : reportSubmitted ? 'Update submitted report' : 'Submit lab report for grading'}
                  </button>
                  {reportMessage && (
                    <p className={`mt-2 text-xs font-medium ${reportGraded ? 'text-emerald-700' : 'text-blue-800'}`}>
                      {reportMessage}
                    </p>
                  )}
                  {reportAttachment && (
                    <a
                      href={reportAttachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-blue-700 underline"
                    >
                      Teacher attachment: {reportAttachment.name}
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                  Teacher preview: lab reports are submitted by students after they complete the practical.
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h4 className="font-bold text-gray-900 mb-4">Score: {score}%</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Final grading uses five criteria: apparatus, repeated trials, measurement, observation and conclusion.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
