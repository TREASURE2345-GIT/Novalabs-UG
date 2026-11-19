import { useState } from 'react';
import type { CheckpointQuestion } from '../../data/checkpointQuestions';

type CheckpointCardProps = {
  question: CheckpointQuestion;
  answered?: boolean;
  onAnswered: (correct: boolean) => void;
};

export default function CheckpointCard({ question, answered = false, onAnswered }: CheckpointCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const resolved = selected !== null;
  const isCorrect = selected === question.correctIndex;

  const choose = (index: number) => {
    if (resolved || answered) return;
    setSelected(index);
    onAnswered(index === question.correctIndex);
  };

  return (
    <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">?</span>
        Checkpoint
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{question.prompt}</p>

      {answered && !resolved ? (
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-indigo-800">
          Checkpoint already answered. Review the explanation below.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {question.options.map((option, index) => {
            const chosen = selected === index;
            const showCorrect = (resolved || answered) && index === question.correctIndex;
            const showWrong = resolved && chosen && index !== question.correctIndex;
            return (
              <button
                key={`${question.id}-${index}`}
                type="button"
                onClick={() => choose(index)}
                disabled={resolved || answered}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  showCorrect
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : showWrong
                      ? 'border-rose-400 bg-rose-50 text-rose-900'
                      : chosen
                        ? 'border-indigo-400 bg-white text-slate-900'
                        : 'border-indigo-200 bg-white text-slate-700 hover:border-indigo-400'
                } disabled:cursor-default`}
              >
                <span className="mr-2 font-bold text-indigo-500">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      )}

      {(resolved || answered) && (
        <div className={`mt-3 rounded-lg px-3 py-2 text-xs leading-5 ${
          resolved && !isCorrect ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
        }`}>
          <p className="font-bold">
            {resolved ? (isCorrect ? 'Correct.' : 'Not quite.') : 'Previously answered.'}
          </p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
