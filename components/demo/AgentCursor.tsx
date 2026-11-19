import { useLayoutEffect, useState } from 'react';

type AgentCursorProps = {
  target: string | null;
  clicking: boolean;
};

export default function AgentCursor({ target, clicking }: AgentCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  useLayoutEffect(() => {
    if (!target) {
      setPosition((current) => ({ ...current, visible: false }));
      return;
    }

    const element = document.querySelector<HTMLElement>(`[data-agent-target="${target}"]`);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      visible: true,
    });
  }, [target]);

  return (
    <div
      className="pointer-events-none fixed z-[60]"
      style={{
        left: position.x,
        top: position.y,
        opacity: position.visible ? 1 : 0,
        transition:
          'left 700ms cubic-bezier(0.22, 1, 0.36, 1), top 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease',
      }}
    >
      <div className="relative -translate-x-2 -translate-y-1">
        <svg
          width="30"
          height="34"
          viewBox="0 0 30 34"
          fill="none"
          className="drop-shadow-[0_0_12px_rgba(34,211,238,0.65)]"
          aria-hidden="true"
        >
          <path
            d="M3 2L26 16L15.5 18.5L10.5 30L3 2Z"
            fill="#f8fafc"
            stroke="#0e7490"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="ml-4 mt-1 rounded-full border border-cyan-300/50 bg-cyan-300 px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.6)]">
          NOVA
        </div>
        <span
          className={`absolute left-1 top-1 h-6 w-6 rounded-full border border-cyan-200/70 transition-transform duration-150 ${
            clicking ? 'scale-150' : 'scale-75'
          }`}
        />
        {clicking && (
          <span className="absolute left-1 top-1 h-10 w-10 animate-ping rounded-full border-2 border-cyan-300/80" />
        )}
      </div>
    </div>
  );
}
