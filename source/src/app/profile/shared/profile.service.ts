import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoUtil, CognitoCallback, LoggedInCallback, Callback } from '@app/core';
import { ChangePassword } from '../models/change-password.interface';

@Injectable()
export class ProfileService {

  constructor(private _cognitoUtil: CognitoUtil) { }

  changePassword(newPassword: ChangePassword, callback: Callback) {
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
