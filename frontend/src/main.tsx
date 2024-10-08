import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  
import User from './features/user/User.tsx';
import { store } from './app/store';            // Import the Redux store
import { Provider } from 'react-redux';         // Import Redux Provider to pass the store
import ProductTable from './components/productTable.tsx';

// Mounting point for the App and pass prop msalInstance to App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>                            {/* Enables additional checks in development mode */}
    <Provider store={store}>                    {/* Redux store provider */}
      <User />
      <ProductTable />                          {/* Rendering the main productTable component */}
    </Provider>
  </React.StrictMode>
);
