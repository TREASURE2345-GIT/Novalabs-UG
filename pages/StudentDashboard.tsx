import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { experimentCatalog } from '../data/experimentCatalog';
import { getProgressForUser, type ProgressEntry } from '../services/progressService';
import { safeStorage } from '../lib/storage';
import type { Subject } from '../types';
import { askTeacherQuestion } from '../services/teacherWorkspaceService';
import SubjectIcon from '@components/ui/SubjectIcon';
import ApparatusPreview from '@components/apparatus/ApparatusPreview';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [questionSubject, setQuestionSubject] = useState<Subject>('biology');
  const [className, setClassName] = useState('');
  const [questionMessage, setQuestionMessage] = useState('');
  const progressEntries = useMemo(() => getProgressForUser(user?.id), [user?.id]);
  const experiments = Object.values(experimentCatalog);
  const startedExperiments = experiments.filter((experiment) => progressEntries[experiment.slug]);
  const completedExperiments = startedExperiments.filter((experiment) => progressEntries[experiment.slug]?.completed === true);
  const averageScore = startedExperiments.length
    ? Math.round(startedExperiments.reduce((total, experiment) => total + (progressEntries[experiment.slug]?.score ?? 0), 0) / startedExperiments.length)
    : 0;
  const overallProgress = experiments.length
    ? Math.round(experiments.reduce((total, experiment) => total + getCompletionPercent(progressEntries[experiment.slug]), 0) / experiments.length)
    : 0;
  const subjectProgress = (subject: string) => {
    const subjectExperiments = experiments.filter((experiment) => experiment.subject === subject);
    return subjectExperiments.length
      ? Math.round(subjectExperiments.reduce((total, experiment) => total + getCompletionPercent(progressEntries[experiment.slug]), 0) / subjectExperiments.length)
      : 0;
  };
  const recentActivity = startedExperiments
    .sort((first, second) => (progressEntries[second.slug]?.updatedAt ?? 0) - (progressEntries[first.slug]?.updatedAt ?? 0))
    .slice(0, 4);

  const submitQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim() || !className.trim()) {
      setQuestionMessage('Add your class and question before sending.');
      return;
    }
    let teacherIds: string[] = [];
    try {
      const saved = safeStorage.getItem('virtual-science-lab-teacher-workspaces');
      const workspaces: unknown = saved ? JSON.parse(saved) : {};
      if (workspaces && typeof workspaces === 'object' && !Array.isArray(workspaces)) {
        teacherIds = Object.keys(workspaces);
      }
    } catch {
      teacherIds = [];
    }
    if (!teacherIds.length) {
      setQuestionMessage('Your teacher has not opened a question workspace yet.');
      return;
    }
    teacherIds.forEach((teacherId) => askTeacherQuestion(teacherId, {
      studentName: user?.name ?? 'Student',
      className: className.trim(),
      subject: questionSubject,
      question: question.trim(),
    }));
    setQuestion('');
    setQuestionMessage('Question sent to your teachers.');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-blue-100">Continue your science learning journey with interactive experiments.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Experiments Completed" value={`${completedExperiments.length}/${experiments.length}`} icon="✓" color="bg-green-100" />
        <StatsCard label="Experiments Started" value={`${startedExperiments.length}`} icon="🔬" color="bg-orange-100" />
        <StatsCard label="Average Score" value={`${averageScore}%`} icon="⭐" color="bg-yellow-100" />
        <StatsCard label="Overall Progress" value={`${overallProgress}%`} icon="📈" color="bg-blue-100" />
      </div>

      {/* Available Labs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LabCard
            subject="biology"
            title="Biology"
            description="DNA Extraction, Cell Division, Genetics"
            href="/labs/biology"
            progress={subjectProgress('biology')}
          />
          <LabCard
            subject="chemistry"
            title="Chemistry"
            description="Titrations, Equilibrium, Thermochemistry"
            href="/labs/chemistry"
            progress={subjectProgress('chemistry')}
          />
          <LabCard
            subject="physics"
            title="Physics"
            description="Mechanics, Optics, Circuits, Waves"
            href="/labs/physics"
            progress={subjectProgress('physics')}
          />
          <LabCard
            subject="agriculture"
            title="Agriculture"
            description="Soil Analysis, Crop Management"
            href="/labs/agriculture"
            progress={subjectProgress('agriculture')}
          />
        </div>
      </div>

      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Set up a practical</h2>
          <p className="mt-1 text-sm text-gray-600">Pick a subject, see the apparatus it needs, then open the guided setup bench.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(['biology', 'chemistry', 'physics', 'agriculture'] as Subject[]).map((subject) => {
            const first = experiments.find((experiment) => experiment.subject === subject);
            if (!first) return null;
            return (
              <div key={subject} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <SubjectIcon subject={subject} title={`${subject} apparatus`} className="h-10 w-10" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{subject}</p>
                    <h3 className="text-sm font-bold text-gray-900">{first.title}</h3>
                  </div>
                </div>
                <ApparatusPreview slug={first.slug} title="Apparatus provided" limit={4} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-12 card">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Teacher support</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Ask a question</h2>
          <p className="mt-1 text-sm text-gray-600">Send your question to teachers who cover the selected subject.</p>
        </div>
        <form onSubmit={submitQuestion} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input value={className} onChange={(event) => setClassName(event.target.value)} placeholder="Your class" className="rounded-lg border border-gray-300 px-3 py-2" />
          <select value={questionSubject} onChange={(event) => setQuestionSubject(event.target.value as Subject)} className="rounded-lg border border-gray-300 px-3 py-2">
            <option value="biology">Biology</option>
            <option value="chemistry">Chemistry</option>
            <option value="physics">Physics</option>
            <option value="agriculture">Agriculture</option>
          </select>
          <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What do you need help with?" className="rounded-lg border border-gray-300 px-3 py-2 md:col-span-2" />
          <button type="submit" className="btn-primary md:col-span-4 md:justify-self-start">Send question</button>
        </form>
        {questionMessage && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{questionMessage}</p>}
      </section>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            {recentActivity.length ? recentActivity.map((experiment) => {
              const progress = progressEntries[experiment.slug];
              return (
                <ActivityItem
                  key={experiment.slug}
                  title={`${progress?.completed ? 'Completed' : 'In progress'}: ${experiment.title}`}
                  score={`${progress?.score ?? 0}%`}
                  date={formatActivityDate(progress)}
                  icon={progress?.completed ? '✓' : '⏳'}
                />
              );
            }) : <p className="p-6 text-gray-600">Start an experiment to see your progress here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCompletionPercent(progress?: ProgressEntry) {
  if (!progress) return 0;
  if (progress.totalSteps && progress.totalSteps > 0) {
    return Math.round(((progress.completedSteps ?? 0) / progress.totalSteps) * 100);
  }
  return progress.completed ? 100 : Math.min(99, progress.score ?? 0);
}

function formatActivityDate(progress?: ProgressEntry) {
  if (!progress?.updatedAt) return 'Progress saved';
  return `Updated ${new Date(progress.updatedAt).toLocaleDateString()}`;
}

function StatsCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="card">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function LabCard({
  subject,
  title,
  description,
  href,
  progress,
  disabled = false,
}: {
  subject: Subject;
  title: string;
  description: string;
  href: string;
  progress: number;
  disabled?: boolean;
}) {
  return (
    <Link
      to={disabled ? '#' : href}
      className={`card-lab ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
    >
      <SubjectIcon subject={subject} title={title} className="w-16 h-16 mb-4" />
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-4">{description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-2">{progress}% complete</p>
    </Link>
  );
}

function ActivityItem({
  title,
  score,
  date,
  icon,
}: {
  title: string;
  score: string;
  date: string;
  icon: string;
}) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">{score}</p>
      </div>
    </div>
  );
}
