const packageJson = require('../../package.json');
const url = '#{customAPIurl}';
const userUrl = '<customUserApiurl>';
const orgviewurl = '#{OrgViewApiUrl}';
const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = `${protocol}//${host}/`;
const loginUrl = '#{customAPIurl}';
const Timeout = 2000;
export const environment = {
  production: true,
  region: 'us-west-2',
  userPoolId: '#{cognitouserPoolId}',
  clientId: '#{cognitoclientId}',
  cognito_idp_endpoint: '',
  identityPoolId: '#{identityPoolId}',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  apiHost: url,
  userHost: userUrl,
  orgviewHost: orgviewurl,
  loginHost: loginUrl,
  version: {
    app: '#{Octopus.Release.Number}',
  },
  appName: {
    name: packageJson.name,
  },
  toasterTimeout: Timeout,
  okta: {
    clientId: '#{OktaClientId}',
    scope: ['openid', 'profile'],
    responseType: 'id_token',
    idp: {
      idpCallbackUri: `${baseUrl}auth/login/idpcallback`,
      responseMode: 'fragment',
      state: 'LOGIN',
      nonce: 'ChangeMeOktopus',
      idpLogout: 'https://#{oktaBaseUrl}/oauth2/#{authServerId}',
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
