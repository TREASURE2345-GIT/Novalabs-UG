import { useState } from 'react';
import {
  connectGoogle,
  disconnectGoogle,
  getDriveFileUrl,
  getGoogleConnection,
  isGeminiConfigured,
  isYouTubeConfigured,
  listCourseStudents,
  listCourseWork,
  listCourses,
  listDriveFiles,
  searchYouTubeVideos,
  uploadFileToDrive,
  type GoogleConnection,
  type GoogleCourse,
  type GoogleCourseWork,
  type GoogleDriveFile,
  type GoogleStudent,
  type YouTubeVideo,
} from '../../services/googleWorkspaceService';
import type { TeacherResource } from '../../services/teacherWorkspaceService';

type GoogleWorkspacePanelProps = {
  resources: TeacherResource[];
  onUseClass: (course: GoogleCourse) => void;
  onAttachDriveFile: (file: GoogleDriveFile) => void;
  onUseYouTubeVideo: (video: YouTubeVideo) => void;
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

const escapeDriveQuery = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export default function GoogleWorkspacePanel({
  resources,
  onUseClass,
  onAttachDriveFile,
  onUseYouTubeVideo,
}: GoogleWorkspacePanelProps) {
  const [connection, setConnection] = useState<GoogleConnection>(() => getGoogleConnection());
  const [courses, setCourses] = useState<GoogleCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState<GoogleStudent[]>([]);
  const [coursework, setCoursework] = useState<GoogleCourseWork[]>([]);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [driveQuery, setDriveQuery] = useState('');
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<YouTubeVideo[]>([]);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  const reportMessage = (text: string, isError = false) => {
    setMessage(text);
    setMessageIsError(isError);
  };

  const handleConnect = async () => {
    setBusy('connect');
    reportMessage('');
    try {
      await connectGoogle();
      setConnection(getGoogleConnection());
      const loadedCourses = await listCourses();
      setCourses(loadedCourses);
      reportMessage(
        loadedCourses.length
          ? `Connected. Imported ${loadedCourses.length} active Classroom course${loadedCourses.length === 1 ? '' : 's'}.`
          : 'Connected. No active Classroom courses were found for this account.',
      );
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not connect Google.', true);
    } finally {
      setBusy('');
    }
  };

  const handleDisconnect = () => {
    disconnectGoogle();
    setConnection(getGoogleConnection());
    setCourses([]);
    setSelectedCourseId('');
    setStudents([]);
    setCoursework([]);
    setDriveFiles([]);
    setYoutubeResults([]);
    reportMessage('Google account disconnected.');
  };

  const handleLoadCourses = async () => {
    setBusy('courses');
    reportMessage('');
    try {
      const loadedCourses = await listCourses();
      setCourses(loadedCourses);
      reportMessage(`Loaded ${loadedCourses.length} active Classroom course${loadedCourses.length === 1 ? '' : 's'}.`);
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not load Classroom courses.', true);
    } finally {
      setBusy('');
    }
  };

  const handleOpenCourse = async (course: GoogleCourse) => {
    setSelectedCourseId(course.id);
    setBusy(`course-${course.id}`);
    reportMessage('');
    try {
      const [roster, work] = await Promise.all([
        listCourseStudents(course.id),
        listCourseWork(course.id),
      ]);
      setStudents(roster);
      setCoursework(work);
      reportMessage(`Loaded ${roster.length} students and ${work.length} coursework items from ${course.name}.`);
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not load this Classroom course.', true);
    } finally {
      setBusy('');
    }
  };

  const handleUseClass = (course: GoogleCourse) => {
    onUseClass(course);
    reportMessage(`Class "${course.name}" added to the lecture form.`);
  };

  const handleLoadDriveFiles = async () => {
    setBusy('drive');
    reportMessage('');
    try {
      const query = driveQuery.trim() ? `name contains '${escapeDriveQuery(driveQuery.trim())}'` : '';
      const files = await listDriveFiles(query);
      setDriveFiles(files);
      reportMessage(`Loaded ${files.length} Drive file${files.length === 1 ? '' : 's'}.`);
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not load Drive files.', true);
    } finally {
      setBusy('');
    }
  };

  const handleUploadDriveFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setBusy('drive-upload');
    reportMessage('');
    try {
      const uploaded = await uploadFileToDrive(file);
      setDriveFiles((current) => [uploaded, ...current]);
      reportMessage(`Uploaded "${uploaded.name}" to Google Drive.`);
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not upload this file to Drive.', true);
    } finally {
      input.value = '';
      setBusy('');
    }
  };

  const handleAttachDriveFile = (file: GoogleDriveFile) => {
    onAttachDriveFile(file);
    reportMessage(`Attached "${file.name}" to your teacher resources.`);
  };

  const handleSearchYouTube = async () => {
    if (!youtubeQuery.trim()) {
      reportMessage('Enter a topic to search YouTube.', true);
      return;
    }

    setBusy('youtube');
    reportMessage('');
    try {
      const videos = await searchYouTubeVideos(youtubeQuery.trim());
      setYoutubeResults(videos);
      reportMessage(`Found ${videos.length} YouTube video${videos.length === 1 ? '' : 's'}.`);
    } catch (error) {
      reportMessage(error instanceof Error ? error.message : 'Could not search YouTube.', true);
    } finally {
      setBusy('');
    }
  };

  const handleUseYouTubeVideo = (video: YouTubeVideo) => {
    onUseYouTubeVideo(video);
    reportMessage(`Added "${video.title}" to your lesson resources.`);
  };

  return (
    <section className="card mb-12">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Google Workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Classroom, Drive, and YouTube</h2>
          <p className="mt-1 text-sm text-gray-600">
            Import Google Classroom courses, attach Drive files, and find lesson videos. Gemini powers AI help when configured.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${
            connection.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {connection.connected ? 'Google connected' : connection.configured ? 'Google not connected' : 'Google client ID missing'}
          </span>
          <span className={`rounded-full px-2.5 py-1 font-semibold ${
            isGeminiConfigured() ? 'bg-violet-100 text-violet-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {isGeminiConfigured() ? 'Gemini ready' : 'Gemini key missing'}
          </span>
          <span className={`rounded-full px-2.5 py-1 font-semibold ${
            isYouTubeConfigured() ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {isYouTubeConfigured() ? 'YouTube API ready' : 'YouTube key missing'}
          </span>
        </div>
      </div>

      {!connection.configured && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Add <code className="rounded bg-white px-1">VITE_GOOGLE_CLIENT_ID</code> to <code className="rounded bg-white px-1">.env.local</code> to enable Classroom and Drive.
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {connection.connected ? (
          <button type="button" onClick={handleDisconnect} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Disconnect Google
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={!connection.configured || busy === 'connect'}
            className="btn-primary text-sm"
          >
            {busy === 'connect' ? 'Connecting...' : 'Connect Google account'}
          </button>
        )}
        <button
          type="button"
          onClick={handleLoadCourses}
          disabled={!connection.connected || busy === 'courses'}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === 'courses' ? 'Loading...' : 'Refresh Classroom'}
        </button>
        <button
          type="button"
          onClick={handleLoadDriveFiles}
          disabled={!connection.connected || busy === 'drive'}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === 'drive' ? 'Loading...' : 'Load Drive files'}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold text-gray-900">Google Classroom</h3>
          <p className="mt-1 text-xs text-gray-600">Import courses, rosters, and published coursework.</p>

          <div className="mt-3 space-y-2">
            {courses.length ? courses.map((course) => {
              const isSelected = selectedCourseId === course.id;
              const isLoading = busy === `course-${course.id}`;

              return (
                <div key={course.id} className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="font-semibold text-sm text-gray-900">{course.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {[course.section, course.room].filter(Boolean).join(' · ') || 'Active course'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCourse(course)}
                      disabled={isLoading}
                      className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : isSelected ? 'Reload' : 'Open'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseClass(course)}
                      className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Use for lecture
                    </button>
                    {course.alternateLink && (
                      <a
                        href={course.alternateLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Classroom
                      </a>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                      <p className="font-semibold text-gray-900">{students.length} students · {coursework.length} coursework</p>
                      {students.length > 0 && (
                        <details>
                          <summary className="cursor-pointer font-medium">Roster</summary>
                          <ul className="mt-1 space-y-1">
                            {students.map((student) => (
                              <li key={student.userId} className="truncate">
                                {student.name}{student.email ? ` · ${student.email}` : ''}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {coursework.length > 0 && (
                        <details>
                          <summary className="cursor-pointer font-medium">Coursework</summary>
                          <ul className="mt-1 space-y-1">
                            {coursework.map((item) => (
                              <li key={item.id}>
                                {item.alternateLink ? (
                                  <a href={item.alternateLink} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                                    {item.title}
                                  </a>
                                ) : item.title}
                                {item.dueAt ? ` · due ${formatDate(item.dueAt)}` : ''}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              );
            }) : (
              <p className="text-sm text-gray-500">
                {connection.connected ? 'No Classroom courses loaded yet. Use Refresh Classroom.' : 'Connect Google to import courses.'}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold text-gray-900">Google Drive</h3>
          <p className="mt-1 text-xs text-gray-600">Upload files and attach them to teacher resources.</p>

          <div className="mt-3 flex gap-2">
            <input
              value={driveQuery}
              onChange={(event) => setDriveQuery(event.target.value)}
              placeholder="Search files"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleLoadDriveFiles}
              disabled={!connection.connected || busy === 'drive'}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Search
            </button>
          </div>

          <label className={`mt-2 inline-flex cursor-pointer items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 ${
            !connection.connected || busy === 'drive-upload' ? 'cursor-not-allowed opacity-50' : ''
          }`}>
            {busy === 'drive-upload' ? 'Uploading...' : 'Upload to Drive'}
            <input
              type="file"
              className="sr-only"
              disabled={!connection.connected || busy === 'drive-upload'}
              onChange={handleUploadDriveFile}
            />
          </label>

          <div className="mt-3 space-y-2">
            {driveFiles.length ? driveFiles.slice(0, 8).map((file) => (
              <div key={file.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="truncate text-sm font-semibold text-gray-900">{file.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {file.mimeType}{file.modifiedTime ? ` · ${formatDate(file.modifiedTime)}` : ''}
                </p>
                <div className="mt-2 flex gap-2">
                  <a
                    href={getDriveFileUrl(file)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleAttachDriveFile(file)}
                    className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Attach
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">
                {connection.connected ? 'Search Drive or upload a file.' : 'Connect Google to use Drive.'}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold text-gray-900">YouTube lessons</h3>
          <p className="mt-1 text-xs text-gray-600">Search safe results and add them to your lesson resources.</p>

          <div className="mt-3 flex gap-2">
            <input
              value={youtubeQuery}
              onChange={(event) => setYoutubeQuery(event.target.value)}
              placeholder="e.g. photosynthesis lab"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleSearchYouTube}
              disabled={!isYouTubeConfigured() || busy === 'youtube'}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {busy === 'youtube' ? 'Searching...' : 'Search'}
            </button>
          </div>

          {!isYouTubeConfigured() && (
            <p className="mt-2 text-xs text-amber-800">Add VITE_YOUTUBE_API_KEY to enable search.</p>
          )}

          <div className="mt-3 space-y-2">
            {youtubeResults.map((video) => (
              <div key={video.videoId} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex gap-2">
                  {video.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-14 w-24 flex-none rounded object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">{video.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{video.channelTitle}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => handleUseYouTubeVideo(video)}
                    className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Add to resources
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900">Attached teacher resources</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="truncate text-sm font-semibold text-gray-900">{resource.title}</p>
                <p className="mt-0.5 text-xs capitalize text-gray-500">{resource.source} · {resource.subject}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {message && (
        <p className={`mt-4 rounded-lg p-3 text-sm ${
          messageIsError ? 'bg-rose-50 text-rose-800' : 'bg-blue-50 text-blue-800'
        }`}>
          {message}
        </p>
      )}
    </section>
  );
}
