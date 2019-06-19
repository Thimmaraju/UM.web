const packageJson = require('../../package.json');
const url = 'https://vcudax9byg.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = 'https://mbu7ldz4hc.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://yypgaewd3d.execute-api.us-west-1.amazonaws.com/Prod/'; // TODO Replace?
const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = `${protocol}//${host}/`;
const loginUrl = 'https://vcudax9byg.execute-api.us-west-2.amazonaws.com/Prod/';
const Timeout = 2000;
export const environment = {
  production: false,
  region: 'us-west-2',
  userPoolId: 'us-west-2_sEI05sGXo',
  clientId: '24gat26bnpap2sjlg9ibk9lp7s',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:6efda85a-ac87-4e06-b023-d3bd9911216d',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  apiHost: url,
  userHost: userUrl,
  orgviewHost: orgviewurl,
  loginHost: loginUrl,
  version: {
    app: packageJson.version,
  },
  appName: {
    name: packageJson.name,
  },
  toasterTimeout: Timeout,
  okta: {
    clientId: '0oaibfqatd2CwJIcU0h7',
    scope: ['openid', 'profile'],
    responseType: 'id_token',
    idp: {
      idpCallbackUri: `${baseUrl}auth/login/idpcallback`,
      responseMode: 'fragment',
      state: 'LOGIN',
      nonce: 'ChangeMeStage',
      idpLogout: 'https://omnicellexternal.oktapreview.com/oauth2/ausibjay7uSpiuJbs0h7',
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
