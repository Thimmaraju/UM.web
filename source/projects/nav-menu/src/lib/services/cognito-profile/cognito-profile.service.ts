import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { LibCognitoService, LibCognitoCallback, LibLoggedInCallback, LibCallback } from '../lib-cognito/lib-cognito.service';
import { CognitoChangePassword } from '../../models/password-policy.interface';

@Injectable({
  providedIn: 'root'
})
export class CognitoProfileService {
  constructor(private _cognitoUtil: LibCognitoService) { }

  changePassword(newPassword: CognitoChangePassword, callback: LibCallback) {
    const user = this._cognitoUtil.getUserPool().getCurrentUser();

    const userData = {
      Username: user.getUsername(),
      Pool: this._cognitoUtil.getUserPool()
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.getSession(function () {
      cognitoUser.changePassword(newPassword.ExistingPassword, newPassword.Password, function (err, results) {
         callback.callbackWithMessage(err, results);
      });
    });
  }
}
