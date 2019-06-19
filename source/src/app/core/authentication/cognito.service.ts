import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';

import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as awsservice from 'aws-sdk/lib/service';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';

export interface CognitoCallback {
  cognitoCallback(messsage: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
  callbackWithMessage(err: any, result: string): void;
}

@Injectable()
export class CognitoUtil {
  public static _REGION = env.region;

  public static _IDENTITY_POOL_ID = env.identityPoolId;
  public static _USER_POOL_ID = env.userPoolId;
  public static _CLIENT_ID = env.clientId;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoUtil._USER_POOL_ID,
    ClientId: CognitoUtil._CLIENT_ID
  };

  public cognitoCreds: AWS.CognitoIdentityCredentials;

  getUserPool() {
    if (env.cognito_idp_endpoint) {
      CognitoUtil._POOL_DATA.endpoint = env.cognito_idp_endpoint;
    }
    return new CognitoUserPool(CognitoUtil._POOL_DATA);
  }

  buildCognitoCreds(idTokenJwt: string) {
    let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;

    if (env.cognito_idp_endpoint) {
      url = env.cognito_idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
    }
    const logins: CognitoIdentity.LoginsMap = {};
    logins[url] = idTokenJwt;

    const params = {
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID /* required */,
      Logins: logins
    };

    const serviceConfigs: awsservice.ServiceConfigurationOptions = {};

    if (env.cognito_identity_endpoint) {
      serviceConfigs.endpoint = env.cognito_identity_endpoint;
    }
    const creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);

    this.setCognitoCreds(creds);

    return creds;
  }

  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  getUserAttributes(callback: Callback) {
    const user = this.getUserPool().getCurrentUser();

    const userData = {
      Username: user.getUsername(),
      Pool: this.getUserPool()
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.getSession(function() {
      cognitoUser.getUserAttributes(function(err, results) {
        if (results) {
          callback.callbackWithParam(results);
        }
      });
    });
  }

  getCognitoIdentity(): string {
    return this.cognitoCreds.identityId;
  }

  getIdToken(callback: Callback): void {
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function(err, session) {
        if (err) {
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          } else {
            callback.callbackWithParam(null);
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }
}
