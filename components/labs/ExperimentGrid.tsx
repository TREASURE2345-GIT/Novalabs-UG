import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';

type ExperimentGridProps = {
  children: ReactNode;
  minColumnWidth?: number;
};

export default function ExperimentGrid({ children, minColumnWidth = 280 }: ExperimentGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const available = element.clientWidth;
      const next = Math.max(1, Math.floor((available + gap) / (minColumnWidth + gap)));
      setColumns(Math.min(next, items.length || 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length, minColumnWidth]);

  const remainder = items.length % columns;
  const baseSpan = remainder ? Math.floor(columns / remainder) : 1;
  const extraSpan = remainder ? columns % remainder : 0;

  return (
    <div
      ref={ref}
      className="grid gap-5"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}px, 100%), 1fr))` }}
    >
      {items.map((item, index) => {
        if (!isValidElement(item)) return item;
        const isLastRow = remainder > 0 && index >= items.length - remainder;
        const position = index - (items.length - remainder);
        const span = isLastRow ? baseSpan + (position < extraSpan ? 1 : 0) : 1;
        return cloneElement(item as ReactElement<{ style?: CSSProperties }>, {
          style: { ...(item.props as { style?: CSSProperties }).style, gridColumn: span > 1 ? `span ${span}` : undefined },
        });
      })}
    </div>
  );
}
