import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import type { Subject } from '../types';
import { experimentCatalog } from '../data/experimentCatalog';
import { getAllProgressRecords } from '../services/progressService';
import { getAllReports, getReportStats, type LabReport } from '../services/reportService';
import ReportGradingCard from '../components/teacher/ReportGradingCard';
import GoogleWorkspacePanel from '../components/google/GoogleWorkspacePanel';
import type { GoogleCourse, GoogleDriveFile, YouTubeVideo } from '../services/googleWorkspaceService';
import {
  answerQuestion,
  getTeacherWorkspace,
  saveLecture,
  saveTeacherResource,
  saveTeacherVideo,
  type StudentQuestion,
  type TeacherWorkspace,
} from '../services/teacherWorkspaceService';

const subjectLabels: Record<Subject, string> = {
  biology: 'Biology',
  chemistry: 'Chemistry',
  physics: 'Physics',
  agriculture: 'Agriculture',
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [taskMessage, setTaskMessage] = useState('');
  const [progressRefreshToken, setProgressRefreshToken] = useState(0);
  const [labReports, setLabReports] = useState<LabReport[]>(() => getAllReports());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [workspace, setWorkspace] = useState<TeacherWorkspace>({ videos: [], questions: [], lectures: [], resources: [] });
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSubject, setVideoSubject] = useState<Subject>(user?.subjects?.[0] ?? 'biology');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [lectureForm, setLectureForm] = useState({ title: '', subject: (user?.subjects?.[0] ?? 'biology') as Subject, className: '', startsAt: '', meetingUrl: '', notes: '' });
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [workspaceMessage, setWorkspaceMessage] = useState('');

  const teacherSubjects = user?.subjects?.length ? user.subjects : ['biology' as Subject];
  const learnerProgress = useMemo(
    () => getAllProgressRecords().filter((record) => record.userId !== 'guest' && record.userId !== user?.id),
    [progressRefreshToken, user?.id],
  );
  const learnerCount = new Set(learnerProgress.map((record) => record.userId)).size;
  const practicalSubmissions = learnerProgress.filter((record) => record.progress.practicalComplete === true).length;
  const completedExperiments = learnerProgress.filter((record) => record.progress.completed === true).length;
  const averageScore = learnerProgress.length
    ? Math.round(learnerProgress.reduce((total, record) => total + (record.progress.score ?? 0), 0) / learnerProgress.length)
    : 0;
  const reportStats = useMemo(() => getReportStats(labReports), [labReports]);

  const handleReportGraded = () => {
    setLabReports(getAllReports());
  };
  const experimentAnalytics = Object.values(experimentCatalog).map((experiment) => {
    const records = learnerProgress.filter((record) => record.experimentKey === experiment.slug);
    const average = records.length
      ? Math.round(records.reduce((total, record) => total + (record.progress.score ?? 0), 0) / records.length)
      : 0;
    return {
      ...experiment,
      learners: new Set(records.map((record) => record.userId)).size,
      practical: records.filter((record) => record.progress.practicalComplete === true).length,
      completed: records.filter((record) => record.progress.completed === true).length,
      average,
    };
  });

  useEffect(() => {
    if (user?.id) setWorkspace(getTeacherWorkspace(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (!videoFile) {
      setVideoUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    setVideoUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [videoFile]);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError('');

    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setVideoFile(null);
      setUploadError('Please choose a video file.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setVideoFile(null);
      setUploadError('Video files must be smaller than 100 MB.');
      return;
    }

    setVideoFile(file);
    setTaskMessage(`Video "${file.name}" selected and ready. You can publish it using the resources section above.`);
  };

  const handlePublishVideo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id || !videoTitle.trim() || !youtubeUrl.trim()) {
      setWorkspaceMessage('Add a title and YouTube link before publishing.');
      return;
    }
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      setWorkspaceMessage('Please use a valid YouTube link.');
      return;
    }
    const saved = saveTeacherVideo(user.id, { title: videoTitle.trim(), subject: videoSubject, youtubeUrl: youtubeUrl.trim(), description: videoDescription.trim() });
    setWorkspace((current) => ({ ...current, videos: [saved, ...current.videos] }));
    setVideoTitle('');
    setYoutubeUrl('');
    setVideoDescription('');
    setWorkspaceMessage('Video published to your student resources.');
  };

  const handleScheduleLecture = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id || !lectureForm.title || !lectureForm.className || !lectureForm.startsAt || !lectureForm.meetingUrl) {
      setWorkspaceMessage('Complete the lecture title, class, time, and meeting link.');
      return;
    }
    const saved = saveLecture(user.id, lectureForm);
    setWorkspace((current) => ({ ...current, lectures: [saved, ...current.lectures] }));
    setLectureForm({ title: '', subject: teacherSubjects[0], className: '', startsAt: '', meetingUrl: '', notes: '' });
    setWorkspaceMessage('Online lecture scheduled successfully for the selected class.');
  };

  const handleAnswer = (question: StudentQuestion) => {
    if (!user?.id || !answerDrafts[question.id]?.trim()) return;
    const questions = answerQuestion(user.id, question.id, answerDrafts[question.id].trim());
    setWorkspace((current) => ({ ...current, questions }));
    setWorkspaceMessage('Your guidance was saved for the student.');
  };

  const handleUseGoogleClass = (course: GoogleCourse) => {
    const className = [course.name, course.section].filter(Boolean).join(' - ');
    setLectureForm((current) => ({ ...current, className }));
    setWorkspaceMessage(`Class "${className}" is ready for your next lecture.`);
  };

  const handleAttachDriveFile = (file: GoogleDriveFile) => {
    if (!user?.id) return;
    const saved = saveTeacherResource(user.id, {
      title: file.name,
      subject: videoSubject,
      url: file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`,
      source: 'drive',
      description: file.mimeType,
    });
    setWorkspace((current) => ({ ...current, resources: [saved, ...current.resources] }));
    setWorkspaceMessage(`Drive file "${file.name}" attached to your resources.`);
  };

  const handleUseYouTubeVideo = (video: YouTubeVideo) => {
    if (!user?.id) return;
    const saved = saveTeacherVideo(user.id, {
      title: video.title,
      subject: videoSubject,
      youtubeUrl: video.url,
      description: video.description.slice(0, 280),
    });
    setWorkspace((current) => ({ ...current, videos: [saved, ...current.videos] }));
    setWorkspaceMessage(`YouTube video "${video.title}" added to your lesson resources.`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-green-100">Manage your classes and monitor student progress.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {teacherSubjects.map((subject) => <span key={subject} className="rounded-full bg-white/15 px-3 py-1 text-sm">Teaching {subjectLabels[subject]}</span>)}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Learners with progress" value={`${learnerCount}`} icon="👥" color="bg-blue-100" />
        <MetricCard label="Practical submissions" value={`${practicalSubmissions}`} icon="🧪" color="bg-green-100" />
        <MetricCard label="Completed experiments" value={`${completedExperiments}`} icon="✓" color="bg-yellow-100" />
        <MetricCard label="Average score" value={`${averageScore}%`} icon="📊" color="bg-purple-100" />
      </div>

      <GoogleWorkspacePanel
        resources={workspace.resources}
        onUseClass={handleUseGoogleClass}
        onAttachDriveFile={handleAttachDriveFile}
        onUseYouTubeVideo={handleUseYouTubeVideo}
      />

      <section className="card mb-12">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Live learner evidence</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Experiment progress by practical</h2>
            <p className="mt-1 text-sm text-gray-600">These figures are calculated from student progress saved by this platform.</p>
          </div>
          <button type="button" onClick={() => setProgressRefreshToken((current) => current + 1)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Refresh data
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experimentAnalytics.map((experiment) => (
            <div key={experiment.slug} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">{experiment.title}</h3>
                  <p className="mt-1 text-xs capitalize text-gray-500">{experiment.subject} · {experiment.difficulty}</p>
                </div>
                <span className="text-2xl">{experiment.icon}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <AnalyticsValue label="Learners" value={experiment.learners} />
                <AnalyticsValue label="Practical" value={experiment.practical} />
                <AnalyticsValue label="Done" value={experiment.completed} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">Average score</span>
                <span className="font-bold text-green-700">{experiment.average}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="lab-report-grading" className="card mb-12">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Lab report grading</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Student practical reports</h2>
            <p className="mt-1 text-sm text-gray-600">
              Review automatic scores, student evidence and conclusions, then record your teacher score and feedback.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLabReports(getAllReports())}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh reports
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Awaiting grade</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{reportStats.pending}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Graded</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{reportStats.graded}</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Average auto score</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">{reportStats.averageAutoScore}%</p>
          </div>
          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">Average teacher score</p>
            <p className="mt-1 text-2xl font-bold text-purple-900">{reportStats.averageTeacherScore}%</p>
          </div>
        </div>

        {labReports.length ? (
          <div className="space-y-4">
            {labReports.map((report) => (
              <ReportGradingCard
                key={report.id}
                report={report}
                gradedBy={user?.name ?? 'Teacher'}
                onGraded={handleReportGraded}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No lab reports submitted yet. Student reports will appear here automatically after they submit a practical.
          </div>
        )}
      </section>

      <div className="mb-12 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <section className="card">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Student resources</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">Publish a YouTube lesson</h2>
              <p className="mt-1 text-sm text-gray-600">Share a focused video with students in one of your subjects.</p>
            </div>
            <span className="text-3xl">▶</span>
          </div>
          <form onSubmit={handlePublishVideo} className="space-y-3">
            <input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} placeholder="Lesson title" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select value={videoSubject} onChange={(event) => setVideoSubject(event.target.value as Subject)} className="rounded-lg border border-gray-300 px-3 py-2">
                {teacherSubjects.map((subject) => <option key={subject} value={subject}>{subjectLabels[subject]}</option>)}
              </select>
              <input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://youtube.com/watch?v=..." className="rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <textarea value={videoDescription} onChange={(event) => setVideoDescription(event.target.value)} placeholder="What should students learn from this video?" rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <button type="submit" className="btn-primary">Publish video</button>
          </form>
          <div className="mt-6 space-y-3">
            {workspace.videos.length ? workspace.videos.map((video) => (
              <div key={video.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-semibold text-gray-900">{video.title}</p><p className="text-xs text-gray-500">{subjectLabels[video.subject]}</p></div>
                  <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800">Open video</a>
                </div>
                <p className="mt-1 text-sm text-gray-600">{video.description}</p>
              </div>
            )) : <p className="text-sm text-gray-500">Your published lessons will appear here.</p>}
          </div>
        </section>

        <section className="card">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Live teaching</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Organise an online lecture</h2>
            <p className="mt-1 text-sm text-gray-600">Add a meeting link and students can join from their class workspace.</p>
          </div>
          <form onSubmit={handleScheduleLecture} className="space-y-3">
            <input value={lectureForm.title} onChange={(event) => setLectureForm({ ...lectureForm, title: event.target.value })} placeholder="Lecture title" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select value={lectureForm.subject} onChange={(event) => setLectureForm({ ...lectureForm, subject: event.target.value as Subject })} className="rounded-lg border border-gray-300 px-3 py-2">
                {teacherSubjects.map((subject) => <option key={subject} value={subject}>{subjectLabels[subject]}</option>)}
              </select>
              <input value={lectureForm.className} onChange={(event) => setLectureForm({ ...lectureForm, className: event.target.value })} placeholder="Class name" className="rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <input type="datetime-local" value={lectureForm.startsAt} onChange={(event) => setLectureForm({ ...lectureForm, startsAt: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <input type="url" value={lectureForm.meetingUrl} onChange={(event) => setLectureForm({ ...lectureForm, meetingUrl: event.target.value })} placeholder="https://meet.google.com/..." className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <textarea value={lectureForm.notes} onChange={(event) => setLectureForm({ ...lectureForm, notes: event.target.value })} placeholder="Preparation notes or resources" rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <button type="submit" className="btn-success">Schedule lecture</button>
          </form>
          <div className="mt-6 space-y-3">
            {workspace.lectures.length ? workspace.lectures.map((lecture) => (
              <div key={lecture.id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="font-semibold text-gray-900">{lecture.title}</p>
                <p className="text-sm text-gray-600">{lecture.className} · {new Date(lecture.startsAt).toLocaleString()}</p>
                <a href={lecture.meetingUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-blue-700">Join meeting</a>
              </div>
            )) : <p className="text-sm text-gray-500">Your scheduled lectures will appear here.</p>}
          </div>
        </section>
      </div>

      <section className="card mb-12">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Class support</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Student questions</h2>
            <p className="mt-1 text-sm text-gray-600">Answer questions from your classes and give learners a clear next step.</p>
          </div>
          <span className="text-3xl">?</span>
        </div>
        {workspace.questions.length ? <div className="space-y-4">
          {workspace.questions.map((question) => (
            <article key={question.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">{question.studentName} <span className="font-normal text-gray-500">· {question.className}</span></p>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">{subjectLabels[question.subject]}</span>
              </div>
              <p className="mt-2 text-gray-700">{question.question}</p>
              {question.answer ? <p className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-900"><strong>Your guidance:</strong> {question.answer}</p> : <div className="mt-3 flex gap-2"><input value={answerDrafts[question.id] ?? ''} onChange={(event) => setAnswerDrafts({ ...answerDrafts, [question.id]: event.target.value })} placeholder="Write guidance for this student" className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" /><button type="button" onClick={() => handleAnswer(question)} className="btn-primary text-sm">Reply</button></div>}
            </article>
          ))}
        </div> : <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No unanswered questions from your classes yet. New student questions will appear here.</div>}
      </section>

      {/* Pending Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Teacher Actions</h2>
        <div className="bg-white rounded-lg shadow divide-y">
          <TaskItem
            title="Grade Assignment: DNA Extraction Lab"
            count={`${reportStats.pending} reports pending`}
            priority="high"
            onAction={() => {
              setTaskMessage('Lab report grading workspace ready. Review evidence, auto scores and feedback below.');
              document.getElementById('lab-report-grading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
          <TaskItem
            title="Create New Assignment"
            count="Set up practical assignments for classes"
            priority="medium"
            onAction={() => setTaskMessage('Assignment builder active. Select experiment, class, due date and instructions to create a new assignment.')}
          />
          <TaskItem
            title="Review Student Progress Reports"
            count="Comprehensive class analytics"
            priority="medium"
            onAction={() => setTaskMessage('Progress reports loaded. View individual and class performance across all practicals.')}
          />
          <TaskItem
            title="Manage Class Resources"
            count="Videos, lectures and materials"
            priority="medium"
            onAction={() => setTaskMessage('Resource manager opened. Publish videos, schedule lectures, and share learning materials.')}
          />
          <TaskItem
            title="Upload Video Demonstration"
            count="For student learning resources"
            priority="low"
            action={
              <>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Choose video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="sr-only"
                  />
                </label>
                {videoFile && <span className="text-sm text-green-700 ml-2">Ready</span>}
              </>
            }
          />
        </div>
        {taskMessage && <p className="mt-3 rounded bg-blue-50 p-3 text-sm text-blue-800">{taskMessage}</p>}
      </div>

      {(videoFile || uploadError) && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          {uploadError ? (
            <p className="text-sm text-red-700">{uploadError}</p>
          ) : (
            <>
              <p className="font-medium text-gray-900">{videoFile?.name}</p>
              <p className="mt-1 text-sm text-gray-600">Video selected ({((videoFile?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB) and ready for publishing. Use the resources section to publish.</p>
              {videoUrl && (
                <video controls className="mt-3 max-h-64 w-full rounded-lg bg-black" src={videoUrl}>
                  Your browser does not support video playback.
                </video>
              )}
            </>
          )}
        </div>
      )}
      {workspaceMessage && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{workspaceMessage}</p>}
    </div>
  );
}

function MetricCard({
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

function AnalyticsValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-2">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

function TaskItem({
  title,
  count,
  priority,
  action,
  onAction,
}: {
  title: string;
  count: string;
  priority: 'high' | 'medium' | 'low';
  action?: React.ReactNode;
  onAction?: () => void;
}) {
  const priorityColor =
    priority === 'high' ? 'bg-red-50' : priority === 'medium' ? 'bg-yellow-50' : 'bg-green-50';

  return (
    <div className={`p-4 flex items-center justify-between ${priorityColor}`}>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{count}</p>
      </div>
      {action ?? (
        <button onClick={onAction} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          Action
        </button>
      )}
    </div>
  );
}
