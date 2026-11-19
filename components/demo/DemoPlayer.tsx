import { useLayoutEffect, useRef, useState } from 'react';
import DemoStage from './DemoStage';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

type DemoPlayerProps = {
  hideStartGate?: boolean;
};

export default function DemoPlayer({ hideStartGate = false }: DemoPlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const { width, height } = frame.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setScale(Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT));
      }
    };

    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(frame);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden bg-[#040b14]">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <DemoStage embedded hideStartGate={hideStartGate} />
      </div>
    </div>
  );
}
