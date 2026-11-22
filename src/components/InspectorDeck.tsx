import { Check, Copy, Download, Terminal } from 'lucide-react';
import { useState } from 'react';
import {
  ASSIGNMENT_REQUIREMENTS,
  buildPythonSource,
  type ActiveTracePhase,
  type FletSyntaxMode,
} from '../data/greetingAppCode';

export type DeckTab = 'code' | 'tree' | 'requirements';

interface InspectorDeckProps {
  activeTab: DeckTab;
  onTabChange: (tab: DeckTab) => void;
  syntaxMode: FletSyntaxMode;
  onSyntaxModeChange: (mode: FletSyntaxMode) => void;
  includeEmptyGuard: boolean;
  onToggleEmptyGuard: (enabled: boolean) => void;
  inputName: string;
  displayedGreeting: string;
  tracePhase: ActiveTracePhase;
  hasTypedName: boolean;
  hasClickedGreet: boolean;
  onDownloadPy: () => void;
}

export function InspectorDeck({
  activeTab,
  onTabChange,
  syntaxMode,
  onSyntaxModeChange,
  includeEmptyGuard,
  onToggleEmptyGuard,
  inputName,
  displayedGreeting,
  tracePhase,
  hasTypedName,
  hasClickedGreet,
  onDownloadPy,
}: InspectorDeckProps) {
  const [copied, setCopied] = useState(false);

  const pythonSource = buildPythonSource(syntaxMode, includeEmptyGuard);
  const lines = pythonSource.trimEnd().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pythonSource);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const isLineHighlighted = (lineText: string): boolean => {
    if (tracePhase === 'typing') {
      return lineText.includes('name_field = ft.TextField') || lineText.includes('label="Enter your name"');
    }
    if (tracePhase === 'click' || tracePhase === 'updated') {
      return (
        lineText.includes('def greet_clicked') ||
        lineText.includes('greeting_text.value') ||
        lineText.includes('page.update()')
      );
    }
    return false;
  };

  const requirementStatus: Record<string, boolean> = {
    textfield: true,
    button: true,
    column: true,
    'text-update': hasTypedName && hasClickedGreet && displayedGreeting.startsWith('Hello, '),
    'page-update': hasClickedGreet,
  };

  return (
    <aside
      id="inspector-deck"
      aria-label="Python Code and Control Inspector"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
    >
      {/* Segmented Control Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Inspector views"
          className="flex items-center p-0.5 bg-slate-200/70 rounded-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'code'}
            onClick={() => onTabChange('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            greeting_app.py
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tree'}
            onClick={() => onTabChange('tree')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Widget Tree
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'requirements'}
            onClick={() => onTabChange('requirements')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requirements
          </button>
        </div>

        {activeTab === 'code' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tab Panel 1: Python Source Code */}
      {activeTab === 'code' && (
        <div className="flex flex-col flex-1">
          {/* Code Options Row */}
          <div className="px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-white">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Entrypoint:</span>
              <div className="flex items-center p-0.5 bg-slate-100 rounded-md">
                <button
                  type="button"
                  onClick={() => onSyntaxModeChange('classic')}
                  className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    syntaxMode === 'classic'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ft.app(main)
                </button>
                <button
                  type="button"
                  onClick={() => onSyntaxModeChange('modern')}
                  className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    syntaxMode === 'modern'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ft.run(main)
                </button>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeEmptyGuard}
                onChange={(e) => onToggleEmptyGuard(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>Trim empty input</span>
            </label>
          </div>

          {/* Code Viewer */}
          <div className="bg-[#0F172A] text-slate-100 overflow-x-auto flex-1 py-3 px-2 font-mono text-[12.5px] leading-6">
            <pre className="m-0">
              <code>
                {lines.map((line, index) => {
                  const highlighted = isLineHighlighted(line);
                  return (
                    <div
                      key={index}
                      className={`flex px-2 rounded transition-colors duration-150 ${
                        highlighted ? 'bg-sky-500/20' : ''
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 text-slate-500 select-none tabular-nums">
                        {index + 1}
                      </span>
                      <span className="whitespace-pre text-slate-100">
                        {line || ' '}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {tracePhase === 'typing'
                ? 'Active: TextField receives input value'
                : tracePhase === 'updated'
                  ? 'Active: on_click updates Text and calls page.update()'
                  : 'Interact with the app to trace lines'}
            </span>
            <button
              type="button"
              onClick={onDownloadPy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Save greeting_app.py</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Panel 2: Live Flet Widget Tree */}
      {activeTab === 'tree' && (
        <div className="p-5 flex-1 flex flex-col gap-5 text-sm">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Control Hierarchy & Live Values
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Values update below as you type into the TextField and trigger page.update().
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 font-mono text-xs">
            <div className="p-3 bg-slate-50 flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900">ft.Page</span>
              <span className="text-slate-500">title="Greeting App"</span>
            </div>

            <div className="p-3 pl-6 flex items-center justify-between gap-3">
              <span className="font-semibold text-sky-700">└─ ft.Column</span>
              <span className="text-slate-500">spacing=16 · alignment=CENTER</span>
            </div>

            <div className="p-3 pl-10 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">├─ ft.TextField</span>
              <span className="text-slate-700 truncate max-w-[180px]">
                value="{inputName}"
              </span>
            </div>

            <div className="p-3 pl-10 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">├─ ft.ElevatedButton</span>
              <span className="text-slate-500">text="Greet Me"</span>
            </div>

            <div className="p-3 pl-10 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">└─ ft.Text</span>
              <span
                className={`truncate max-w-[180px] ${
                  displayedGreeting ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                }`}
              >
                value="{displayedGreeting}"
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
            <h4 className="text-xs font-semibold text-slate-900">
              Why page.update() is required
            </h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Modifying <code className="text-slate-900">greeting_text.value</code> only changes the Python object in memory. Calling <code className="text-slate-900">page.update()</code> sends the changed control state to the Flet UI client immediately.
            </p>
          </div>
        </div>
      )}

      {/* Tab Panel 3: Assignment Requirements & Local Run */}
      {activeTab === 'requirements' && (
        <div className="p-5 flex-1 flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Activity Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter a name and click "Greet Me" in the stage to verify runtime behavior.
            </p>
          </div>

          <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {ASSIGNMENT_REQUIREMENTS.map((item) => {
              const verified = requirementStatus[item.id];
              return (
                <li key={item.id} className="p-3.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.detail}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap shrink-0 ${
                      verified ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {verified ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <span>Test in app</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="p-4 rounded-lg bg-[#0F172A] text-slate-100 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-sans font-semibold">
              <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>Run Locally in Python</span>
            </div>
            <div className="text-slate-300">pip install flet</div>
            <div className="text-sky-300">python greeting_app.py</div>
          </div>
        </div>
      )}
    </aside>
  );
}
