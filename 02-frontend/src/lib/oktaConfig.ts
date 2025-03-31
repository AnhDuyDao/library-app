import { features } from "process";

export const oktaConfig = {
    clientId: `${process.env.REACT_APP_OKTA_CLIENT_ID}`,
    issuer: `https://${process.env.REACT_APP_OKTA_ISSUER}/oauth2/default`,
    redirectUri: `${process.env.REACT_APP_URL}/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    language: "en",
    features: { registration: true }
}
