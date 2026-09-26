import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SessionProvider } from './store/session.context';
import './index.css';
createRoot(document.getElementById('root')!).render(<StrictMode><SessionProvider><App /></SessionProvider></StrictMode>);
