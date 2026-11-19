import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import SubjectIcon from '../../components/ui/SubjectIcon';
import ApparatusPreview from '../../components/apparatus/ApparatusPreview';
import ExperimentGrid from '../../components/labs/ExperimentGrid';
import biologyWelcomeImage from '../../../images/biology 5.webp';
import biologicalHazardImage from '../../../images/hazard.webp';
import { experimentCatalog } from '../../data/experimentCatalog';

const practicalSkills = [
  { title: 'Safety', detail: 'Follow lab rules and handle apparatus correctly.' },
  { title: 'Measurement', detail: 'Use units, scales, and accurate reading of results.' },
  { title: 'Drawing', detail: 'Draw clear diagrams and label biological structures.' },
  { title: 'Observation', detail: 'Record changes in samples and results carefully.' },
  { title: 'Graphing', detail: 'Interpret data using clear axes and trends.' },
  { title: 'Investigation', detail: 'Plan, test, and evaluate experiments logically.' },
];

export default function BiologyLabPage() {
  const biologyExperiments = Object.values(experimentCatalog).filter((experiment) => experiment.subject === 'biology');

  return (
    <div className="mx-auto max-w-7xl pb-6">
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 text-white shadow-lg">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <SubjectIcon subject="biology" title="Biology" className="h-16 w-16 ring-1 ring-white/40" />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-emerald-100">New Curriculum</p>
              <h1 className="text-3xl font-bold">Biology Practical Workbook</h1>
            </div>
          </div>
          <img src={biologyWelcomeImage} alt="Microscopic biological cells" className="h-36 w-full rounded-2xl border border-white/40 object-cover shadow-lg lg:h-28 lg:w-72" />
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-emerald-100">Practical Skills</p>
            <p className="text-2xl font-bold">AO3</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <InfoCard label="Subject" value="Biology" icon={<SubjectIcon subject="biology" className="mx-auto mb-3 h-14 w-14" />} />
        <InfoCard label="Experiments Available" value={String(biologyExperiments.length)} icon={<span className="mb-3 inline-block text-3xl">📘</span>} />
        <InfoCard label="Assessment Focus" value="AO3" icon={<span className="mb-3 inline-block text-3xl">✅</span>} />
      </div>

      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Practical skills focus</h2>
        <p className="max-w-3xl text-sm leading-7 text-gray-700">
          This workbook prepares students to safely conduct investigations, make accurate observations,
          record data, draw biological diagrams, and present evidence in a clear scientific way.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm sm:flex-row sm:items-center">
        <img src={biologicalHazardImage} alt="Caution: biological hazard" className="h-28 w-28 rounded-xl border border-amber-300 object-cover" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Before you begin</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">Work safely with biological materials</h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">Use gloves and eye protection, label every sample, never taste laboratory materials, and follow the disposal instructions in each practical.</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">Core practical skills</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {practicalSkills.map((skill) => (
            <div key={skill.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {skill.title}
              </div>
              <p className="text-sm leading-6 text-gray-600">{skill.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Biology Practical Investigations</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            NCDC/UNEB Aligned
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">O-Level - Lower Secondary ({biologyExperiments.filter(e => e.level === 'olevel').length} Practicals)</h3>
          <ExperimentGrid>
            {biologyExperiments.filter(e => e.level === 'olevel').sort((a, b) => (a.classLevel || '').localeCompare(b.classLevel || '')).map((experiment) => (
              <div key={experiment.slug} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {experiment.classLevel || 'O-Level'}
                    </span>
                    {experiment.theme && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {experiment.theme}
                      </span>
                    )}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {experiment.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{experiment.icon} {experiment.title}</h3>
                <p className="mt-2 text-sm font-medium text-emerald-700">{experiment.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(experiment.relatedTopics ?? []).map((topic) => (
                    <span key={`${experiment.slug}-${topic}`} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {topic}
                    </span>
                  ))}
                </div>
                <ApparatusPreview slug={experiment.slug} title="Apparatus to set up" />
                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500">⏱️ {experiment.duration}</span>
                  <Link to={`/experiments/${experiment.slug}?setup=1`} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    Set up & start practical
                  </Link>
                </div>
              </div>
            ))}
          </ExperimentGrid>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">A-Level ({biologyExperiments.filter(e => e.level === 'alevel').length})</h3>
          <ExperimentGrid>
            {biologyExperiments.filter(e => e.level === 'alevel').map((experiment) => (
              <div key={experiment.slug} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">A-Level</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {experiment.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{experiment.title}</h3>
                <p className="mt-2 text-sm font-medium text-emerald-700">{experiment.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(experiment.relatedTopics ?? []).map((topic) => (
                    <span key={`${experiment.slug}-${topic}`} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {topic}
                    </span>
                  ))}
                </div>
                <ApparatusPreview slug={experiment.slug} title="Apparatus to set up" />
                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500">{experiment.duration}</span>
                  <Link to={`/experiments/${experiment.slug}?setup=1`} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                    Open setup
                  </Link>
                </div>
              </div>
            ))}
          </ExperimentGrid>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Assessment checklist</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ChecklistItem title="Safety" text="Wear protective gear and follow instructions." />
          <ChecklistItem title="Apparatus" text="Use the correct equipment and labels." />
          <ChecklistItem title="Data" text="Record results in clear tables and graphs." />
          <ChecklistItem title="Conclusion" text="Interpret evidence and explain findings correctly." />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      {icon}
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ChecklistItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="mb-2 font-semibold text-gray-900">{title}</p>
      <p className="text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}
