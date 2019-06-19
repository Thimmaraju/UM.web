const packageJson = require('../../package.json');
const url = 'https://teg7wev413.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = 'https://odkth3x5m4.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://hghxzdj41h.execute-api.us-west-2.amazonaws.com/Prod/';
const protocol = window.location.protocol;
const host = window.location.hostname;
const port = window.location.port;
const baseUrl = `${protocol}//${host}:${port}/`;
const loginUrl = 'https://teg7wev413.execute-api.us-west-2.amazonaws.com/Prod/';

const Timeout = 2000;
export const environment = {
  production: false,
  region: 'us-west-2',
  userPoolId: 'us-west-2_SpZWXF8y6',
  clientId: 'rd8ngdgi9flsg270fi1rr4uid',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:86d8abf3-4b97-4ae0-8a78-340425ea8587',
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
      nonce: 'ChangeMeDev',
      idpLogout: 'https://omnicellexternal.oktapreview.com/oauth2/ausibjay7uSpiuJbs0h7',
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
