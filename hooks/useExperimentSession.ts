import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  Apparatus,
  ApparatusCheckResult,
  ApparatusEvent,
  PlacedApparatus,
} from '../types/apparatus';
import { validateApparatusSetup } from '../services/apparatusValidator';
import { getProgress, setProgress } from '../services/progressService';
import { isBackendEnabled, saveStudentProgress } from '../services/backendService';

type UseExperimentSessionOptions = {
  experimentId: string;
  required: Apparatus[];
  distractors?: Apparatus[];
  apparatusById: Map<string, Apparatus>;
  userId?: string | null;
};

type StoredSession = {
  placed?: PlacedApparatus[];
  worn?: string[];
  events?: ApparatusEvent[];
};

function makeInstanceId(): string {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function readStored(experimentId: string, userId?: string | null): StoredSession {
  const stored = getProgress(experimentId, userId) as (StoredSession & Record<string, unknown>) | null;
  if (!stored) return {};
  return {
    placed: Array.isArray(stored.placed) ? stored.placed : [],
    worn: Array.isArray(stored.worn) ? stored.worn.filter((id): id is string => typeof id === 'string') : [],
    events: Array.isArray(stored.events) ? stored.events : [],
  };
}

export function useExperimentSession({
  experimentId,
  required,
  distractors = [],
  apparatusById,
  userId,
}: UseExperimentSessionOptions) {
  const stored = useRef(readStored(experimentId, userId)).current;
  const [placed, setPlaced] = useState<PlacedApparatus[]>(stored.placed ?? []);
  const [worn, setWorn] = useState<string[]>(stored.worn ?? []);
  const [events, setEvents] = useState<ApparatusEvent[]>(stored.events ?? []);
  const [check, setCheck] = useState<ApparatusCheckResult | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastMessage, setLastMessage] = useState('Drag apparatus onto the bench, or use the Add button.');
  const startedAt = useRef(Date.now());
  const isFirst = useRef(true);

  const record = useCallback((event: Omit<ApparatusEvent, 'timestamp'>) => {
    setEvents((current) => [...current, { ...event, timestamp: Date.now() }]);
  }, []);

  const place = useCallback(
    (apparatusId: string, x = 50, y = 50) => {
      const item = apparatusById.get(apparatusId);
      if (!item) return;
      if (placed.some((entry) => entry.apparatusId === apparatusId)) {
        setLastMessage(`${item.name} is already on the bench.`);
        return;
      }
      setPlaced((current) => [
        ...current,
        { instanceId: makeInstanceId(), apparatusId, x, y, rotation: 0 },
      ]);
      setCheck(null);
      setLastMessage(`${item.name} placed on the bench.`);
      record({ action: 'place', apparatusId, value: `${Math.round(x)},${Math.round(y)}` });
    },
    [apparatusById, placed, record],
  );

  const remove = useCallback(
    (instanceId: string) => {
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (target) {
        record({ action: 'remove', apparatusId: target.apparatusId });
        setLastMessage(`${apparatusById.get(target.apparatusId)?.name ?? 'Apparatus'} returned to the cabinet.`);
      }
      setPlaced((current) => current.filter((entry) => entry.instanceId !== instanceId));
      setCheck(null);
    },
    [apparatusById, placed, record],
  );

  const move = useCallback(
    (instanceId: string, x: number, y: number) => {
      setPlaced((current) =>
        current.map((entry) => (entry.instanceId === instanceId ? { ...entry, x, y } : entry)),
      );
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (target) record({ action: 'rearrange', apparatusId: target.apparatusId, value: `${Math.round(x)},${Math.round(y)}` });
    },
    [placed, record],
  );

  const rotate = useCallback(
    (instanceId: string) => {
      setPlaced((current) =>
        current.map((entry) =>
          entry.instanceId === instanceId ? { ...entry, rotation: (entry.rotation + 15) % 360 } : entry,
        ),
      );
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (target) record({ action: 'rotate', apparatusId: target.apparatusId });
    },
    [placed, record],
  );

  const setValue = useCallback(
    (instanceId: string, value: number) => {
      setPlaced((current) =>
        current.map((entry) => (entry.instanceId === instanceId ? { ...entry, value } : entry)),
      );
      setCheck(null);
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (target) record({ action: 'fill', apparatusId: target.apparatusId, value });
    },
    [placed, record],
  );

  const setHeated = useCallback(
    (instanceId: string, heated: boolean) => {
      setPlaced((current) =>
        current.map((entry) => (entry.instanceId === instanceId ? { ...entry, heated } : entry)),
      );
      setCheck(null);
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (target) record({ action: heated ? 'ignite' : 'extinguish', apparatusId: target.apparatusId });
      if (heated && !worn.includes('safety-goggles')) {
        setLastMessage('Safety warning: put on goggles before heating apparatus.');
      }
    },
    [placed, record, worn],
  );

  const use = useCallback(
    (instanceId: string) => {
      const target = placed.find((entry) => entry.instanceId === instanceId);
      if (!target) return;
      const item = apparatusById.get(target.apparatusId);
      record({ action: item?.interaction === 'microscope' ? 'focus' : 'dispense', apparatusId: target.apparatusId });
      setLastMessage(`${item?.name ?? 'Apparatus'} used. Record the observation in your evidence.`);
    },
    [apparatusById, placed, record],
  );

  const wear = useCallback(
    (apparatusId: string) => {
      const item = apparatusById.get(apparatusId);
      if (!item) return;
      setCheck(null);
      setWorn((current) => {
        const next = current.includes(apparatusId)
          ? current.filter((id) => id !== apparatusId)
          : [...current, apparatusId];
        setLastMessage(
          next.includes(apparatusId) ? `${item.name} put on.` : `${item.name} removed.`,
        );
        return next;
      });
      record({ action: 'wear', apparatusId });
    },
    [apparatusById, record],
  );

  const runCheck = useCallback(() => {
    const result = validateApparatusSetup({ required, distractors, placed, worn, apparatusById });
    setCheck(result);
    setLastMessage(result.messages[0] ?? '');
    record({ action: 'check', apparatusId: 'bench', value: result.score });
    if (result.ok && isBackendEnabled) {
      void saveStudentProgress(experimentId, {
        score: result.score,
        status: 'in_progress',
        data: {
          apparatusPlaced: placed.map((entry) => entry.apparatusId),
          worn,
          apparatusScore: result.score,
        },
      }).catch(() => undefined);
    }
    return result;
  }, [apparatusById, distractors, experimentId, placed, record, required, worn]);

  const autoSetup = useCallback(() => {
    const safetyIds = Array.from(apparatusById.values())
      .filter((item) => item.category === 'safety')
      .map((item) => item.id);
    const columns = Math.max(1, Math.min(5, Math.ceil(Math.sqrt(required.length))));
    const rows = Math.max(1, Math.ceil(required.length / columns));
    const nextPlaced: PlacedApparatus[] = required.map((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const capacity = item.capacity;
      const midpoint = capacity
        ? capacity.correctRange
          ? (capacity.correctRange[0] + capacity.correctRange[1]) / 2
          : capacity.max / 2
        : undefined;
      const step = capacity?.step ?? 1;
      return {
        instanceId: makeInstanceId(),
        apparatusId: item.id,
        x: 12 + ((column + 0.5) / columns) * 76,
        y: 18 + ((row + 0.5) / rows) * 64,
        rotation: 0,
        value:
          capacity && midpoint !== undefined
            ? Math.min(capacity.max, Math.round(midpoint / step) * step)
            : undefined,
      };
    });
    const nextWorn = safetyIds;
    const result = validateApparatusSetup({
      required,
      distractors,
      placed: nextPlaced,
      worn: nextWorn,
      apparatusById,
    });
    const timestamp = Date.now();
    const setupEvents: ApparatusEvent[] = [
      ...nextPlaced.map((entry) => ({
        action: 'place' as const,
        apparatusId: entry.apparatusId,
        timestamp,
        value: `${Math.round(entry.x)},${Math.round(entry.y)}`,
      })),
      ...nextWorn.map((apparatusId) => ({
        action: 'wear' as const,
        apparatusId,
        timestamp,
      })),
      { action: 'check' as const, apparatusId: 'bench', timestamp, value: result.score },
    ];

    setPlaced(nextPlaced);
    setWorn(nextWorn);
    setEvents((current) => [...current, ...setupEvents]);
    setCheck(result);
    setLastMessage(
      result.ok
        ? 'Apparatus set up safely. You can now run the experiment.'
        : result.messages[0] ?? 'Apparatus placed. Check the setup feedback.',
    );
    if (result.ok && isBackendEnabled) {
      void saveStudentProgress(experimentId, {
        score: result.score,
        status: 'in_progress',
        data: {
          apparatusPlaced: nextPlaced.map((entry) => entry.apparatusId),
          worn: nextWorn,
          apparatusScore: result.score,
        },
      }).catch(() => undefined);
    }
    return result;
  }, [apparatusById, distractors, experimentId, required]);

  const reset = useCallback(() => {
    setPlaced([]);
    setWorn([]);
    setEvents([]);
    setCheck(null);
    setHintsUsed(0);
    setLastMessage('Bench cleared. Rebuild the apparatus setup.');
    record({ action: 'reset', apparatusId: 'bench' });
  }, [record]);

  const hint = useCallback(() => {
    const missing = required.filter(
      (item) => !placed.some((entry) => entry.apparatusId === item.id),
    );
    setHintsUsed((count) => count + 1);
    setLastMessage(
      missing.length > 0
        ? `Hint: you still need ${missing.slice(0, 3).map((item) => item.name).join(', ')}.`
        : 'Hint: check that you are wearing goggles, a lab coat and gloves, and that no extra apparatus is on the bench.',
    );
    record({ action: 'hint', apparatusId: 'bench' });
  }, [placed, record, required]);

  const usedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const event of events) {
      if (['dispense', 'heat', 'ignite', 'focus', 'wear'].includes(event.action)) {
        ids.add(event.apparatusId);
      }
    }
    return Array.from(ids);
  }, [events]);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setProgress(
      experimentId,
      {
        apparatusPlaced: placed.map((entry) => entry.apparatusId),
        placed,
        worn,
        events,
        apparatusScore: check?.score,
        practicalComplete: check?.ok ?? false,
      },
      userId,
    );
  }, [check, events, experimentId, placed, userId, worn]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setProgress(
        experimentId,
        {
          apparatusPlaced: placed.map((entry) => entry.apparatusId),
          placed,
          worn,
          events,
          apparatusScore: check?.score,
          timeSpent: Math.round((Date.now() - startedAt.current) / 1000),
        },
        userId,
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [check, events, experimentId, placed, userId, worn]);

  return {
    placed,
    worn,
    events,
    usedIds,
    check,
    hintsUsed,
    lastMessage,
    place,
    remove,
    move,
    rotate,
    setValue,
    setHeated,
    use,
    wear,
    checkSetup: runCheck,
    autoSetup,
    reset,
    hint,
  };
}

export type ExperimentSession = ReturnType<typeof useExperimentSession>;
