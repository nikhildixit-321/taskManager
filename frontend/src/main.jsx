import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// #region agent log
const logDebug = (location, message, data) => {
  fetch('http://127.0.0.1:7242/ingest/a7a2be90-4c90-42f4-a997-46758b5bf88d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H'})}).catch(()=>{});
};
try {
  logDebug('main.jsx:8', 'Application starting', { hasRoot: !!document.getElementById('root') });
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    logDebug('main.jsx:10', 'ERROR: root element not found', {});
    throw new Error('Root element not found');
  }
  logDebug('main.jsx:13', 'Creating root and rendering', {});
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  logDebug('main.jsx:20', 'Application rendered successfully', {});
} catch (error) {
  logDebug('main.jsx:22', 'FATAL ERROR in main.jsx', { errorMessage: error.message, errorStack: error.stack });
  console.error('Fatal error:', error);
}
// #endregion agent log
