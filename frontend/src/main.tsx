import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

// Create an instance of PublicClientApplication
export const msalInstance = new PublicClientApplication(msalConfig);

// Event handler for MSAL events
msalInstance.addEventCallback((event: EventMessage) => {
  if ((event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS) && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
  }
});
// mounting point for the App and pass prop maslInstance to App
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App msalInstance={msalInstance} />
  </StrictMode>,
)
