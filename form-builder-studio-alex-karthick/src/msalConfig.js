export const msalConfig = {
    auth: {
        clientId: '0da22cba-df03-42f1-979d-60d9681c493a',
        authority: 'https://login.microsoftonline.com/04aee3cb-4ce8-410a-8596-5e52728fc79a',
        redirectUri: "/form-builder-studio/blank", 
        postLogoutRedirectUri: "/" 
    }
}   

export const loginRequest = {
    scopes: ['User.Read', 'profile', 'openid', 'email']
}

export const formBuilderApiRequest = {
    scopes: ['api://2e825532-5a1a-401b-93c0-db10a48cdf75/All']
}

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
}
