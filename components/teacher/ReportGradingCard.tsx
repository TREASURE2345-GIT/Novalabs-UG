import { useEffect, useState, type ChangeEvent } from 'react';
import { gradeReport, type LabReport } from '../../services/reportService';
import {
  connectGoogle,
  generateGeminiText,
  getDriveFileUrl,
  getGoogleConnection,
  isGeminiConfigured,
  isGoogleConfigured,
  uploadFileToDrive,
} from '../../services/googleWorkspaceService';

type ReportGradingCardProps = {
  report: LabReport;
  gradedBy: string;
  onGraded: (report: LabReport) => void;
};

export default function ReportGradingCard({ report, gradedBy, onGraded }: ReportGradingCardProps) {
  const [score, setScore] = useState(report.teacherScore ?? report.autoScore);
  const [feedback, setFeedback] = useState(report.teacherFeedback ?? '');
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [attachmentName, setAttachmentName] = useState(report.teacherAttachmentName ?? '');
  const [attachmentUrl, setAttachmentUrl] = useState(report.teacherAttachmentUrl ?? '');
  const [attachmentMessage, setAttachmentMessage] = useState('');
  const [attachmentIsError, setAttachmentIsError] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  useEffect(() => {
    setScore(report.teacherScore ?? report.autoScore);
    setFeedback(report.teacherFeedback ?? '');
    setAttachmentName(report.teacherAttachmentName ?? '');
    setAttachmentUrl(report.teacherAttachmentUrl ?? '');
  }, [
    report.id,
    report.teacherScore,
    report.teacherFeedback,
    report.teacherAttachmentName,
    report.teacherAttachmentUrl,
  ]);

  const saveGrade = () => {
    const updated = gradeReport(
      report.id,
      score,
      feedback,
      gradedBy,
      attachmentUrl ? { name: attachmentName || 'Drive attachment', url: attachmentUrl } : undefined,
    );
    if (!updated) {
      setMessageIsError(true);
      setMessage('Could not save this grade. The report may have been removed.');
      return;
    }
    onGraded(updated);
    setMessageIsError(false);
    setMessage(`Grade saved at ${new Date(updated.gradedAt ?? Date.now()).toLocaleString()}.`);
  };

  const suggestFeedback = async () => {
    setIsSuggesting(true);
    setMessage('');

    try {
      const rubric = report.criteria
        .map((criterion) => `${criterion.passed ? 'Met' : 'Missing'}: ${criterion.label} (${criterion.marks}/${criterion.maxMarks})`)
        .join('\n');
      const prompt = [
        `Write concise, constructive report feedback for a secondary-school science practical.`,
        `Student: ${report.studentName}`,
        `Experiment: ${report.experimentTitle} (${report.subject})`,
        `Automatic score: ${report.autoScore}%`,
        `Measurement: ${report.measurement || 'Not recorded'}`,
        `Observation: ${report.observation || 'Not recorded'}`,
        `Conclusion: ${report.conclusion || 'Not recorded'}`,
        `Rubric:\n${rubric}`,
        'Give two strengths, two improvements, and one specific next step. Use plain text, no markdown headings.',
      ].join('\n');

      const suggestion = await generateGeminiText(prompt, {
        systemInstruction: 'You are an experienced science teacher. Be specific, encouraging, and concise. Do not change the score.',
        temperature: 0.4,
        maxOutputTokens: 350,
      });

      setFeedback(suggestion);
      setMessageIsError(false);
      setMessage('Gemini feedback suggestion added. Review it before saving.');
    } catch (error) {
      setMessageIsError(true);
      setMessage(error instanceof Error ? error.message : 'Could not generate feedback suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const attachFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);
    setAttachmentMessage('');

    try {
      if (!getGoogleConnection().connected) {
        await connectGoogle();
      }
      const uploaded = await uploadFileToDrive(file);
      setAttachmentName(uploaded.name);
      setAttachmentUrl(getDriveFileUrl(uploaded));
      setAttachmentIsError(false);
      setAttachmentMessage('File uploaded to Google Drive. Save the grade to attach it.');
    } catch (error) {
      setAttachmentIsError(true);
      setAttachmentMessage(error instanceof Error ? error.message : 'Could not upload the attachment.');
    } finally {
      setIsUploadingAttachment(false);
      event.target.value = '';
    }
  };

  const isGraded = report.status === 'graded';

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-gray-900">{report.experimentTitle}</p>
          <p className="text-xs text-gray-500">
            {report.studentName} · {report.subject} · submitted {new Date(report.submittedAt).toLocaleString()}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          isGraded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isGraded ? `Graded ${report.teacherScore}%` : `Awaiting grade · auto ${report.autoScore}%`}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-gray-500">Auto score</p>
          <p className="text-lg font-bold text-gray-900">{report.autoScore}%</p>
          <p className="text-[11px] text-gray-500">{report.autoGrade}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-gray-500">Apparatus</p>
          <p className="text-lg font-bold text-gray-900">{report.apparatusPlaced}/{report.totalApparatus}</p>
          <p className="text-[11px] text-gray-500">{report.apparatusUsed} used</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-gray-500">Trials</p>
          <p className="text-lg font-bold text-gray-900">{report.trials}</p>
          <p className="text-[11px] text-gray-500">recorded</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-gray-500">Criteria met</p>
          <p className="text-lg font-bold text-gray-900">
            {report.criteria.filter((criterion) => criterion.passed).length}/{report.criteria.length}
          </p>
          <p className="text-[11px] text-gray-500">auto rubric</p>
        </div>
      </div>

      <details className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-gray-800">View student evidence</summary>
        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Measurement:</span> {report.measurement || 'Not recorded'}</p>
          <p><span className="font-semibold">Observation:</span> {report.observation || 'Not recorded'}</p>
          <p><span className="font-semibold">Conclusion:</span> {report.conclusion || 'Not recorded'}</p>
          <ul className="mt-2 space-y-1 text-xs">
            {report.criteria.map((criterion) => (
              <li key={criterion.id} className="flex items-start justify-between gap-3">
                <span className={criterion.passed ? 'text-emerald-700' : 'text-rose-700'}>
                  {criterion.passed ? 'Met' : 'Missing'} · {criterion.label}
                </span>
                <span className="font-mono text-gray-500">{criterion.marks}/{criterion.maxMarks}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <div className="mt-3 grid gap-2 sm:grid-cols-[120px_1fr]">
        <label className="text-xs font-semibold text-gray-600">
          Teacher score (%)
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(event) => setScore(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          />
        </label>
        <label className="text-xs font-semibold text-gray-600">
          Feedback
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            rows={2}
            placeholder="What went well? What should the student improve?"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          />
        </label>
      </div>

      {(isGoogleConfigured() || attachmentUrl) && (
        <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          {isGoogleConfigured() && (
            <label className="cursor-pointer rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100">
              {isUploadingAttachment
                ? 'Uploading...'
                : attachmentUrl
                  ? 'Replace Drive attachment'
                  : 'Attach feedback file to Drive'}
              <input
                type="file"
                onChange={attachFile}
                disabled={isUploadingAttachment}
                className="sr-only"
              />
            </label>
          )}
          {attachmentUrl && (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-700 underline"
            >
              {attachmentName || 'Drive attachment'}
            </a>
          )}
          {attachmentMessage && (
            <p className={`text-xs font-medium ${attachmentIsError ? 'text-rose-700' : 'text-blue-800'}`}>
              {attachmentMessage}
            </p>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={saveGrade} className="btn-primary text-sm">
          {isGraded ? 'Update grade' : 'Save grade'}
        </button>
        {isGeminiConfigured() && (
          <button
            type="button"
            onClick={suggestFeedback}
            disabled={isSuggesting}
            className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSuggesting ? 'Generating...' : 'Suggest feedback with Gemini'}
          </button>
        )}
        {message && (
          <p className={`text-xs font-medium ${messageIsError ? 'text-rose-700' : 'text-emerald-700'}`}>
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
