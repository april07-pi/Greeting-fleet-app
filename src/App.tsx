import { Camera, Download } from 'lucide-react';
import { useState } from 'react';
import { FletWindowSimulator } from './components/FletWindowSimulator';
import { Header } from './components/Header';
import { InspectorDeck, type DeckTab } from './components/InspectorDeck';
import {
  buildPythonSource,
  type ActiveTracePhase,
  type FletSyntaxMode,
} from './data/greetingAppCode';
import {
  downloadDataUrl,
  downloadTextFile,
  renderFletScreenshot,
} from './utils/screenshotRenderer';

const SAMPLE_NAMES = ['Kwazi', 'Lerato', 'Sipho'];

export default function App() {
  const [inputName, setInputName] = useState('Kwazi');
  const [displayedGreeting, setDisplayedGreeting] = useState('Hello, Kwazi!');
  const [updateCount, setUpdateCount] = useState(1);
  const [lastEventLabel, setLastEventLabel] = useState('on_click -> page.update()');
  const [tracePhase, setTracePhase] = useState<ActiveTracePhase>('updated');
  const [hasTypedName, setHasTypedName] = useState(true);
  const [hasClickedGreet, setHasClickedGreet] = useState(true);

  const [fletTheme, setFletTheme] = useState<'light' | 'dark'>('light');
  const [fletViewport, setFletViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [deckTab, setDeckTab] = useState<DeckTab>('code');
  const [syntaxMode, setSyntaxMode] = useState<FletSyntaxMode>('classic');
  const [includeEmptyGuard, setIncludeEmptyGuard] = useState(true);

  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [screenshotSavedMessage, setScreenshotSavedMessage] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setInputName(value);
    setTracePhase('typing');
    setLastEventLabel(`TextField.value = "${value}"`);
    if (value.trim().length > 0) {
      setHasTypedName(true);
    }
  };

  const handleGreetClick = () => {
    const cleanName = includeEmptyGuard ? inputName.trim() : inputName;
    if (includeEmptyGuard && !cleanName) {
      setDisplayedGreeting('Please enter your name first.');
    } else {
      setDisplayedGreeting(`Hello, ${cleanName}!`);
    }
    setUpdateCount((prev) => prev + 1);
    setTracePhase('updated');
    setLastEventLabel('on_click -> page.update()');
    setHasClickedGreet(true);
  };

  const handleReset = () => {
    setInputName('');
    setDisplayedGreeting('');
    setUpdateCount(0);
    setTracePhase('idle');
    setLastEventLabel('Initialized controls');
    setHasTypedName(false);
    setHasClickedGreet(false);
    setScreenshotPreviewUrl(null);
    setScreenshotSavedMessage(null);
  };

  const handleApplySample = (sample: string) => {
    setInputName(sample);
    setDisplayedGreeting(`Hello, ${sample}!`);
    setUpdateCount((prev) => prev + 1);
    setTracePhase('updated');
    setLastEventLabel(`Greeted "${sample}" -> page.update()`);
    setHasTypedName(true);
    setHasClickedGreet(true);
  };

  const handleDownloadPy = () => {
    const source = buildPythonSource(syntaxMode, includeEmptyGuard);
    downloadTextFile(source, 'greeting_app.py');
  };

  const handleCaptureScreenshot = () => {
    const dataUrl = renderFletScreenshot({
      inputName,
      displayedGreeting,
      theme: fletTheme,
      viewport: fletViewport,
    });
    if (!dataUrl) {
      return;
    }
    setScreenshotPreviewUrl(dataUrl);
    downloadDataUrl(dataUrl, 'greeting_app_screenshot.png');
    setScreenshotSavedMessage('Saved PNG');
    window.setTimeout(() => setScreenshotSavedMessage(null), 2400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header onDownloadPy={handleDownloadPy} onSelectDeckTab={setDeckTab} />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 py-8 space-y-8">
        {/* Compact Assignment Context Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>FNB App Academy</span>
              <span aria-hidden="true">·</span>
              <span>Unit 3: Intro to Flet</span>
              <span aria-hidden="true">·</span>
              <span>Practical Activity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Greeting App (Flet)
            </h1>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Test the vertical <code className="text-slate-900 font-mono text-[13px]">ft.Column</code> layout with a <code className="text-slate-900 font-mono text-[13px]">TextField</code>, <code className="text-slate-900 font-mono text-[13px]">ElevatedButton("Greet Me")</code>, and immediate <code className="text-slate-900 font-mono text-[13px]">page.update()</code> refresh, then export your Python file and running app screenshot.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <span className="text-xs text-slate-500 mr-1">Quick test:</span>
            {SAMPLE_NAMES.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleApplySample(sample)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  inputName === sample && displayedGreeting === `Hello, ${sample}!`
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Zone Educational Sandbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <FletWindowSimulator
              inputName={inputName}
              displayedGreeting={displayedGreeting}
              updateCount={updateCount}
              lastEventLabel={lastEventLabel}
              tracePhase={tracePhase}
              fletTheme={fletTheme}
              fletViewport={fletViewport}
              onInputChange={handleInputChange}
              onGreetClick={handleGreetClick}
              onReset={handleReset}
              onThemeChange={setFletTheme}
              onViewportChange={setFletViewport}
              onCaptureScreenshot={handleCaptureScreenshot}
              screenshotSavedMessage={screenshotSavedMessage}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <InspectorDeck
              activeTab={deckTab}
              onTabChange={setDeckTab}
              syntaxMode={syntaxMode}
              onSyntaxModeChange={setSyntaxMode}
              includeEmptyGuard={includeEmptyGuard}
              onToggleEmptyGuard={setIncludeEmptyGuard}
              inputName={inputName}
              displayedGreeting={displayedGreeting}
              tracePhase={tracePhase}
              hasTypedName={hasTypedName}
              hasClickedGreet={hasClickedGreet}
              onDownloadPy={handleDownloadPy}
            />
          </div>
        </div>

        {/* Deliverables Export Section */}
        <section
          id="submission-guide"
          aria-label="Assignment Deliverables"
          className="bg-white border border-slate-200 rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <h2 className="text-base font-semibold text-slate-900">
                Activity Deliverables
              </h2>
              <p className="text-sm text-slate-600">
                Download both required files directly for your submission: the complete <code className="font-mono text-xs text-slate-900">greeting_app.py</code> script and a high-resolution PNG screenshot reflecting the current app state.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPy}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download greeting_app.py</span>
              </button>

              <button
                type="button"
                onClick={handleCaptureScreenshot}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>Export Running Screenshot</span>
              </button>
            </div>
          </div>

          {screenshotPreviewUrl && (
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={screenshotPreviewUrl}
                alt="Rendered screenshot of the running Flet Greeting App"
                className="w-56 rounded-lg border border-slate-200 shadow-xs"
              />
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-900">
                  greeting_app_screenshot.png ready
                </div>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Generated from your live Flet canvas showing {displayedGreeting ? `"${displayedGreeting}"` : 'the active layout'}. Click below if you need to re-download the image file.
                </p>
                <button
                  type="button"
                  onClick={() => downloadDataUrl(screenshotPreviewUrl, 'greeting_app_screenshot.png')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download PNG again</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 px-6">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Flet Greeting Studio · Python Mobile & Web Development</span>
          <span>Deliverables: greeting_app.py and running app screenshot</span>
        </div>
      </footer>
    </div>
  );
}
