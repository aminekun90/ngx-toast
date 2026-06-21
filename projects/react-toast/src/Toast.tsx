import * as icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { useToast } from './ToastContext';
import { Toast, ToastPosition } from './types';

// Imported here so the CSS is bundled into the build.
import './toast.styles.scss';

const POSITIONS: readonly ToastPosition[] = [
  'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center',
];

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { remove, pause, resume } = useToast();

  const icon = useMemo(() => {
    if (toast.icon) return toast.icon;
    switch (toast.type) {
      case 'success': return icons.faCheckCircle;
      case 'error': return icons.faTimesCircle;
      case 'warning': return icons.faExclamationTriangle;
      case 'loading': return icons.faSpinner;
      default: return icons.faInfoCircle;
    }
  }, [toast.type, toast.icon]);

  const onMouseEnter = () => { if (toast.pauseOnHover) pause(toast.id); };
  const onMouseLeave = () => { if (toast.pauseOnHover) resume(toast.id); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      remove(toast.id);
    }
  };

  return (
    <div
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={0}
      className={`toast-item toast-${toast.type} ${toast.closing ? 'closing' : ''} ${toast.pauseOnHover ? 'pausable' : ''} ${toast.theme ? `ngx-toast-theme-${toast.theme}` : ''} ${toast.toastClass}`}
      onClick={() => remove(toast.id)}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
    >
      <div className={`toast-icon ${toast.type === 'loading' ? 'spinning' : ''}`}>
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>

      <button
        type="button"
        className="toast-close"
        aria-label="Close notification"
        onClick={(e) => { e.stopPropagation(); remove(toast.id); }}
      >
        &times;
      </button>

      {toast.progressBar && toast.duration && (
        <div
          className={`toast-progress-bar ${toast.progressAnimation}`}
          style={{ animationDuration: `${toast.duration}ms` }}
        ></div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <>
      {POSITIONS.map((pos) => (
        <div key={pos} className={`toast-container ${pos}`}>
          {toasts.filter((t) => t.position === pos).map((t) => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </div>
      ))}
    </>
  );
};
