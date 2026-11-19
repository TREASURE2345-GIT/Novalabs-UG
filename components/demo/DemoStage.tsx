import { useEffect, useMemo, useRef, useState } from 'react';
import demoData from '../../data/demoNarration.json';
import SubjectIcon from '../ui/SubjectIcon';
import AgentCursor from './AgentCursor';
import LabScene from './LabScene';

type Scene = {
  id: string;
  start: number;
  duration: number;
  title: string;
  caption: string;
  narration: string;
};

type PlanStatus = 'pending' | 'active' | 'done';
type PlanId = 'inspect' | 'apparatus' | 'trial' | 'evidence' | 'steps' | 'reflect';
type LogKind = 'action' | 'thought' | 'success';

type LogEntry = {
  id: number;
  time: string;
  text: string;
  kind: LogKind;
};

const scenes = demoData.scenes as Scene[];
const totalSeconds = scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration;

const preferredVoiceNames = [/aria/i, /jenny/i, /samantha/i, /zira/i, /google us english/i, /google uk english female/i];

function pickNarrationVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
  if (english.length === 0) return voices[0];

  for (const pattern of preferredVoiceNames) {
    const match = english.find((voice) => pattern.test(voice.name));
    if (match) return match;
  }

  return english.find((voice) => voice.lang.toLowerCase() === 'en-us') ?? english[0];
}

function splitNarration(text: string): string[] {
  return (
    text
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) ?? [text]
  );
}

type DemoStageProps = {
  embedded?: boolean;
  hideStartGate?: boolean;
};

const apparatus = [
  { id: 'apparatus-0', name: 'Specimen tray', detail: 'Holds the plant sample', icon: 'tray' as const },
  { id: 'apparatus-1', name: 'Measuring cylinder', detail: 'Measures 62 ml of filtrate', icon: 'cylinder' as const },
  { id: 'apparatus-2', name: 'Forceps and rod', detail: 'Handles and spools the DNA', icon: 'forceps' as const },
  { id: 'apparatus-3', name: 'Microscope', detail: 'Checks the extracted material', icon: 'microscope' as const },
];

const stepTitles = ['Prepare the sample', 'Separate the DNA', 'Precipitate the DNA', 'Collect and observe'];
const stepShort = ['Prepare', 'Separate', 'Precipitate', 'Collect'];

const planItems: { id: PlanId; label: string }[] = [
  { id: 'inspect', label: 'Inspect the virtual bench' },
  { id: 'apparatus', label: 'Select the correct apparatus' },
  { id: 'trial', label: 'Run the virtual trial' },
  { id: 'evidence', label: 'Record and submit evidence' },
  { id: 'steps', label: 'Complete the guided steps' },
  { id: 'reflect', label: 'Explain the result' },
];

const initialPlan: Record<PlanId, PlanStatus> = {
  inspect: 'active',
  apparatus: 'pending',
  trial: 'pending',
  evidence: 'pending',
  steps: 'pending',
  reflect: 'pending',
};

const insights: Record<string, string> = {
  intro: 'NovaLab pairs guided practicals with real-time scoring and a subject-aware AI guide.',
  goal: 'The agent plans before it acts, the same way a scientist approaches an investigation.',
  apparatus: 'Choosing the right apparatus is part of the practical assessment, not an afterthought.',
  trial: 'Lysis breaks open the cells and releases DNA into the extraction buffer.',
  evidence: 'Cold ethanol lowers DNA solubility, so the DNA becomes visible as white strands.',
  steps: 'Each guided step is checked against the practical rubric and scored automatically.',
  complete: 'The full evidence record is saved to the student profile for the teacher to review.',
  outro: 'Safe, affordable, curriculum-aligned practical science for every learner.',
};

