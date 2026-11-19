import type { ReactNode } from 'react';
import type { Subject } from '../../types';

type SubjectStyle = {
  label: string;
  tile: string;
  glyph: ReactNode;
};

const subjectStyles: Record<Subject, SubjectStyle> = {
  biology: {
    label: 'Biology',
    tile: 'from-emerald-400 to-green-600',
    glyph: (
      <>
        <path d="M8 3c0 5.5 8 7.5 8 18" />
        <path d="M16 3c0 5.5-8 7.5-8 18" />
        <path d="M9.2 7.2h5.6M9.2 12h5.6M9.2 16.8h5.6" />
      </>
    ),
  },
  chemistry: {
    label: 'Chemistry',
    tile: 'from-violet-400 to-fuchsia-600',
    glyph: (
      <>
        <path d="M9.5 3h5" />
        <path d="M10.5 3v6.2L5.6 18.3A2.4 2.4 0 0 0 7.7 22h8.6a2.4 2.4 0 0 0 2.1-3.7L13.5 9.2V3" />
        <path d="M8.3 15.6h7.4" />
        <circle cx="10.8" cy="18.2" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="13.8" cy="19.3" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  physics: {
    label: 'Physics',
    tile: 'from-amber-400 to-orange-500',
    glyph: (
      <>
        <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
      </>
    ),
  },
  agriculture: {
    label: 'Agriculture',
    tile: 'from-lime-400 to-green-500',
    glyph: (
      <>
        <path d="M12 21v-7" />
        <path d="M12 14c-4 0-6-2-6-5 4 0 6 2 6 5z" />
        <path d="M12 14c4 0 6-2 6-5-4 0-6 2-6 5z" />
        <path d="M8 21h8" />
      </>
    ),
  },
};

type SubjectIconProps = {
  subject: Subject;
  className?: string;
  title?: string;
};

export default function SubjectIcon({ subject, className = 'h-10 w-10', title }: SubjectIconProps) {
  const style = subjectStyles[subject];

  return (
    <span
      role="img"
      aria-label={title ?? style.label}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${style.tile} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-1/2 w-1/2"
        aria-hidden="true"
      >
        {style.glyph}
      </svg>
    </span>
  );
}
