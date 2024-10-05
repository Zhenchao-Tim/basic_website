import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  
import App from './App.tsx';                    // Import the main App component                         
import { store } from './app/store';            // Import the Redux store
import { Provider } from 'react-redux';         // Import Redux Provider to pass the store

// Mounting point for the App and pass prop msalInstance to App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>                            {/* Enables additional checks in development mode */}
    <Provider store={store}>                    {/* Redux store provider */}
      <App />                                   {/* Rendering the main App component */}
    </Provider>
  </React.StrictMode>
);
