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
    const [toastTitle, setToastTitle] = useState('Message personnalisé');
    const [toastMessage, setToastMessage] = useState('Ceci est un toast généré avec React !');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastPosition, setToastPosition] = useState<ToastPosition>('top-right');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastProgressBar, setToastProgressBar] = useState(true);

    const [copiedTs, setCopiedTs] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

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

    const highlightedTs = useMemo(() => Prism.highlight(tsCode, Prism.languages.typescript, 'typescript'), [tsCode]);
    const highlightedHtml = useMemo(() => Prism.highlight(htmlCode, Prism.languages.markup, 'markup'), [htmlCode]);

    const handleTest = () => {
        show({ type: toastType, title: toastTitle, message: toastMessage, position: toastPosition, duration: toastDuration, progressBar: toastProgressBar });
    };

    const copyToClipboard = (text: string, type: 'ts' | 'html') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'ts') { setCopiedTs(true); setTimeout(() => setCopiedTs(false), 2000); }
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
                            <label htmlFor="title">Titre</label>
                            <input id="title"  type="text" value={toastTitle} onChange={(e) => setToastTitle(e.target.value)} className="form-control" />
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
                            <label htmlFor="position">Position</label>
                            <select id="position" value={toastPosition} onChange={(e) => setToastPosition(e.target.value as ToastPosition)} className="form-control">
                                <option value="top-right">Top Right</option>
                                <option value="top-left">Top Left</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Durée (ms)</label>
                            <input id="duration" type="number" value={toastDuration} onChange={(e) => setToastDuration(Number(e.target.value))} className="form-control" />
                        </div>
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={toastProgressBar} onChange={(e) => setToastProgressBar(e.target.checked)} />
                                <span>Afficher la barre de progression</span>
                            </label>
                        </div>
                    </div>
                    <button className="btn-launch" onClick={handleTest}>🚀 Tester le Toast</button>
                </div>

                <div className="code-preview-section">
                    <h3>TypeScript</h3>
                    <div className="code-block-wrapper">
                        <button className={`btn-copy ${copiedTs ? 'copied' : ''}`} onClick={() => copyToClipboard(tsCode, 'ts')}>
                            {copiedTs ? 'Copié ! ✅' : 'Copier'}
                        </button>
                        <pre className="language-typescript"><code dangerouslySetInnerHTML={{ __html: highlightedTs }}></code></pre>
                    </div>
                    <h3>HTML</h3>
                    <div className="code-block-wrapper">
                        <button className={`btn-copy ${copiedHtml ? 'copied' : ''}`} onClick={() => copyToClipboard(htmlCode, 'html')}>
                            {copiedHtml ? 'Copié ! ✅' : 'Copier'}
                        </button>
                        <pre className="language-markup"><code dangerouslySetInnerHTML={{ __html: highlightedHtml }}></code></pre>
                    </div>
                </div>
            </div>
        </div>
    );
}