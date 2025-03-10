export const oktaConfig = {
    clientId: '0oang9c05pmeVuFQ35d7',
    issuer: 'https://dev-15866290.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    language: "en",
}