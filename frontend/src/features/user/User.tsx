import { b2cPolicies, loginRequest } from '../../authConfig.ts'; 
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import MsalProp from '../../dataModel/MsalProp.ts';
import { InteractionStatus, SilentRequest } from '@azure/msal-browser'

// use redux
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { setAccessToken, setClaims, selectAccessToken, selectClaims } from './userSlice'

import { useEffect } from 'react';

import App from '../../components/App.tsx';
import { Link } from 'react-router-dom';
import "./User.css"

function LoginComponent () {                        
    const {instance, inProgress} = useMsal();   // unpack Msal into 2 object
    const accessToken = useAppSelector(selectAccessToken);  // read accessToken
    const claims = useAppSelector(selectClaims);
    const dispatch = useAppDispatch();  // ready for undate datas in different states

    // use redux so use useEffect
    useEffect(() => {
        const activeAccount = instance.getActiveAccount();
        if (activeAccount) {
            dispatch(setClaims(activeAccount?.idTokenClaims));
        }

        if (accessToken == null)
        {
          const accessTokenRequest: SilentRequest = {
            scopes: loginRequest.scopes,
            account: activeAccount || undefined,
          };
          
          instance.initialize().then(() => {instance.acquireTokenSilent(accessTokenRequest)
          .then((result) => {
            // Acquire token silent success
            dispatch(setAccessToken(result.accessToken));
          });});
        }
    }, [accessToken, dispatch, instance]);

    // logic about login/logout
    const handleLoginRedirect = () => {   
        instance
            .loginPopup({...loginRequest,})
            .then(result => {
                dispatch(setAccessToken(result.accessToken));
                dispatch(setClaims(result.idTokenClaims));
            })                              
            .catch( e => {                  
                console.error(e);             
            });                             
    };   

    const handleLogoutRedirect = () => {  
        instance
            .logoutPopup({                  
                mainWindowRedirectUri: '/',  
            })                              
            .catch(e => {                   
                console.error(e);             
            });                             
    };          
    
    const handleProfileEdit = () => {
        if(inProgress === InteractionStatus.None) {
            // @ts-ignore
            instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
        }
    };

    return (
        <>
            <AuthenticatedTemplate>
                <div className="dropdown">
                    <button className="dropbtn">{claims?.name}</button>
                    <div className="dropdown-content">
                        <Link to="/inventory">Inventory</Link>
                        <a href="" onClick={handleProfileEdit}>Edit Profile</a>
                        <a href="" onClick={handleLogoutRedirect}>Sign Out</a>
                    </div>
                </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={handleLoginRedirect}> Sign In </button>
            </UnauthenticatedTemplate>
        </>
    )
}

function User(props: MsalProp){
    return (
        <MsalProvider instance={props.msalInstance}>
          <LoginComponent />
        </MsalProvider>
    )
}

export default User