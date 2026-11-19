import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export type DragPayload = {
  apparatusId: string;
  instanceId?: string;
};

export type DropPosition = {
  zone: 'bench' | 'cabinet';
  x: number;
  y: number;
};

type UseDragDropOptions = {
  onDrop: (payload: DragPayload, position: DropPosition) => void;
  onCancel?: () => void;
};

type DragState = {
  payload: DragPayload;
  x: number;
  y: number;
  pointerId: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function useDragDrop({ onDrop, onCancel }: UseDragDropOptions) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const onDropRef = useRef(onDrop);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onDropRef.current = onDrop;
    onCancelRef.current = onCancel;
  }, [onDrop, onCancel]);

  const finish = useCallback((event: PointerEvent) => {
    const active = dragRef.current;
    if (!active || event.pointerId !== active.pointerId) return;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const zoneElement = element?.closest<HTMLElement>('[data-dropzone]');
    const zone = zoneElement?.dataset.dropzone;
    if (zone === 'bench' && zoneElement) {
      const rect = zoneElement.getBoundingClientRect();
      onDropRef.current(active.payload, {
        zone: 'bench',
        x: clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 96),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100, 8, 92),
      });
    } else if (zone === 'cabinet') {
      onDropRef.current(active.payload, { zone: 'cabinet', x: 0, y: 0 });
    } else {
      onCancelRef.current?.();
    }
    dragRef.current = null;
    setDrag(null);
  }, []);

  const cancel = useCallback(() => {
    dragRef.current = null;
    setDrag(null);
    onCancelRef.current?.();
  }, []);

  useEffect(() => {
    if (!drag) return;
    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return;
      const next = { ...dragRef.current, x: event.clientX, y: event.clientY };
      dragRef.current = next;
      setDrag(next);
    };
    const handleUp = (event: PointerEvent) => finish(event);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancel();
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('keydown', handleKey);
    };
  }, [cancel, drag, finish]);

  const startDrag = useCallback((payload: DragPayload, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const state: DragState = {
      payload,
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    dragRef.current = state;
    setDrag(state);
  }, []);

  return { drag, startDrag, cancel };
}
