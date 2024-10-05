import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser'
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { b2cPolicies, loginRequest, msalConfig } from '../../authConfig';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { setActiveAccount, setAccessToken, setClaims, selectUser } from './userSlice'

function LoginComponent () {                        
    const {instance, inProgress} = useMsal();           
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(state => state.user.accessToken);


    const handleLoginRedirect = () => {   
        instance
            .loginPopup({...loginRequest,})
            .then(result => {
                dispatch(setAccessToken(result.accessToken));
                dispatch(setActiveAccount(result.account));
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
                <div>User logged in: {user?.idTokenClaims?.name}</div>
                <p>Access Token: {accessToken}</p>
                <button onClick={handleLogoutRedirect}> Sign Out </button>
                <button onClick={handleProfileEdit}> Edit Profile </button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={handleLoginRedirect}> Sign In </button>
            </UnauthenticatedTemplate>
        </>
    )
}

function User(){
    const msalInstance : IPublicClientApplication = new PublicClientApplication(msalConfig);
    const dispatch = useAppDispatch()

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
        const result = msalInstance.getAllAccounts()[0];
        dispatch(setActiveAccount(result));
        dispatch(setClaims(result.idTokenClaims));
    }

    msalInstance.addEventCallback((event: EventMessage) => {
        if ((event.eventType === EventType.LOGIN_SUCCESS ||
                event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
                event.eventType === EventType.SSO_SILENT_SUCCESS) && event.payload) {
            const payload = event.payload as AuthenticationResult;
            dispatch(setActiveAccount(payload.account));
            dispatch(setClaims(payload.idTokenClaims));
            dispatch(setAccessToken(payload.accessToken));
         }
    });
    
    return (
        <MsalProvider instance={msalInstance}>
          <LoginComponent />
        </MsalProvider>
    )
}

export default User