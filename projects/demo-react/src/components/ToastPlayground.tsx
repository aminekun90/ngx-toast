import { ToastPosition, ToastType, useToast } from '@aminekun90/react-toast';
import { faBell, faBomb, faEnvelope, faHeart, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import { useMemo, useState } from 'react';
import './ToastPlayground.scss';

const ICON_MAP = {
    'undefined': undefined,
    'faUser': faUser,
    'faBell': faBell,
    'faHeart': faHeart,
    'faEnvelope': faEnvelope,
    'faStar': faStar,
    'faBomb': faBomb,
};

type IconName = keyof typeof ICON_MAP;

export function ToastPlayground() {
    // On récupère 'show' et 'promise' depuis le hook
    const { show, promise } = useToast();

    const [toastTitle, setToastTitle] = useState('Custom Message');
    const [toastMessage, setToastMessage] = useState('This is a custom Toast using React!');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastPosition, setToastPosition] = useState<ToastPosition>('top-right');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastProgressBar, setToastProgressBar] = useState(true);
    const [selectedIconName, setSelectedIconName] = useState<IconName>('faUser');

    const [copiedSetup, setCopiedSetup] = useState(false);
    const [copiedTs, setCopiedTs] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

    const setupCode = `import { ToastProvider } from '@aminekun90/react-toast';

root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);`;

    const tsCode = useMemo(() => {
        return `import { useToast } from '@aminekun90/react-toast';
import { ${selectedIconName} } from '@fortawesome/free-solid-svg-icons';

export function MyComponent() {
  const { show, promise } = useToast();

  // Basic usage
  const handleAction = () => {
    show({
      type: '${toastType}',
      message: '${toastMessage}',
      position: '${toastPosition}',
      duration: ${toastDuration},
      ${ICON_MAP[selectedIconName] ? `icon: ${selectedIconName},` : ''}
    });
  };

  // Promise usage
  const handlePromise = () => {
    const myPromise = new Promise((resolve) => setTimeout(() => resolve('Success!'), 2000));

    promise(myPromise, {
      loading: 'Loading data...',
      success: (data) => \`Data loaded: \${data}\`,
      error: 'Error while loading',
    }, { position: '${toastPosition}' });
  };

  return <button onClick={handlePromise}>Launch Promise</button>;
}`;
    }, [toastMessage, toastType, toastPosition, toastDuration, selectedIconName]);

    const htmlCode = `<button onClick={handleAction}>Show Toast</button>`;

    const highlightedSetup = useMemo(() => Prism.highlight(setupCode, Prism.languages.typescript, 'typescript'), [setupCode]);
    const highlightedTs = useMemo(() => Prism.highlight(tsCode, Prism.languages.typescript, 'typescript'), [tsCode]);
    const highlightedHtml = useMemo(() => Prism.highlight(htmlCode, Prism.languages.markup, 'markup'), [htmlCode]);

    const handleTest = () => {
        show({
            type: toastType,
            title: toastTitle,
            message: toastMessage,
            position: toastPosition,
            duration: toastDuration,
            progressBar: toastProgressBar,
            icon: ICON_MAP[selectedIconName]
        });
    };

    // Nouvelle fonction pour tester la promise
    const handlePromiseTest = () => {
        const myPromise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                // Simulation aléatoire de succès ou d'erreur
                Math.random() > 0.3 ? resolve("API Data") : reject(new Error("Server Error"));
            }, 2000);
        });

        promise(myPromise, {
            loading: 'Fetching data...',
            success: (data: string) => `Loaded: ${data}`,
            error: (err: Error) => `Failed: ${err.message}`,
        }, { 
            position: toastPosition,
            progressBar: true 
        });
    };

    const copyToClipboard = (text: string, type: 'setup' | 'ts' | 'html') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'setup') { setCopiedSetup(true); setTimeout(() => setCopiedSetup(false), 2000); }
            else if (type === 'ts') { setCopiedTs(true); setTimeout(() => setCopiedTs(false), 2000); }
            else { setCopiedHtml(true); setTimeout(() => setCopiedHtml(false), 2000); }
        });
    };

    return (
        <div className="playground-card">
            <h2>⚙️ Toast Builder (React)</h2>
            <div className="playground-layout">
                <div className="form-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input id="title" type="text" value={toastTitle} onChange={(e) => setToastTitle(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" value={toastMessage} onChange={(e) => setToastMessage(e.target.value)} className="form-control" rows={2} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select id="type" value={toastType} onChange={(e) => setToastType(e.target.value as ToastType)} className="form-control">
                                <option value="success">Success</option>
                                <option value="error">Error</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="icon">Custom Icon (FA)</label>
                            <select id="icon" value={selectedIconName} onChange={(e) => setSelectedIconName(e.target.value as IconName)} className="form-control">
                                {Object.keys(ICON_MAP).map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">Position</label>
                            <select id="position" value={toastPosition} onChange={(e) => setToastPosition(e.target.value as ToastPosition)} className="form-control">
                                <option value="top-right">Top Right</option>
                                <option value="top-left">Top Left</option>
                                <option value="top-center">Top Center</option>
                                <option value="bottom-right">Bottom Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-center">Bottom Center</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration (ms)</label>
                            <input id="duration" type="number" value={toastDuration} onChange={(e) => setToastDuration(Number(e.target.value))} className="form-control" />
                        </div>
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={toastProgressBar} onChange={(e) => setToastProgressBar(e.target.checked)} />
                                <span>Show Progress Bar</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="actions-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button className="btn-launch" onClick={handleTest} style={{ flex: 1 }}>🚀 Standard Toast</button>
                        <button className="btn-launch" onClick={handlePromiseTest} style={{ flex: 1, backgroundColor: '#6366f1' }}>⏳ Test Promise</button>
                    </div>
                </div>

                <div className="code-preview-section">
                    <div className="setup-block">
                        <h3>1️⃣ Setup (main.tsx)</h3>
                        <div className="code-block-wrapper">
                            <button className={`btn-copy ${copiedSetup ? 'copied' : ''}`} onClick={() => copyToClipboard(setupCode, 'setup')}>
                                {copiedSetup ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-typescript"><code dangerouslySetInnerHTML={{ __html: highlightedSetup }}></code></pre>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="usage-block">
                        <h3>2️⃣ Usage (Component)</h3>
                        <div className="code-block-wrapper">
                            <button className={`btn-copy ${copiedTs ? 'copied' : ''}`} onClick={() => copyToClipboard(tsCode, 'ts')}>
                                {copiedTs ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-typescript"><code dangerouslySetInnerHTML={{ __html: highlightedTs }}></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}