import { ToastPosition, ToastType, useToast } from '@aminekun90/react-toast';
import { useMemo, useState } from 'react';

// --- Imports PrismJS ---
import Prism from 'prismjs';
// L'ordre est important pour le chargement des dépendances de langages
import 'prismjs/components/prism-clike'; // Dépendance de base
import 'prismjs/components/prism-javascript'; // Dépendance de TypeScript
import 'prismjs/components/prism-markup'; // Indispensable pour HTML/XML/JSX
import 'prismjs/components/prism-typescript'; // Langage final

import './ToastPlayground.scss';

/**
 * Composant de démonstration interactif pour générer et tester des toasts.
 * Utilise PrismJS pour la coloration syntaxique dynamique.
 */
export function ToastPlayground() {
    const { show } = useToast();

    // --- ÉTAT DU PLAYGROUND ---
    const [toastTitle, setToastTitle] = useState('Message personnalisé');
    const [toastMessage, setToastMessage] = useState('Ceci est un toast généré avec React !');
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastPosition, setToastPosition] = useState<ToastPosition>('top-right');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastProgressBar, setToastProgressBar] = useState(true);

    // --- ÉTAT DE LA COPIE ---
    const [copiedTs, setCopiedTs] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

    // --- GÉNÉRATION DU CODE BRUT ---
    const tsCode = useMemo(() => {
        const titleLine = toastTitle ? `\n      title: '${toastTitle}',` : '';
        const messageLine = toastMessage ? `\n      message: '${toastMessage}',` : '';
        const durationLine = `\n      duration: ${toastDuration},`;

        return `import { useToast } from '@aminekun90/react-toast';

export function MyComponent() {
  const { show } = useToast();

  const handleAction = () => {
    show({
      type: '${toastType}',${titleLine}${messageLine}
      position: '${toastPosition}',${durationLine}
      progressBar: ${toastProgressBar}
    });
  };

  return <button onClick={handleAction}>Show Toast</button>;
}`;
    }, [toastTitle, toastMessage, toastType, toastPosition, toastDuration, toastProgressBar]);

    const htmlCode = useMemo(() => {
        return `<button onClick={handleAction}>\n  Show Toast\n</button>`;
    }, []);

    // --- COLORATION SYNTAXIQUE ---
    // On utilise 'dangerouslySetInnerHTML' pour injecter le HTML généré par Prism.
    // Note : Prism.languages.markup est utilisé pour le HTML.
    const highlightedTs = useMemo(() => {
        const lang = Prism.languages.typescript;
        if (!lang) return tsCode.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll("/>", "&gt;");
        return Prism.highlight(tsCode, lang, 'typescript');
    }, [tsCode]);

    const highlightedHtml = useMemo(() => {
        const lang = Prism.languages.markup;
        if (!lang) return htmlCode.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll("/>", "&gt;");
        return Prism.highlight(htmlCode, lang, 'markup');
    }, [htmlCode]);

    // --- ACTIONS ---
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

    const copyToClipboard = (text: string, type: 'ts' | 'html') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'ts') {
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
                <div className="form-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Titre</label>
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
                            <label htmlFor='type'>Type</label>
                            <select id='type' value={toastType} onChange={(e) => setToastType(e.target.value as ToastType)} className="form-control">
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
                                <option value="bottom-right">Bottom Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="top-center">Top Center</option>
                                <option value="bottom-center">Bottom Center</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor='duration'>Durée (ms)</label>
                            <input
                                id='duration'
                                type="number"
                                value={toastDuration}
                                onChange={(e) => setToastDuration(Number(e.target.value))}
                                className="form-control"
                                step={1000}
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={toastProgressBar}
                                    onChange={(e) => setToastProgressBar(e.target.checked)}
                                />
                                <span>Afficher la barre de progression</span>
                            </label>
                        </div>
                    </div>

                    <button className="btn-launch" onClick={handleTest}>
                        🚀 Tester le Toast
                    </button>
                </div>

                <div className="code-preview-section">
                    <h3>TypeScript (React Hook)</h3>
                    <div className="code-block-wrapper">
                        <button className={`btn-copy ${copiedTs ? 'copied' : ''}`} onClick={() => copyToClipboard(tsCode, 'ts')}>
                            {copiedTs ? 'Copié ! ✅' : 'Copier'}
                        </button>
                        {/* Ajout de la classe sur le <pre> également pour assurer la compatibilité CSS Prism */}
                        <pre className="language-typescript">
                            <code dangerouslySetInnerHTML={{ __html: highlightedTs }}></code>
                        </pre>
                    </div>

                    <h3>JSX / HTML</h3>
                    <div className="code-block-wrapper">
                        <button className={`btn-copy ${copiedHtml ? 'copied' : ''}`} onClick={() => copyToClipboard(htmlCode, 'html')}>
                            {copiedHtml ? 'Copié ! ✅' : 'Copier'}
                        </button>
                        <pre className="language-markup">
                            <code  dangerouslySetInnerHTML={{ __html: highlightedHtml }}></code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}