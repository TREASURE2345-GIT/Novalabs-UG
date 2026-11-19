import { Link } from 'react-router-dom';
import type { Subject } from '../../types';
import { experimentCatalog } from '../../data/experimentCatalog';
import { getProgressForUser } from '../../services/progressService';
import { useAuth } from '../../hooks/useAuth';
import SubjectIcon from '../ui/SubjectIcon';
import ApparatusPreview from '../apparatus/ApparatusPreview';
import ExperimentGrid from './ExperimentGrid';

type SubjectLabPageProps = {
  subject: Subject;
  title: string;
  description: string;
  theme: string;
};

export default function SubjectLabPage({ subject, title, description, theme }: SubjectLabPageProps) {
  const { user } = useAuth();
  const progressEntries = getProgressForUser(user?.id);
  const experiments = Object.values(experimentCatalog).filter((experiment) => experiment.subject === subject);
  const olevelExperiments = experiments.filter((experiment) => experiment.level === 'olevel');
  const alevelExperiments = experiments.filter((experiment) => experiment.level === 'alevel');
  const completed = experiments.filter((experiment) => progressEntries[experiment.slug]?.completed).length;
  const practicals = experiments.filter((experiment) => progressEntries[experiment.slug]?.practicalComplete).length;
  const progress = experiments.length
    ? Math.round(experiments.reduce((total, experiment) => total + (progressEntries[experiment.slug]?.score ?? 0), 0) / experiments.length)
    : 0;

  return (
    <div className="mx-auto max-w-7xl pb-6">
      <div className={`mb-8 rounded-2xl bg-gradient-to-r ${theme} p-8 text-white shadow-lg`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SubjectIcon subject={subject} title={title} className="h-16 w-16 ring-1 ring-white/40" />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/75">Virtual practical workbook</p>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/85">{description}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-white/75">Practical readiness</p>
            <p className="mt-1 text-3xl font-bold">{practicals}/{experiments.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <InfoCard label="Experiments" value={String(experiments.length)} />
        <InfoCard label="Completed" value={`${completed}/${experiments.length}`} />
        <InfoCard label="Average progress" value={`${progress}%`} />
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose a practical</h2>
          <p className="mt-1 text-sm text-gray-600">Every investigation includes apparatus, a guided trial, evidence capture, and a conclusion. Aligned to NCDC/UNEB practical requirements.</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">{experiments.length} practicals</span>
      </div>

      <div className={alevelExperiments.length ? 'mb-8' : ''}>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">O-Level ({olevelExperiments.length})</h3>
        <ExperimentGrid>
          {olevelExperiments.map((experiment) => {
            const saved = progressEntries[experiment.slug];
            const progressPercent = saved?.completed ? 100 : saved?.score ?? 0;
            return (
              <article key={experiment.slug} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
                  <SubjectIcon subject={subject} title={`${experiment.title} related visual`} className="h-14 w-14" />
                  <span className="text-3xl" aria-hidden="true">{experiment.icon}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">{experiment.difficulty}</span>
                    <span className="text-xs text-gray-500">{experiment.duration}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-gray-900">{experiment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{experiment.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(experiment.relatedTopics ?? []).slice(0, 3).map((topic) => <span key={topic} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{topic}</span>)}
                  </div>
                  <ApparatusPreview slug={experiment.slug} title="Apparatus to set up" />
                  <div className="mt-5">
                    <div className="mb-1 flex justify-between text-xs text-gray-500"><span>{saved?.practicalComplete ? 'Practical evidence saved' : 'Not started'}</span><span>{progressPercent}%</span></div>
                    <div className="h-2 rounded-full bg-gray-200"><div className="h-2 rounded-full bg-cyan-500 transition-all" style={{ width: `${progressPercent}%` }} /></div>
                  </div>
                  <Link to={`/experiments/${experiment.slug}?setup=1`} className="mt-5 block rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-700">
                    {saved ? 'Continue practical setup' : 'Set up & start practical'}
                  </Link>
                </div>
              </article>
            );
          })}
        </ExperimentGrid>
      </div>

      {alevelExperiments.length > 0 ? (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">A-Level ({alevelExperiments.length})</h3>
          <ExperimentGrid>
            {alevelExperiments.map((experiment) => {
            const saved = progressEntries[experiment.slug];
            const progressPercent = saved?.completed ? 100 : saved?.score ?? 0;
            return (
              <article key={experiment.slug} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
                  <SubjectIcon subject={subject} title={`${experiment.title} related visual`} className="h-14 w-14" />
                  <span className="text-3xl" aria-hidden="true">{experiment.icon}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{experiment.level}</span>
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">{experiment.difficulty}</span>
                    <span className="text-xs text-gray-500">{experiment.duration}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-gray-900">{experiment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{experiment.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(experiment.relatedTopics ?? []).slice(0, 3).map((topic) => <span key={topic} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{topic}</span>)}
                  </div>
                  <ApparatusPreview slug={experiment.slug} title="Apparatus to set up" />
                  <div className="mt-5">
                    <div className="mb-1 flex justify-between text-xs text-gray-500"><span>{saved?.practicalComplete ? 'Practical evidence saved' : 'Not started'}</span><span>{progressPercent}%</span></div>
                    <div className="h-2 rounded-full bg-gray-200"><div className="h-2 rounded-full bg-cyan-500 transition-all" style={{ width: `${progressPercent}%` }} /></div>
                  </div>
                  <Link to={`/experiments/${experiment.slug}?setup=1`} className="mt-5 block rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-700">
                    {saved ? 'Continue practical setup' : 'Set up & start practical'}
                  </Link>
                </div>
              </article>
            );
            })}
          </ExperimentGrid>
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"><p className="text-sm text-gray-600">{label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{value}</p></div>;
}
