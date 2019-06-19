// NOTE: there are no @types/okta typings...starting our own collection, consider contributing to TypeScript @types repository
// Based on this api: https://www.npmjs.com/package/@okta/okta-auth-js

declare namespace Okta {
  interface SignInWidget {
    tokenManager: TokenManager;
    session: WidgetSessionManager;

    renderEl(options: WidgetOptions, callback: (response: Response) => void): void;
    signOut(callback: () => void): void;
    remove(): void;
  }

  interface AuthService {
    tokenManager: TokenManager;
    token: Token;
    session: SessionManager;

    signIn(options: SignInOptions): Promise<Transaction>;
    signOut(): Promise<void>;
  }

  interface TokenManager {
    get(key: string): string;
    add(key: string, value: Object): void;
    clear(): void;
  }

  // this is callback based from the widget
  interface WidgetSessionManager {
    get(callback: (session: Okta.Session) => void): void;
  }

  // this manager is promise based from the auth manager
  interface SessionManager {
    get(): Promise<Session>;
  }

  interface Token {
    idToken: string;
    getWithoutPrompt(oauthOptions: OAuthOptions): Promise<Token>;
  }

  interface Session {
    status: string;
  }

  interface Response {
    status: string;
  }

  interface Transaction {
    status: string;
    sessionToken: string;
  }

  interface SignInOptions {
    username: string;
    password: string;
    sendFingerprint?: string;
  }

  interface WidgetOptions {
    /** The element id to render the widget in */
    el: string;
  }

  interface OAuthOptions {
    responseType: string;
    scopes: string[];
    sessionToken: string;
  }

  export interface Settings {
    clientId: string;
    scope: string[];
    responseType: string | string[];
    idp: IdpSettings;
  }

  interface IdpSettings {
    idpCallbackUri: string;
    responseMode: string;
    state: string;
    nonce: string;
  }
}
