import { ToastContainer, useToast, version } from '@aminekun90/react-toast';
import './App.scss';
import { ToastPlayground } from './components/ToastPlayground';

function AppContent() {
  const { success, error, info, warning } = useToast();

  const goTo = (url: string) => {
    window.open(url, '_self');
  };

  return (
    <div className="hero-section">
      <span className="badge">Version {version}</span>
      <h1>React Toast Demo 🚀</h1>
      <div className="button-group links-group">
        <button onClick={() => goTo('https://aminekun90.github.io/ngx-toast/')} className="btn btn-primary">Angular Version</button>
        <button onClick={() => goTo('https://github.com/aminekun90/ngx-toast/')} className="btn btn-primary">GitHub</button>
        <button onClick={() => goTo('https://www.npmjs.com/package/@aminekun90/react-toast')} className="btn btn-primary">Npm</button>
      </div>

      <p>
        A lightweight, customizable toast notification library for React.
        Mirroring the logic of ngx-toast with React Hooks.
      </p>

      <div className="button-group">
        <button className="btn btn-success" onClick={() => success('Opération réussie !', 'Succès', { duration: 2000, progressBar: true })}>
          Success Toast
        </button>
        <button className="btn btn-error" onClick={() => error('Une erreur est survenue.', 'Erreur', { progressBar: true })}>
          Error Toast
        </button>
        <button className="btn btn-primary" onClick={() => info('Voici une information.', 'Info', { progressBar: true })}>
          Info Toast
        </button>
        <button className="btn btn-warning" onClick={() => warning('Attention à cela.', 'Warning', { progressBar: true })}>
          Warning Toast
        </button>
      </div>

      <ToastPlayground />
    </div>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <ToastContainer />
      <AppContent />
    </div>
  );
}