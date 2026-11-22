import { Camera, Columns3, Monitor, Moon, RotateCcw, Smartphone, Sun } from 'lucide-react';
import { useState } from 'react';
import type { ActiveTracePhase } from '../data/greetingAppCode';

interface FletWindowSimulatorProps {
  inputName: string;
  displayedGreeting: string;
  updateCount: number;
  lastEventLabel: string;
  tracePhase: ActiveTracePhase;
  fletTheme: 'light' | 'dark';
  fletViewport: 'desktop' | 'mobile';
  onInputChange: (value: string) => void;
  onGreetClick: () => void;
  onReset: () => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
  onCaptureScreenshot: () => void;
  screenshotSavedMessage: string | null;
}

export function FletWindowSimulator({
  inputName,
  displayedGreeting,
  updateCount,
  lastEventLabel,
  tracePhase,
  fletTheme,
  fletViewport,
  onInputChange,
  onGreetClick,
  onReset,
  onThemeChange,
  onViewportChange,
  onCaptureScreenshot,
  screenshotSavedMessage,
}: FletWindowSimulatorProps) {
  const [showLayoutGuides, setShowLayoutGuides] = useState(false);
  const [isFieldFocused, setIsFieldFocused] = useState(false);

  const isDark = fletTheme === 'dark';
  const isMobile = fletViewport === 'mobile';
  const isFloating = isFieldFocused || inputName.length > 0;

  return (
    <section
      id="live-stage"
      aria-label="Interactive Flet App Stage"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
    >
      {/* Stage Controls Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            Running Flet Window
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
            greeting_app.py
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Viewport segmented toggle */}
          <div
            role="group"
            aria-label="Flet viewport size"
            className="flex items-center p-0.5 bg-slate-200/70 rounded-lg"
          >
            <button
              type="button"
              onClick={() => onViewportChange('desktop')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isMobile
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('mobile')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isMobile
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Flet App Theme toggle */}
          <div
            role="group"
            aria-label="Flet window theme"
            className="flex items-center p-0.5 bg-slate-200/70 rounded-lg"
          >
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              aria-label="Light Flet theme"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isDark
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              aria-label="Dark Flet theme"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dark</span>
            </button>
          </div>

          {/* Column Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowLayoutGuides((prev) => !prev)}
            aria-pressed={showLayoutGuides}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showLayoutGuides
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Column Bounds</span>
          </button>
        </div>
      </div>

      {/* Interactive Stage Canvas */}
      <div className="p-6 sm:p-8 bg-slate-100/80 flex items-center justify-center min-h-[430px]">
        <div
          className={`transition-[max-width] duration-200 ease-out w-full rounded-xl overflow-hidden border shadow-sm ${
            isMobile ? 'max-w-[360px]' : 'max-w-[660px]'
          } ${
            isDark
              ? 'bg-[#0F172A] border-slate-700 text-slate-50'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* OS / Flet Window Title Bar */}
          <div
            className={`h-10 px-4 flex items-center justify-between border-b ${
              isDark
                ? 'bg-slate-800/90 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span
              className={`text-xs font-semibold tracking-tight ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              Greeting App
            </span>
            <span
              className={`text-[11px] font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Flet
            </span>
          </div>

          {/* Flet Page Body */}
          <div className="p-8 min-h-[340px] flex flex-col items-center justify-center">
            {/* ft.Column */}
            <div
              className={`relative flex flex-col items-center justify-center gap-4 w-full max-w-[340px] transition-colors ${
                showLayoutGuides
                  ? isDark
                    ? 'p-5 border border-dashed border-sky-400/70 rounded-lg bg-sky-950/20'
                    : 'p-5 border border-dashed border-sky-500/70 rounded-lg bg-sky-50/50'
                  : ''
              }`}
            >
              {showLayoutGuides && (
                <span
                  className={`self-start text-[11px] font-mono ${
                    isDark ? 'text-sky-300' : 'text-sky-700'
                  }`}
                >
                  ft.Column(spacing=16)
                </span>
              )}

              {/* ft.TextField */}
              <div className="relative w-full">
                <label
                  htmlFor="flet-name-textfield"
                  className={`absolute left-3.5 px-1.5 text-xs font-medium pointer-events-none transition-all duration-150 ${
                    isFloating
                      ? `-top-2 ${
                          isDark ? 'bg-[#0F172A]' : 'bg-white'
                        } ${isFieldFocused ? 'text-sky-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`
                      : `top-3.5 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`
                  }`}
                >
                  Enter your name
                </label>
                <input
                  id="flet-name-textfield"
                  type="text"
                  value={inputName}
                  onFocus={() => setIsFieldFocused(true)}
                  onBlur={() => setIsFieldFocused(false)}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onGreetClick();
                    }
                  }}
                  placeholder={isFieldFocused ? 'e.g. Kwazi' : ''}
                  className={`w-full h-12 px-4 rounded-lg border text-base outline-none transition-colors ${
                    isFieldFocused
                      ? 'border-2 border-sky-600'
                      : isDark
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-slate-300 hover:border-slate-400'
                  } ${
                    isDark
                      ? 'bg-[#0F172A] text-slate-50 placeholder:text-slate-500'
                      : 'bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* ft.ElevatedButton */}
              <button
                type="button"
                onClick={onGreetClick}
                className={`min-h-[42px] px-6 py-2.5 rounded-full text-sm font-semibold tracking-tight transition-all duration-150 active:scale-[0.97] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isDark
                    ? 'bg-slate-800 text-sky-300 border border-slate-700 shadow-md hover:bg-slate-700'
                    : 'bg-slate-50 text-sky-700 border border-slate-200 shadow-sm hover:bg-sky-50 hover:border-sky-200'
                }`}
              >
                Greet Me
              </button>

              {/* ft.Text */}
              <div className="min-h-[36px] flex items-center justify-center w-full pt-1">
                {displayedGreeting ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`text-2xl font-semibold text-center break-words transition-opacity duration-150 ${
                      isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}
                  >
                    {displayedGreeting}
                  </p>
                ) : (
                  <p
                    className={`text-xs font-mono ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {showLayoutGuides
                      ? 'ft.Text(value="") — waiting for page.update()'
                      : 'Click "Greet Me" to invoke page.update()'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Execution State & Screenshot Bar */}
      <div className="px-5 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">page.update() calls:</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {updateCount}
            </span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Last event:</span>
            <span
              className={`font-mono font-medium ${
                tracePhase === 'updated' || tracePhase === 'click'
                  ? 'text-emerald-700'
                  : 'text-slate-700'
              }`}
            >
              {lastEventLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {screenshotSavedMessage && (
            <span className="text-xs font-medium text-emerald-700" role="status">
              {screenshotSavedMessage}
            </span>
          )}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onCaptureScreenshot}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Capture Screenshot (PNG)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
