import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apparatus } from '../../data/apparatus';
import type { ApparatusVisual } from '../../data/apparatusCatalog';
import { getRequiredApparatus } from '../../data/experiments';
import ApparatusIllustration from './ApparatusIllustration';

type ApparatusPreviewProps = {
  slug: string;
  title?: string;
  limit?: number;
  compact?: boolean;
};

export default function ApparatusPreview({ slug, title = 'Apparatus for this practical', limit = 6, compact = false }: ApparatusPreviewProps) {
  const items = useMemo(() => getRequiredApparatus(slug).slice(0, limit), [limit, slug]);
  const byId = useMemo(() => new Map(apparatus.map((item) => [item.id, item])), []);
  const resolved = items.map((item) => byId.get(item.id) ?? item);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title} <span className="text-slate-400">({items.length})</span>
        </p>
        {compact ? null : (
          <Link
            to={`/experiments/${slug}?setup=1`}
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
          >
            Set up apparatus →
          </Link>
        )}
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {resolved.map((item) => (
          <li
            key={item.id}
            title={item.name}
            className="flex items-center gap-1 rounded-lg border border-white bg-white px-1.5 py-1 shadow-sm"
          >
            {item.svg.trim().startsWith('<svg') ? (
              <span className="inline-flex h-8 w-8 items-center justify-center" aria-hidden="true" dangerouslySetInnerHTML={{ __html: item.svg }} />
            ) : (
              <ApparatusIllustration visual={item.svg as ApparatusVisual} className="h-8 w-8" title={item.name} />
            )}
            <span className="max-w-24 truncate text-[10px] font-medium text-slate-600">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
