import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToastContainer } from '../Toast';
import { useToast } from '../ToastContext';
import { ToastProvider } from '../ToastProvider';

// Composant de test pour déclencher un toast
const TestComponent = () => {
  const { success } = useToast();
  return <button onClick={() => success('Mon message', 'Mon Titre')}>Show</button>;
};

describe('React Toast Library', () => {
  it('should display a toast when calling success()', async () => {
    render(
      <ToastProvider>
        <ToastContainer />
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show');
    
    await act(async () => {
      button.click();
    });

    expect(screen.getByText('Mon Titre')).toBeInTheDocument();
    expect(screen.getByText('Mon message')).toBeInTheDocument();
  });

  it('should remove toast after duration', async () => {
    vi.useFakeTimers();
    
    render(
      <ToastProvider>
        <ToastContainer />
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show');
    button.click();

    // Avancer le temps (5000ms par défaut + 500ms d'anim)
    await act(async () => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.queryByText('Mon Titre')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});