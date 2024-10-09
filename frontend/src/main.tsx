import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

import { store } from './app/store';            // Import the Redux store
import { Provider } from 'react-redux'          // id you need redux

import User from './features/user/User'
import ProductTable from './components/productTable';

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
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>                            {/* Enables additional checks in development mode */}
    <Provider store={store}>                    {/* Redux store provider */}
      <User msalInstance={msalInstance}/>
      <ProductTable />
    </Provider>
  </React.StrictMode>
);