const statusStyles: Record<string, { label: string; dot: string; text: string }> = {
  Observing: { label: 'Observing', dot: 'bg-cyan-300', text: 'text-cyan-200' },
  Planning: { label: 'Planning', dot: 'bg-violet-300', text: 'text-violet-200' },
  Acting: { label: 'Acting', dot: 'bg-amber-300', text: 'text-amber-200' },
  Verifying: { label: 'Verifying', dot: 'bg-sky-300', text: 'text-sky-200' },
  Complete: { label: 'Complete', dot: 'bg-emerald-300', text: 'text-emerald-200' },
};

export default function DemoStage({ embedded = false, hideStartGate = false }: DemoStageProps) {
  const isRecording = useMemo(() => new URLSearchParams(window.location.search).has('record'), []);
  const autoplay = useMemo(() => new URLSearchParams(window.location.search).has('autoplay'), []);

  const [started, setStarted] = useState(autoplay);
  const [runId, setRunId] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [trialReading, setTrialReading] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [observation, setObservation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [plan, setPlan] = useState<Record<PlanId, PlanStatus>>(initialPlan);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState('Observing');
  const [cursor, setCursor] = useState<{ target: string | null; clicking: boolean }>({ target: null, clicking: false });
  const [elapsed, setElapsed] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showEndCard, setShowEndCard] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [narrationActive, setNarrationActive] = useState(false);
  const narrationSpoken = useRef(new Set<string>());
  const narrationToken = useRef(0);
  const logCounter = useRef(0);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const scene = scenes[sceneIndex];
  const trialReady = selected.length === apparatus.length;
  const evidenceReady = trialReady && trialReading !== '' && measurement.trim() !== '' && observation.trim() !== '';
  const nextReady = submitted;

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    logCounter.current = 0;
    narrationSpoken.current.clear();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setSceneIndex(0);
    setStep(0);
    setSelected([]);
    setTrialReading('');
    setMeasurement('');
    setObservation('');
    setSubmitted(false);
    setScore(0);
    setPlan(initialPlan);
    setLogs([]);
    setStatus('Observing');
    setCursor({ target: null, clicking: false });
    setElapsed(0);
    setShowIntro(true);
    setShowEndCard(false);
    setCompleted(false);
    window.__NOVALAB_DEMO_STARTED__ = true;
    window.__NOVALAB_DEMO_COMPLETE__ = false;

    const at = (seconds: number, action: () => void) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) action();
        }, Math.max(0, seconds * 1000)),
      );
    };

    const addLog = (seconds: number, text: string, kind: LogKind = 'action') => {
      logCounter.current += 1;
      const entry: LogEntry = {
        id: logCounter.current,
        time: formatClock(seconds),
        text,
        kind,
      };
      setLogs((current) => [...current, entry].slice(-6));
    };

    const moveCursor = (seconds: number, target: string) => {
      at(seconds, () => setCursor({ target, clicking: false }));
    };

    const click = (seconds: number, target: string, action: () => void) => {
      at(seconds, () => {
        setCursor({ target, clicking: true });
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setCursor({ target, clicking: false });
            action();
          }, 240),
        );
      });
    };

    const typeText = (start: number, text: string, setter: (update: (value: string) => string) => void, speed: number) => {
      Array.from(text).forEach((character, index) => {
        at(start + index * speed, () => setter((value) => value + character));
      });
    };

    scenes.forEach((entry, index) => {
      at(entry.start, () => setSceneIndex(index));
    });

    at(0.4, () => addLog(0.4, 'Session started', 'thought'));
    at(1.2, () => addLog(1.2, 'Loading virtual bench and apparatus inventory', 'action'));
    at(3.4, () => setShowIntro(false));
    at(5.5, () => addLog(5.5, 'Bench mapped. Four apparatus options detected.', 'action'));

    at(10, () => {
      setPlan((current) => ({ ...current, inspect: 'done', apparatus: 'active' }));
      setStatus('Planning');
      addLog(10, 'Apparatus plan prepared', 'thought');
    });
    at(15.3, () => addLog(15.3, 'Goal received: complete the DNA extraction practical', 'thought'));
    at(17.5, () => addLog(17.5, 'Target selected: specimen tray, cylinder, forceps, microscope', 'action'));

    at(25.2, () => {
      setStatus('Acting');
      addLog(25.2, 'Selecting apparatus from the bench', 'action');
    });

    moveCursor(25.6, 'apparatus-0');
    click(26.4, 'apparatus-0', () => {
      setSelected((current) => [...current, 'apparatus-0']);
      addLog(26.4, 'Selected specimen tray', 'success');
    });

    moveCursor(28.2, 'apparatus-1');
    click(29.0, 'apparatus-1', () => {
      setSelected((current) => [...current, 'apparatus-1']);
      addLog(29.0, 'Selected measuring cylinder', 'success');
    });

    moveCursor(31.0, 'apparatus-2');
    click(31.8, 'apparatus-2', () => {
      setSelected((current) => [...current, 'apparatus-2']);
      addLog(31.8, 'Selected forceps and glass rod', 'success');
    });

    moveCursor(33.8, 'apparatus-3');
    click(34.6, 'apparatus-3', () => {
      setSelected((current) => [...current, 'apparatus-3']);
      addLog(34.6, 'Selected microscope', 'success');
    });

    at(36.0, () => {
      setPlan((current) => ({ ...current, apparatus: 'done', trial: 'active' }));
      setStatus('Verifying');
      addLog(36.0, 'Apparatus check passed', 'success');
    });
    at(38.0, () => {
      setStatus('Planning');
      addLog(38.0, 'Trial parameters ready', 'thought');
    });

    at(40.2, () => {
      setStatus('Acting');
      addLog(40.2, 'Running the virtual trial', 'action');
    });
    moveCursor(40.4, 'trial');
    click(41.2, 'trial', () => {
      setTrialReading('Cloudy layer observed');
      setPlan((current) => ({ ...current, trial: 'done', evidence: 'active' }));
      addLog(41.2, 'Trial complete: cloudy layer observed', 'success');
    });
    at(43.4, () => {
      setStatus('Verifying');
      addLog(43.4, 'DNA release confirmed at the interface', 'thought');
    });
    at(45.0, () => {
      setStatus('Acting');
      addLog(45.0, 'Preparing the evidence record', 'action');
    });

    at(51.2, () => addLog(51.2, 'Recording the measurement', 'action'));
    moveCursor(51.4, 'measurement');
    click(52.0, 'measurement', () => {
      typeText(52.3, '62 ml', setMeasurement, 0.09);
      at(52.9, () => addLog(52.9, 'Measurement entered: 62 ml', 'success'));
    });

    at(54.0, () => addLog(54.0, 'Recording the observation', 'action'));
    moveCursor(54.2, 'observation');
    click(54.8, 'observation', () => {
      typeText(55.1, 'White strands formed at the ethanol layer.', setObservation, 0.032);
      at(56.7, () => addLog(56.7, 'Observation entered', 'success'));
    });

    moveCursor(58.2, 'submit');
    click(58.9, 'submit', () => {
      setSubmitted(true);
      setPlan((current) => ({ ...current, evidence: 'done', steps: 'active' }));
      addLog(58.9, 'Evidence submitted', 'success');
    });
    at(60.0, () => {
      setStatus('Verifying');
      addLog(60.0, 'Evidence verified against the practical rubric', 'success');
    });
    at(61.8, () => {
      setStatus('Acting');
      addLog(61.8, 'Starting the guided practical steps', 'action');
    });

    moveCursor(64.4, 'next');
    click(65.0, 'next', () => {
      setStep(1);
      setScore(25);
      setStatus('Verifying');
      addLog(65.0, 'Step 1 verified: prepare the sample', 'success');
    });
    at(67.0, () => setStatus('Acting'));

    moveCursor(69.4, 'next');
    click(70.0, 'next', () => {
      setStep(2);
      setScore(50);
      setStatus('Verifying');
      addLog(70.0, 'Step 2 verified: separate the DNA', 'success');
    });
    at(72.0, () => setStatus('Acting'));

    moveCursor(74.4, 'next');
    click(75.0, 'next', () => {
      setStep(3);
      setScore(75);
      setStatus('Verifying');
      addLog(75.0, 'Step 3 verified: precipitate the DNA', 'success');
    });
    at(77.0, () => setStatus('Acting'));

    moveCursor(79.8, 'next');
    click(80.5, 'next', () => {
      setScore(100);
      setCompleted(true);
      setPlan((current) => ({ ...current, steps: 'done', reflect: 'active' }));
      setStatus('Verifying');
      addLog(80.5, 'Final step verified: collect and observe', 'success');
    });
    at(82.0, () => {
      setStatus('Complete');
      addLog(82.0, 'Practical complete with a score of 100 percent', 'success');
    });
    at(84.5, () => {
      setPlan((current) => ({ ...current, reflect: 'done' }));
      addLog(84.5, 'Reflection generated: cold ethanol precipitates DNA', 'thought');
    });

    at(89.3, () => addLog(89.3, 'Result record saved to the student profile', 'success'));
    at(93.0, () => addLog(93.0, 'Teacher view updated with the evidence record', 'action'));

    at(104.2, () => {
      setShowEndCard(true);
      addLog(104.2, 'Session complete', 'success');
    });

    at(115.0, () => {
      window.__NOVALAB_DEMO_COMPLETE__ = true;
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [started, runId]);

  useEffect(() => {
    if (!started) return;
    const startedAt = performance.now();
    const interval = setInterval(() => {
      setElapsed(Math.min(totalSeconds, (performance.now() - startedAt) / 1000));
    }, 200);
    return () => clearInterval(interval);
  }, [started, runId]);

  useEffect(() => {
    if (!speechSupported) return;
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      void synth.getVoices();
    };
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, [speechSupported]);

  const speakNarration = (text: string, token: number) => {
    if (!speechSupported) {
      setAudioBlocked(true);
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const voice = pickNarrationVoice(synth.getVoices());
    const parts = splitNarration(text);

    parts.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.lang = voice?.lang ?? 'en-US';
      if (voice) utterance.voice = voice;
      utterance.rate = 0.96;
      utterance.pitch = 1.02;
      utterance.volume = 1;

      if (index === 0) {
        utterance.onstart = () => {
          if (token !== narrationToken.current) return;
          setAudioBlocked(false);
          setNarrationActive(true);
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        };
      }

      if (index === parts.length - 1) {
        utterance.onend = () => {
          if (token === narrationToken.current) setNarrationActive(false);
        };
      }

      utterance.onerror = () => {
        if (token === narrationToken.current) {
          setNarrationActive(false);
          setAudioBlocked(true);
        }
      };

      synth.speak(utterance);
    });

    window.setTimeout(() => {
      if (token !== narrationToken.current) return;
      if (!synth.speaking && !synth.pending) {
        setNarrationActive(false);
        setAudioBlocked(true);
      }
    }, 2000);
  };

  useEffect(() => {
    if (!started || !audioEnabled) return;

    if (!speechSupported) {
      setAudioBlocked(true);
      return;
    }

    if (narrationSpoken.current.has(scene.id)) return;

    const narration = scene.narration;
    if (!narration) return;

    narrationSpoken.current.add(scene.id);
    narrationToken.current += 1;
    speakNarration(narration, narrationToken.current);
  }, [sceneIndex, started, audioEnabled]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const primeSpeech = () => {
    if (!speechSupported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const warmup = new SpeechSynthesisUtterance(' ');
    warmup.volume = 0.01;
    warmup.rate = 1;
    synth.speak(warmup);
  };

  const enableAudio = () => {
    if (!speechSupported) {
      setAudioBlocked(true);
      return;
    }

    narrationToken.current += 1;
    setAudioEnabled(true);
    setAudioBlocked(false);
    narrationSpoken.current.delete(scene.id);

    if (!scene.narration) return;

    narrationSpoken.current.add(scene.id);
    narrationToken.current += 1;
    speakNarration(scene.narration, narrationToken.current);
  };

  useEffect(() => {
    const handleStart = () => {
      primeSpeech();
      setAudioEnabled(true);
      setAudioBlocked(false);
      setStarted(true);
    };

    window.addEventListener('novalab:demo-start', handleStart);
    return () => window.removeEventListener('novalab:demo-start', handleStart);
  }, []);

  const toggleAudio = () => {
    if (audioEnabled) {
      if (speechSupported) window.speechSynthesis.cancel();
      narrationToken.current += 1;
      setAudioEnabled(false);
      setNarrationActive(false);
      setAudioBlocked(false);
      return;
    }

    narrationSpoken.current.delete(scene.id);
    setAudioEnabled(true);
  };

  const restart = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    narrationSpoken.current.clear();
    narrationToken.current += 1;
    setNarrationActive(false);
    setAudioBlocked(false);
    setStarted(false);
    setRunId((value) => value + 1);
    setShowIntro(true);
    setShowEndCard(false);
    window.setTimeout(() => setStarted(true), 60);
  };

  const progress = Math.min(100, (elapsed / totalSeconds) * 100);
  const currentStatus = statusStyles[status] ?? statusStyles.Observing;
  const isActive = (target: string) => cursor.target === target;

  return (
    <div
      className={`relative flex ${
        embedded ? 'h-full w-full' : 'h-screen w-screen'
      } flex-col overflow-hidden bg-[#040b14] text-slate-100`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_82%_100%,rgba(52,211,153,0.1),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:64px_64px]" />

      <header className="relative z-20 flex h-[84px] shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <img src="/novalab-logo-light.png" alt="NovaLab" className="h-10 w-auto" />
          <span className="h-8 w-px bg-white/15" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">AI agent demo</p>
            <p className="text-lg font-semibold text-white">DNA extraction practical</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            Autonomous session
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
            O-Level Biology
          </span>
          {!isRecording && (
            <>
              <button
                type="button"
                onClick={toggleAudio}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10"
              >
                {audioEnabled ? '🔊 Audio On' : '🔇 Audio Off'}
              </button>
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-[11px] font-semibold text-cyan-200 transition hover:bg-cyan-300/20"
              >
                Restart demo
              </button>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-5 px-8 pb-4">
        <section className="flex min-h-0 flex-col gap-4">
          <div className="flex shrink-0 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <SubjectIcon subject="biology" title="Biology" className="h-12 w-12" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Virtual bench</p>
                <h1 className="text-xl font-bold text-white">DNA Extraction</h1>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                {stepShort.map((label, index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                      index === step
                        ? 'border-cyan-300/60 bg-cyan-300/15 text-cyan-100'
                        : index < step
                          ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-slate-500'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                        index < step ? 'bg-emerald-300 text-slate-950' : index === step ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {index < step ? '✓' : index + 1}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
              <ScoreRing score={score} />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.26fr)_minmax(0,0.92fr)] gap-4">
            <div className="relative min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] shadow-[0_30px_80px_-40px_rgba(34,211,238,0.35)]">
              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between bg-gradient-to-b from-[#07111f] via-[#07111f]/80 to-transparent p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">Step {step + 1} of 4</p>
                  <p className="mt-1 text-sm font-semibold text-white">{stepTitles[step]}</p>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Agent view
                </span>
              </div>

              <LabScene step={step} selected={selected} completed={completed} />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#07111f] via-[#07111f]/70 to-transparent p-4">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-slate-300">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Simulation linked to practical state
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-slate-300">
                  Score <span className="font-bold text-emerald-300">{score}%</span>
                </div>
              </div>

              {completed && (
                <div className="absolute left-1/2 top-16 z-10 -translate-x-1/2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur">
                  Practical complete · 100%
                </div>
              )}
            </div>

            <div className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Apparatus</h2>
                <span className="text-[10px] font-semibold text-slate-400">{selected.length}/4 selected</span>
              </div>

              <div className="grid gap-2">
                {apparatus.map((item) => {
                  const checked = selected.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      data-agent-target={item.id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
                        checked
                          ? 'border-emerald-300/40 bg-emerald-300/10'
                          : isActive(item.id)
                            ? 'border-cyan-300/60 bg-cyan-300/10'
                            : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          checked ? 'bg-emerald-300/20 text-emerald-200' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        <ApparatusIcon kind={item.icon} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-white">{item.name}</span>
                        <span className="block truncate text-[10px] text-slate-400">{item.detail}</span>
                      </span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          checked ? 'bg-emerald-300 text-slate-950' : 'border border-white/15 text-slate-500'
                        }`}
                      >
                        {checked ? '✓' : '+'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                data-agent-target="trial"
                className={`rounded-xl border p-3 transition ${
                  trialReading ? 'border-emerald-300/40 bg-emerald-300/10' : isActive('trial') ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-white">Run virtual trial</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${trialReady ? 'bg-cyan-300/20 text-cyan-200' : 'bg-white/5 text-slate-500'}`}>
                    {trialReady ? 'Ready' : 'Locked'}
                  </span>
                </div>
                <p className={`mt-1 text-[10px] ${trialReading ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {trialReading || 'Select every apparatus item to begin.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Evidence record</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${submitted ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {submitted ? 'Submitted' : 'Draft'}
                  </span>
                </div>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Measurement</p>
                <div
                  data-agent-target="measurement"
                  className={`mt-1 flex min-h-8 items-center rounded-lg border px-2.5 text-xs transition ${
                    isActive('measurement') ? 'border-cyan-300/70 bg-cyan-300/10' : 'border-white/10 bg-[#06101d]'
                  } ${measurement ? 'text-white' : 'text-slate-600'}`}
                >
                  {measurement || 'Enter the measured volume'}
                  {isActive('measurement') && <Caret />}
                </div>

                <p className="mt-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Observation</p>
                <div
                  data-agent-target="observation"
                  className={`mt-1 flex min-h-12 items-start rounded-lg border px-2.5 py-2 text-xs leading-5 transition ${
                    isActive('observation') ? 'border-cyan-300/70 bg-cyan-300/10' : 'border-white/10 bg-[#06101d]'
                  } ${observation ? 'text-white' : 'text-slate-600'}`}
                >
                  {observation || 'Describe what changed at the ethanol layer'}
                  {isActive('observation') && <Caret />}
                </div>

                <div
                  data-agent-target="submit"
                  className={`mt-2.5 flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition ${
                    submitted
                      ? 'bg-emerald-300/15 text-emerald-200 ring-1 ring-emerald-300/30'
                      : evidenceReady
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-white/10 text-slate-500'
                  } ${isActive('submit') ? 'ring-2 ring-cyan-300/70' : ''}`}
                >
                  {submitted ? 'Evidence verified' : 'Submit practical evidence'}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Guided step</p>
                  <p className="text-xs font-bold text-white">{step + 1} of 4</p>
                </div>
                <div
                  data-agent-target="next"
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                    completed ? 'bg-emerald-300/15 text-emerald-200' : nextReady ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-500'
                  } ${isActive('next') ? 'ring-2 ring-cyan-300/70' : ''}`}
                >
                  {completed ? 'Practical finished' : step === 3 ? 'Finish practical' : 'Next step'}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4">
          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Nova Agent</h2>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                    Auto
                  </span>
                </div>
                <p className={`flex items-center gap-1.5 text-[11px] font-semibold ${currentStatus.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot} animate-pulse`} />
                  {currentStatus.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Accuracy</p>
                <p className="text-lg font-bold text-emerald-300">{score}%</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label="Actions" value={String(Math.min(24, Math.floor(elapsed / 5) + 1)).padStart(2, '0')} />
              <Metric label="Evidence" value={submitted ? 'Saved' : 'Draft'} />
              <Metric label="Session" value={formatClock(elapsed)} />
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-blue-500/5 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-300">Mission</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              Complete the DNA extraction practical, record the evidence, and explain the result.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Biology', 'O-Level', '45 min', 'Guided'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-semibold text-slate-300">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">Agent plan</p>
              <span className="text-[9px] font-semibold text-slate-500">
                {Object.values(plan).filter((value) => value === 'done').length}/{planItems.length} complete
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {planItems.map((item) => {
                const state = plan[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <PlanIcon state={state} />
                    <span className={`text-xs ${state === 'done' ? 'text-slate-400' : state === 'active' ? 'font-semibold text-white' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-[184px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050e19] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">Live actions</p>
              <span className="flex items-center gap-1.5 text-[9px] font-semibold text-cyan-300">
                <span className="h-1 w-1 rounded-full bg-cyan-300 animate-pulse" />
                streaming
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {logs.slice(-5).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-cyan-300/70" />
                  <span className="w-8 shrink-0 font-mono text-[9px] text-slate-600">{entry.time}</span>
                  <span className={`text-[10px] leading-4 ${entry.kind === 'success' ? 'text-emerald-300' : entry.kind === 'thought' ? 'text-slate-400' : 'text-slate-300'}`}>
                    {entry.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">Agent insight</p>
            <p key={scene.id} className="demo-scene-in mt-2 text-xs leading-5 text-slate-300">
              {insights[scene.id]}
            </p>
          </div>
        </aside>
      </main>

      <footer className="relative z-20 flex h-[86px] shrink-0 items-center gap-4 border-t border-white/10 bg-[#040d18]/80 px-8 backdrop-blur">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M4 9v6M8 6v12M12 4v16M16 7v10M20 10v4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-cyan-300">AI narration</p>
            {started && audioEnabled && (
              <span
                className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.18em] ${
                  narrationActive ? 'text-emerald-300' : audioBlocked ? 'text-amber-300' : 'text-slate-500'
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${
                    narrationActive ? 'animate-pulse bg-emerald-300' : audioBlocked ? 'bg-amber-300' : 'bg-slate-600'
                  }`}
                />
                {narrationActive ? 'on air' : audioBlocked ? 'tap to unmute' : 'ready'}
              </span>
            )}
          </div>
          <p key={scene.id} className="demo-scene-in truncate text-base text-slate-200">
            {scene.caption}
          </p>
        </div>
        <div className="w-64 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
            <span>{formatClock(elapsed)}</span>
            <span>{formatClock(totalSeconds)}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </footer>

      <AgentCursor target={cursor.target} clicking={cursor.clicking} />

      {started && audioBlocked && (
        <button
          type="button"
          onClick={enableAudio}
          className="absolute bottom-28 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-amber-300 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_18px_50px_-18px_rgba(251,191,36,0.9)] transition hover:bg-amber-200"
        >
          🔈 Tap to enable audio narration
        </button>
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-[#040b14]/95 transition-opacity duration-700 ${
          started && showIntro ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <img src="/novalab-logo-light.png" alt="NovaLab" className="mx-auto h-16 w-auto" />
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.36em] text-cyan-300">AI agent demo</p>
          <h2 className="mt-3 text-4xl font-bold text-white">Watch an AI agent complete a real practical</h2>
          <p className="mt-3 text-sm text-slate-400">DNA extraction · Biology · O-Level</p>
          <p className={`mt-6 text-xs animate-pulse ${audioBlocked ? 'text-amber-300' : 'text-cyan-300/70'}`}>
            {audioBlocked ? 'Tap the button below to enable audio' : '🔊 Audio narration playing'}
          </p>
        </div>
      </div>

      {showEndCard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#040b14]/96 backdrop-blur-sm demo-scene-in">
          <div className="text-center">
            <img src="/novalab-logo-light.png" alt="NovaLab" className="mx-auto h-20 w-auto" />
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.36em] text-cyan-300">NovaLab</p>
            <h2 className="mt-3 text-4xl font-bold text-white">Real science, safely, anywhere.</h2>
            <p className="mt-4 text-base text-slate-400">AI-guided virtual labs for secondary schools.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              {['Curriculum aligned', 'Real-time scoring', 'Works offline'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-slate-300">
                  {item}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (embedded) {
                  restart();
                  return;
                }
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                window.location.href = '/';
              }}
              className="mt-8 rounded-xl bg-cyan-300 px-8 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {embedded ? 'Replay demo' : 'Back to Home'}
            </button>
          </div>
        </div>
      )}

      {!started && !hideStartGate && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#040b14]">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur">
            <img src="/novalab-logo-light.png" alt="NovaLab" className="mx-auto h-16 w-auto" />
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">AI agent demo</p>
            <h1 className="mt-3 text-3xl font-bold text-white">A practical, played by an AI agent</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Watch Nova select apparatus, run a trial, record evidence, and complete a DNA extraction practical from start to finish.
            </p>
            <button
              type="button"
              onClick={() => {
                primeSpeech();
                setAudioEnabled(true);
                setAudioBlocked(false);
                setStarted(true);
              }}
              className="mt-7 rounded-xl bg-cyan-300 px-8 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              ▶ Play demo with audio
            </button>
            <p className="mt-3 text-[11px] font-semibold text-cyan-300/80">Video and voice narration play together</p>
            <p className="mt-1 text-[11px] text-slate-500">{formatClock(totalSeconds)} · No login required</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={score === 100 ? '#34d399' : '#22d3ee'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms ease, stroke 400ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white">{score}%</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">score</span>
      </div>
    </div>
  );
}

function AgentAvatar() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 p-[1px]">
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#071423]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="5" y="7" width="14" height="11" rx="4" />
          <path d="M12 3v4M8.5 12h.01M15.5 12h.01M9.5 15.5h5" strokeLinecap="round" />
          <path d="M3 11v3M21 11v3" strokeLinecap="round" />
        </svg>
      </div>
      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-[#071423]" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
      <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-white">{value}</p>
    </div>
  );
}

function PlanIcon({ state }: { state: PlanStatus }) {
  if (state === 'done') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-bold text-slate-950">
        ✓
      </span>
    );
  }

  if (state === 'active') {
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-cyan-300/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
      </span>
    );
  }

  return <span className="h-5 w-5 shrink-0 rounded-full border border-white/15" />;
}

function Caret() {
  return <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-cyan-300" />;
}

function ApparatusIcon({ kind }: { kind: 'tray' | 'cylinder' | 'forceps' | 'microscope' }) {
  if (kind === 'tray') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="9" width="18" height="8" rx="2" />
        <path d="M7 13c1.5-2 4-2 5.5 0 1.5-2 3.5-2 4.5 0" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'cylinder') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M8 3h8M9 3v16c0 1.4 1.2 2 3 2s3-.6 3-2V3" strokeLinecap="round" />
        <path d="M9 14h6M9 17h6M9 11h4" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'forceps') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M5 4l5 12M19 4l-5 12M10 16l2 4 2-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 20h10M6 20v-5M9 15V8c0-2 1.5-3.5 3.5-3.5H16" strokeLinecap="round" />
      <path d="M16 4.5h4M18 4.5V7M14 15h6" strokeLinecap="round" />
      <circle cx="9" cy="15" r="3" />
    </svg>
  );
}

function formatClock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

declare global {
  interface Window {
    __NOVALAB_DEMO_STARTED__?: boolean;
    __NOVALAB_DEMO_COMPLETE__?: boolean;
  }
}
