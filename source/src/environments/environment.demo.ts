const packageJson = require('../../package.json');
const url = 'https://ub35sk6epg.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = 'https://lrr0ub3stc.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://hghxzdj41h.execute-api.us-west-2.amazonaws.com/Prod/'; // TODO Replace?
const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = `${protocol}//${host}/`;
const loginUrl = 'https://ub35sk6epg.execute-api.us-west-2.amazonaws.com/Prod/';
const Timeout = 2000;
export const environment = {
  production: false,
  region: 'us-west-2',
  userPoolId: 'us-west-2_Y8UV7vPvs',
  clientId: '7ms5912v5a07534sd1gu32joeg',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:d68acc00-2157-4470-b2d8-33f71e967ed7',
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
      nonce: 'ChangeMeDemo',
      idpLogout: 'https://omnicellexternal.oktapreview.com/oauth2/ausibjay7uSpiuJbs0h7',
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
