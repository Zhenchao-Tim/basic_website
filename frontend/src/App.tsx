import { useState } from 'react'
import './App.css'

import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { EventType, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';
import { b2cPolicies, protectedResources, loginRequest } from './authConfig.ts'; 

type AppProps = {                         
  msalInstance: IPublicClientApplication  
} 

// you need to login/logout
  // you can use function to implenement login/logout component
// LoginComponent handles the login and logout logic for the application
function LoginComponent() {                          
  const { instance, inProgress } = useMsal(); // Accessing MSAL instance and interaction status
  const activeAccount = instance.getActiveAccount(); // Getting the currently active account

  // Function to handle login via a popup
  const handleLoginRedirect = () => {   
    instance.loginPopup({ // Initiating login via popup //@azure/msal-react -> useMsal() -> instance -> oginPopup
      ...loginRequest, // Spreading the login request configuration
    })
    .catch(e => { // Handling errors
      console.error(e);
    }); 
  };

  // Function to handle logout via a popup
  const handleLogoutRedirect = () => {  
    instance.logoutPopup({ // Initiating logout via popup
      mainWindowRedirectUri: '/', // Redirect URI after logout
    })
    .catch(e => { // Handling errors
      console.error(e);
    }); 
  };

  // Function to handle profile editing
  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) { // Check if no interaction is currently in progress
      // @ts-ignore: Ignoring TypeScript error for the following line
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile); // Redirect for token acquisition
    }
  };
  return (
    <>
      <AuthenticatedTemplate>
        {/* Rendered if the user is authenticated */}
        <div>User logged in: {activeAccount?.environment}</div>
        <button onClick={handleLogoutRedirect}>Sign Out</button>
        <button onClick={handleProfileEdit}>Edit Profile</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {/* Rendered if the user is not authenticated */}
        <button onClick={handleLoginRedirect}>Sign In</button>
      </UnauthenticatedTemplate>
    </>
  );
}

// Main App component that receives msalInstance as a prop
function App(props: AppProps) {
  const [count, setCount] = useState(0); // State to manage a simple counter

  return (  //JSX
  <MsalProvider instance={props.msalInstance}> {/* Providing the MSAL instance to child components */}
    <LoginComponent /> {/* Rendering the LoginComponent for authentication UI */}
    <h1>SEM</h1>
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count} {/* Displaying the current count */}
      </button>
    </div>
  </MsalProvider>
  );
}

export default App
