import * as msal from '@azure/msal-browser';
let clientId = '';
if (typeof window !== 'undefined') {
  clientId = window.NEXT_APP_CLIENT_ID;
}
let tenant = '';
if (typeof window !== 'undefined') {
  tenant = window.NEXT_APP_TENANT;
}
export const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenant}`,
    redirectUri: '/', // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};
export const loginRequest = {
  scopes: ['User.Read'],
}; // Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft-ppe.com/v1.0/me',
};
const msalInstance = new msal.PublicClientApplication(msalConfig);
export const callMsGraph = async () => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error('No active account, verify a user has ben signed');
  }
  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account,
  });
  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;
  headers.append('Authorization', bearer);
  const options = {
    method: 'GET',
    headers,
  };
  return fetch(graphConfig.graphMeEndpoint, options)
    .catch(err => err)
    .then(res => res.json());
};
export { msalInstance };