const packageJson = require('../../package.json');
const url = 'https://2hrdw74yj7.execute-api.us-west-2.amazonaws.com/Prod/';
const userUrl = ' https://jdblnbd5v5.execute-api.us-west-2.amazonaws.com/stage01/';
const orgviewurl = 'https://yypgaewd3d.execute-api.us-west-1.amazonaws.com/Prod/';
const protocol = window.location.protocol;
const host = window.location.hostname;
const baseUrl = `${protocol}//${host}/`;
const loginUrl = 'https://2hrdw74yj7.execute-api.us-west-2.amazonaws.com/Prod/';
const Timeout = 2000;
export const environment = {
  production: true,
  region: 'us-west-2',
  userPoolId: 'us-west-2_GsLufe7C8',
  clientId: '53ll1p0c9hjg5cp1pl9a7t4sq6',
  cognito_idp_endpoint: '',
  identityPoolId: 'us-west-2:54eeaa0c-dd02-41cb-a610-2c2e8b3044e',
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
    clientId: '0oa16hlqklHZStG9S297',
    scope: ['openid', 'profile'],
    responseType: 'id_token',
    idp: {
      idpCallbackUri: `${baseUrl}auth/login/idpcallback`,
      responseMode: 'fragment',
      state: 'LOGIN',
      nonce: 'ChangeMeProd',
      idpLogout: 'https://omnicellexternal.okta.com/oauth2/ausibjay7uSpiuJbs0h7', // TODO Replace?
      idpLogoutLanding: `&post_logout_redirect_uri=${baseUrl}auth/logged-out`,
    },
  },
};
