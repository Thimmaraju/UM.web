const packageJson = require('../../package.json');
const url = 'https://0y2qtlibo9.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = 'https://1tgj3jt6t7.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://yypgaewd3d.execute-api.us-west-1.amazonaws.com/Prod/'; // TODO Replace?
const protocol = window.location.protocol;
const host = window.location.hostname;
const port = window.location.port;
const baseUrl = `${protocol}//${host}:${port}/`;
const loginUrl = 'https://0y2qtlibo9.execute-api.us-west-2.amazonaws.com/Prod/';
const Timeout = 2000;

export const environment = {
  production: false,
  region: 'us-west-2',
  userPoolId: 'us-west-2_f2wYF45TI',
  clientId: '16gnmeflutfr5i4vhmd4mvohh7',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:103026fb-3e9d-4386-83b8-53761ab68c1e',
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
      nonce: 'UnitTest1',
      idpLogout: 'https://omnicellexternal.oktapreview.com/oauth2/ausibjay7uSpiuJbs0h7',
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
