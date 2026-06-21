import { Toast, ToastPosition, ToastType, useToast } from '@aminekun90/react-toast';
import { faBell, faBomb, faEnvelope, faHeart, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import { useEffect, useMemo, useState } from 'react';
import './ToastPlayground.scss';

// Map icons to names for the select and code generation
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

const THEMES = ['default', 'material', 'glass', 'minimal', 'neon', 'solid'] as const;
type ThemeName = typeof THEMES[number];

const SCHEMES = ['auto', 'light', 'dark'] as const;
type SchemeName = typeof SCHEMES[number];

export function ToastPlayground() {
    const { show, promise, clear } = useToast();

    // Builder States
    const [toastTitle, setToastTitle] = useState('Custom Message');
    const [toastMessage, setToastMessage] = useState('This is a custom Toast using React!');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastPosition, setToastPosition] = useState<ToastPosition>('top-right');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastProgressBar, setToastProgressBar] = useState(true);
    const [toastProgressAnimation, setToastProgressAnimation] = useState<Toast['progressAnimation']>('increasing');
    const [selectedIconName, setSelectedIconName] = useState<IconName>('faUser');
    const [toastTheme, setToastTheme] = useState<ThemeName>('default');
    const [colorScheme, setColorScheme] = useState<SchemeName>('auto');

    useEffect(() => {
        const root = document.documentElement.classList;
        root.toggle('ngx-toast-dark', colorScheme === 'dark');
        root.toggle('ngx-toast-light', colorScheme === 'light');
    }, [colorScheme]);

    // Copy Button States
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
        const titleLine = toastTitle ? `\n      title: '${toastTitle}',` : '';
        const iconLine = ICON_MAP[selectedIconName] ? `\n      icon: ${selectedIconName},` : '';
        const themeLine = toastTheme !== 'default' ? `\n      theme: '${toastTheme}',` : '';
        const schemeNote = colorScheme === 'auto'
            ? ''
            : `\n    // Color scheme is toggled with a class on a wrapper (e.g. <html>)\n    document.documentElement.classList.add('ngx-toast-${colorScheme}');\n`;

        return `import { useToast } from '@aminekun90/react-toast';
import { ${selectedIconName} } from '@fortawesome/free-solid-svg-icons';

export function MyComponent() {
  const { show, promise } = useToast();

  const handleAction = () => {${schemeNote}
    show({
      type: '${toastType}',${titleLine}
      message: '${toastMessage}',
      position: '${toastPosition}',
      duration: ${toastDuration},
      progressBar: ${toastProgressBar},
      progressAnimation: '${toastProgressAnimation}',${iconLine}${themeLine}
    });
  };

  const handlePromise = () => {
    const myPromise = new Promise((resolve) => setTimeout(() => resolve('Success!'), 2000));

    promise(myPromise, {
      loading: 'Loading data...',
      success: (data) => \`Data loaded: \${data}\`,
      error: 'Error while loading',
    }, { position: '${toastPosition}' });
  };

  return <button onClick={handleAction}>Show Toast</button>;
}`;
    }, [toastTitle, toastMessage, toastType, toastPosition, toastDuration, toastProgressBar, toastProgressAnimation, selectedIconName, toastTheme, colorScheme]);

    const htmlCode = `<button onClick={handleAction}>\n  Show Toast\n</button>`;

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
            progressAnimation: toastProgressAnimation,
            theme: toastTheme === 'default' ? undefined : toastTheme,
            icon: ICON_MAP[selectedIconName]
        });
    };

    const handlePromiseTest = () => {
        const myPromise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.3 ? resolve("API Data") : reject(new Error("Server Error"));
            }, 2000);
        });

        promise(myPromise, {
            loading: 'Fetching data...',
            success: (data: string) => `Loaded: ${data}`,
            error: (err: unknown) => `Failed: ${(err as Error).message}`,
        }, {
            position: toastPosition,
            progressBar: true,
            theme: toastTheme === 'default' ? undefined : toastTheme
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
                        <div className="form-group">
                            <label htmlFor="progressAnimation">Progress Animation</label>
                            <select id="progressAnimation" value={toastProgressAnimation} onChange={(e) => setToastProgressAnimation(e.target.value as Toast['progressAnimation'])} className="form-control">
                                <option value="increasing">Increasing</option>
                                <option value="decreasing">Decreasing</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="theme">Theme</label>
                            <select id="theme" value={toastTheme} onChange={(e) => setToastTheme(e.target.value as ThemeName)} className="form-control">
                                {THEMES.map(theme => (
                                    <option key={theme} value={theme}>{theme}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="scheme">Color scheme</label>
                            <select id="scheme" value={colorScheme} onChange={(e) => setColorScheme(e.target.value as SchemeName)} className="form-control">
                                {SCHEMES.map(scheme => (
                                    <option key={scheme} value={scheme}>{scheme}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={toastProgressBar} onChange={(e) => setToastProgressBar(e.target.checked)} />
                                <span>Show Progress Bar</span>
                            </label>
                        </div>
                    </div>

                    <div className="actions-group">
                        <button className="btn-launch" onClick={handleTest}>🚀 Try Toast !</button>
                        <button className="btn-launch btn-promise" onClick={handlePromiseTest}>⏳ Promise Toast !</button>
                        <button className="btn-launch btn-clear" onClick={() => clear()}>🧹 Clear all</button>
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

                        <h3>HTML / JSX</h3>
                        <div className="code-block-wrapper">
                            <button className={`btn-copy ${copiedHtml ? 'copied' : ''}`} onClick={() => copyToClipboard(htmlCode, 'html')}>
                                {copiedHtml ? 'Copied! ✅' : 'Copy'}
                            </button>
                            <pre className="language-markup"><code dangerouslySetInnerHTML={{ __html: highlightedHtml }}></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}