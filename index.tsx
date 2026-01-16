import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/config'; // Initialize i18n
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);