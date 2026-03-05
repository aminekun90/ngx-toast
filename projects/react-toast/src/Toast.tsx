import {
    faCheckCircle, faExclamationTriangle, faInfoCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { useToast } from './ToastContext';
import { Toast } from './types';

// IMPORTANT: Importe le CSS ici pour qu'il soit inclus dans le build
import './toast.styles.scss';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const { remove } = useToast();

    const icon = useMemo(() => {
        switch (toast.type) {
            case 'success': return faCheckCircle;
            case 'error': return faTimesCircle;
            case 'warning': return faExclamationTriangle;
            default: return faInfoCircle;
        }
    }, [toast.type]);

    return (

        <div // NOSONAR : annoying warning from sonarqube
            key={toast.id}
            className={`toast-item toast-${toast.type} ${toast.closing ? 'closing' : ''} ${toast.toastClass}`}
            onClick={() => remove(toast.id)}
        >
            <div className="toast-icon">
                <FontAwesomeIcon icon={icon} />
            </div>

            <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                <div className="toast-message">{toast.message}</div>
            </div>

            <button className="toast-close" onClick={(e) => {
                e.stopPropagation();
                remove(toast.id);
            }}>
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
    const positions = ["top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"] as const;

    return (
        <>
            {positions.map(pos => (
                <div key={pos} className={`toast-container ${pos}`}>
                    {toasts
                        .filter(t => t.position === pos)
                        .map(t => <ToastItem key={t.id} toast={t} />)
                    }
                </div>
            ))}
        </>
    );
};