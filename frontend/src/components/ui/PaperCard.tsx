import { ExternalLink, FileText, Users, Calendar, Quote, CheckSquare, Square, BookmarkPlus } from 'lucide-react';
import { clsx } from 'clsx';
import type { Paper } from '../../types';
import { Badge } from './Badge';
import { useApp } from '../../context/AppContext';

interface PaperCardProps {
  paper: Paper;
  onSave?: (paper: Paper) => void;
  showSelect?: boolean;
}

const sourceColors: Record<string, 'blue' | 'purple' | 'green' | 'info'> = {
  arxiv: 'blue',
  'semantic scholar': 'purple',
  openalex: 'green',
  crossref: 'info',
};

export function PaperCard({ paper, onSave, showSelect = true }: PaperCardProps) {
  const { togglePaperSelection, isPaperSelected } = useApp();
  const selected = isPaperSelected(paper.id);

  const sourceKey = paper.source.toLowerCase();
  const badgeVariant = (sourceColors[sourceKey] as 'blue' | 'purple' | 'green' | 'info') || 'default';

  return (
    <div
      className={clsx(
        'bg-white dark:bg-navy-900 rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md',
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-gray-200 dark:border-navy-700'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
            {paper.title}
          </h3>
        </div>
        {showSelect && (
          <button
            onClick={() => togglePaperSelection(paper)}
            className="flex-shrink-0 mt-0.5"
            title={selected ? 'Deselect paper' : 'Select for analysis'}
          >
            {selected ? (
              <CheckSquare className="h-5 w-5 text-blue-500" />
            ) : (
              <Square className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
            )}
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {paper.year}
        </span>
        {paper.citations !== undefined && (
          <span className="flex items-center gap-1">
            <Quote className="h-3.5 w-3.5" />
            {paper.citations} citations
          </span>
        )}
        <Badge variant={badgeVariant as 'blue' | 'purple' | 'green' | 'info'}>{paper.source}</Badge>
      </div>

      {/* Abstract */}
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 leading-relaxed">
        {paper.abstract}
      </p>

      {/* Keywords */}
      {paper.keywords && paper.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {paper.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 rounded-full text-xs"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-navy-800">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </a>
        )}
        {paper.pdf_url && (
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            <FileText className="h-3.5 w-3.5" />
            PDF
          </a>
        )}
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:underline"
          >
            DOI
          </a>
        )}
        {onSave && (
          <button
            onClick={() => onSave(paper)}
            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            Save
          </button>
        )}
      </div>
    </div>
  );
}
