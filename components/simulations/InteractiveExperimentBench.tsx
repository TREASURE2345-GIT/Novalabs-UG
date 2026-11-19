import { useState } from 'react';
import type { ExperimentEntry } from '../../data/experimentCatalog';
import SubjectIcon from '../ui/SubjectIcon';

type InteractiveExperimentBenchProps = {
  experiment: ExperimentEntry;
  currentStep: number;
  onPracticalComplete: () => void;
};

type Apparatus = {
  name: string;
  purpose: string;
};

const subjectApparatus: Record<ExperimentEntry['subject'], Apparatus[]> = {
  biology: [
    { name: 'Specimen tray', purpose: 'Holds the biological sample safely.' },
    { name: 'Measuring cylinder', purpose: 'Measures solution volume accurately.' },
    { name: 'Forceps and glass rod', purpose: 'Handles the sample and mixes gently.' },
    { name: 'Microscope or hand lens', purpose: 'Makes structures and changes easier to observe.' },
  ],
  chemistry: [
    { name: 'Beaker and flask', purpose: 'Contains solutions during the reaction.' },
    { name: 'Measuring cylinder', purpose: 'Measures repeatable liquid volumes.' },
    { name: 'Balance', purpose: 'Measures the mass of a solid sample.' },
    { name: 'Thermometer or indicator', purpose: 'Reveals temperature or chemical change.' },
  ],
  physics: [
    { name: 'Power source or launcher', purpose: 'Provides the energy for the test.' },
    { name: 'Measuring tape', purpose: 'Measures distance and displacement.' },
    { name: 'Stopwatch', purpose: 'Measures time for a repeatable trial.' },
    { name: 'Meter or sensor', purpose: 'Records the physical quantity under study.' },
  ],
  agriculture: [
    { name: 'Sample tray', purpose: 'Keeps soil or crop samples separated.' },
    { name: 'Measuring cylinder', purpose: 'Applies a known water volume.' },
    { name: 'Ruler or balance', purpose: 'Measures growth, mass, or texture evidence.' },
    { name: 'Labels and record sheet', purpose: 'Keeps samples and observations traceable.' },
  ],
};

const trialReadings: Record<ExperimentEntry['subject'], string[]> = {
  biology: ['Cloudy layer observed', 'Sample structure changed', 'Visible strands collected'],
  chemistry: ['Endpoint reached', 'Temperature changed by 4.2 C', 'Crystals began to form'],
  physics: ['Trial recorded: 1.8 m/s', 'Current measured: 0.24 A', 'Wave pattern captured'],
  agriculture: ['Water retained: 62 ml', 'Sample classified as loam', 'Growth condition recorded'],
};

export default function InteractiveExperimentBench({ experiment, currentStep, onPracticalComplete }: InteractiveExperimentBenchProps) {
  const apparatus = subjectApparatus[experiment.subject];
  const [selected, setSelected] = useState<string[]>([]);
  const [trialReading, setTrialReading] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [observation, setObservation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleApparatus = (name: string) => {
    setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const runTrial = () => {
    const readings = trialReadings[experiment.subject];
    setTrialReading(readings[(currentStep + experiment.title.length) % readings.length]);
  };

  const submitEvidence = () => {
    if (selected.length !== apparatus.length || !measurement.trim() || !observation.trim() || !trialReading) return;
    setSubmitted(true);
    onPracticalComplete();
  };

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-lg">
      <div className="flex flex-col gap-5 border-b border-white/10 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Interactive virtual bench</p>
          <h2 className="mt-1 text-2xl font-bold">Do the practical, then explain the evidence</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Select the apparatus, run the trial, and record what you would measure in a real laboratory.</p>
        </div>
        <SubjectIcon subject={experiment.subject} title={`${experiment.subject} practical`} className="h-20 w-20 ring-1 ring-white/20" />
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">1. Prepare the apparatus</h3>
            <span className="text-xs text-slate-400">{selected.length}/{apparatus.length} selected</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {apparatus.map((item) => {
              const isSelected = selected.includes(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggleApparatus(item.name)}
                  className={`rounded-xl border p-4 text-left transition ${isSelected ? 'border-cyan-300 bg-cyan-300/15' : 'border-white/10 bg-white/5 hover:border-cyan-300/60'}`}
                >
                  <span className="flex items-center justify-between gap-3 font-semibold">
                    {item.name}
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isSelected ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-400'}`}>{isSelected ? '✓' : '+'}</span>
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">{item.purpose}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={runTrial} disabled={selected.length !== apparatus.length} className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
              Run virtual trial
            </button>
            <span className="text-sm text-slate-300">{trialReading || 'Select every apparatus item to begin.'}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-bold">2. Record evidence</h3>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">Measurement or result</label>
          <input value={measurement} onChange={(event) => setMeasurement(event.target.value)} placeholder="e.g. 62 ml, 4.2 C, 1.8 m/s" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">Observation</label>
          <textarea value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="What changed? What does it suggest?" rows={3} className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
          <button type="button" onClick={submitEvidence} disabled={submitted || !trialReading || selected.length !== apparatus.length || !measurement.trim() || !observation.trim()} className="mt-4 w-full rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">
            {submitted ? 'Evidence submitted' : 'Submit practical evidence'}
          </button>
          {submitted && <p className="mt-3 text-sm font-medium text-emerald-300">Practical evidence saved. Continue to the conclusion.</p>}
        </div>
      </div>
    </section>
  );
}
