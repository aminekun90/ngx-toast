import { ToastProvider } from '@aminekun90/react-toast'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
(globalThis as any).React = React;

const root:HTMLElement = document.getElementById('root') as unknown as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)