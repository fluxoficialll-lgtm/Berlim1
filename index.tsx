import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { validateEnvironment } from './services/environmentValidator';
import { initNetworkInterceptor } from './services/telemetry/NetworkInterceptor';
import { eventTracker } from './services/telemetry/EventTracker';
import { TelemetryFilter } from './services/telemetry/TelemetryFilter';

// 1. Validação de Infraestrutura antes do boot
validateEnvironment();

// 2. Inicialização de Telemetria e Observabilidade
initNetworkInterceptor();

// 3. Captura Global de Erros (Safety Net)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // Specifically catch and ignore ResizeObserver loop error at the source
    // This is a common browser warning that doesn't affect functionality
    if (e.message && e.message.includes('ResizeObserver loop')) {
        e.stopImmediatePropagation();
        return;
    }

    const error = e.error || e.message;
    if (TelemetryFilter.shouldTrack(error)) {
        eventTracker.trackCriticalError(error, 'GLOBAL_WINDOW_ERROR');
    } else {
        e.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (TelemetryFilter.shouldTrack(e.reason)) {
        eventTracker.trackCriticalError(e.reason, 'UNHANDLED_PROMISE_REJECTION');
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);