
export const Oktaconfig = {
  // check the live widget for sample usage
  // might want to move the features and widget config out
  // to an okta config file
  // https://developer.okta.com/live-widget/
  features: {
    router: true,
    registration: false,
    rememberMe: false,
  },
  helpLinks: {
    help: '#',
    forgotPassword: '#'
  },
  logo: ' ', // no logo, space char to prevent logo from showing
  language: 'en',
  i18n: {
    // all properties here:
    // https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/login.properties
    'en': {
      'primaryauth.title': 'User Management',
      'primaryauth.submit': 'Log on',
      'primaryauth.username.placeholder': 'User ID',
      'needhelp': ' ', // space char to hide the error text, default is shown, remove in css in component
      // errors
      'errors.E0000004': 'Please contact your hospital IT department to check the status of your account or to verify your password'
    }
  }
};
