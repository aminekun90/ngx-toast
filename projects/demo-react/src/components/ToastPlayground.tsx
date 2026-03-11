import { ToastPosition, ToastType, useToast } from '@aminekun90/react-toast';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import { useMemo, useState } from 'react';
import './ToastPlayground.scss';

export function ToastPlayground() {
    const { show } = useToast();
    
    // Builder States
    const [toastTitle, setToastTitle] = useState('Custom Message');
    const [toastMessage, setToastMessage] = useState('This is a custom Toast using React!');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastPosition, setToastPosition] = useState<ToastPosition>('top-right');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastProgressBar, setToastProgressBar] = useState(true);

    // Copy Button States
    const [copiedSetup, setCopiedSetup] = useState(false);
    const [copiedTs, setCopiedTs] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

    // 1. Setup Code (To be placed in main.tsx)
    const setupCode = `import { ToastProvider } from '@aminekun90/react-toast';

// In your main.tsx or App.tsx
root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);`;

    // 2. Dynamic Usage Code
    const tsCode = useMemo(() => {
        const titleLine = toastTitle ? `\n      title: '${toastTitle}',` : '';
        const messageLine = toastMessage ? `\n      message: '${toastMessage}',` : '';

        return `import { useToast } from '@aminekun90/react-toast';

export function MyComponent() {
  const { show } = useToast();

  const handleAction = () => {
    show({
      type: '${toastType}',${titleLine}${messageLine}
      position: '${toastPosition}',
      duration: ${toastDuration},
      progressBar: ${toastProgressBar}
    });
  };

  return <button onClick={handleAction}>Show Toast</button>;
}`;
    }, [toastTitle, toastMessage, toastType, toastPosition, toastDuration, toastProgressBar]);

    const htmlCode = `<button onClick={handleAction}>\n  Show Toast\n</button>`;

    // Syntax Highlighting
    const highlightedSetup = useMemo(() => Prism.highlight(setupCode, Prism.languages.typescript, 'typescript'), [setupCode]);
    const highlightedTs = useMemo(() => Prism.highlight(tsCode, Prism.languages.typescript, 'typescript'), [tsCode]);
    const highlightedHtml = useMemo(() => Prism.highlight(htmlCode, Prism.languages.markup, 'markup'), [htmlCode]);

    // Handlers
    const handleTest = () => {
        show({
            type: toastType,
            title: toastTitle,
            message: toastMessage,
            position: toastPosition,
            duration: toastDuration,
            progressBar: toastProgressBar
        });
    };

    const copyToClipboard = (text: string, type: 'setup' | 'ts' | 'html') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'setup') {
                setCopiedSetup(true);
                setTimeout(() => setCopiedSetup(false), 2000);
            } else if (type === 'ts') {
                setCopiedTs(true);
                setTimeout(() => setCopiedTs(false), 2000);
            } else {
                setCopiedHtml(true);
                setTimeout(() => setCopiedHtml(false), 2000);
            }
        });
    };

    return (
        <div className="playground-card">
            <h2>⚙️ Toast Builder (React)</h2>
            <div className="playground-layout">
                
                {/* Left: Form Section */}
                <div className="form-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={toastTitle}
                                onChange={(e) => setToastTitle(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                value={toastMessage}
                                onChange={(e) => setToastMessage(e.target.value)}
                                className="form-control"
                                rows={2}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                value={toastType}
                                onChange={(e) => setToastType(e.target.value as ToastType)}
                                className="form-control"
                            >
                                <option value="success">Success</option>
                                <option value="error">Error</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">Position</label>
                            <select
                                id="position"
                                value={toastPosition}
                                onChange={(e) => setToastPosition(e.target.value as ToastPosition)}
                                className="form-control"
                            >
                                <option value="top-right">Top Right</option>
                                <option value="top-left">Top Left</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration (ms)</label>
                            <input
                                id="duration"
                                type="number"
                                value={toastDuration}
                                onChange={(e) => setToastDuration(Number(e.target.value))}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={toastProgressBar}
                                    onChange={(e) => setToastProgressBar(e.target.checked)}
                                />
                                <span>Show Progress Bar</span>
                            </label>
                        </div>
                    </div>
                    <button className="btn-launch" onClick={handleTest}>🚀 Try me!</button>
                </div>

                {/* Right: Code Preview Section */}
                <div className="code-preview-section">
                    
                    {/* Step 1: Mandatory Setup */}
                    <div className="setup-block">
                        <h3>1️⃣ Setup (main.tsx)</h3>
                        <p className="instruction-text">Wrap your application to enable toast notifications:</p>
                        <div className="code-block-wrapper">
                            <button
                                className={`btn-copy ${copiedSetup ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(setupCode, 'setup')}
                            >
                                {copiedSetup ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-typescript">
                                <code dangerouslySetInnerHTML={{ __html: highlightedSetup }}></code>
                            </pre>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Step 2: Dynamic Usage */}
                    <div className="usage-block">
                        <h3>2️⃣ Usage (Component)</h3>
                        <p className="instruction-text">Use the hook to trigger a notification:</p>
                        <div className="code-block-wrapper">
                            <button
                                className={`btn-copy ${copiedTs ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(tsCode, 'ts')}
                            >
                                {copiedTs ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-typescript">
                                <code dangerouslySetInnerHTML={{ __html: highlightedTs }}></code>
                            </pre>
                        </div>
                        
                        <h3>HTML</h3>
                        <div className="code-block-wrapper">
                            <button
                                className={`btn-copy ${copiedHtml ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(htmlCode, 'html')}
                            >
                                {copiedHtml ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-markup">
                                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }}></code>
                            </pre>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}