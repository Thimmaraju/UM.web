const packageJson = require('../../package.json');
const url = 'https://clgi4pzmqd.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = ' https://c1hsbbflvi.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://hghxzdj41h.execute-api.us-west-2.amazonaws.com/Prod/';
const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = `${protocol}//${host}:4200/`;
const loginUrl = 'https://clgi4pzmqd.execute-api.us-west-2.amazonaws.com/Prod/';
const Timeout = 2000;

export const environment = {
  production: false,
  region: 'us-west-2',
  userPoolId: 'us-west-2_tVZp3RyuT',
  clientId: '6stuefivi50t9sc7o4lt07lis7',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:afa13b7a-0794-4bc9-be2b-2186117c7a3c',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  apiHost: url,
  orgviewHost: orgviewurl,
  loginHost: loginUrl,
  userHost: userUrl,
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
