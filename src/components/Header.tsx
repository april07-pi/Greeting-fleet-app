import { Download } from 'lucide-react';

interface HeaderProps {
  onDownloadPy: () => void;
  onSelectDeckTab: (tab: 'code' | 'tree' | 'requirements') => void;
}

export function Header({ onDownloadPy, onSelectDeckTab }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#live-stage"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
        >
          Flet Greeting Studio
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#live-stage"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Live App
          </a>
          <a
            href="#inspector-deck"
            onClick={() => onSelectDeckTab('code')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Python Code
          </a>
          <a
            href="#inspector-deck"
            onClick={() => onSelectDeckTab('tree')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Widget Tree
          </a>
          <a
            href="#submission-guide"
            onClick={() => onSelectDeckTab('requirements')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Deliverables
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onDownloadPy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Download .py</span>
          </button>
        </div>
      </div>
    </header>
  );
}
