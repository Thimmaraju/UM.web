import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// models
import { CognitoChangePassword } from '../../../../models/password-policy.interface';

// services
import { LibCognitoService, LibCallback } from '../../../../services/lib-cognito/lib-cognito.service';
import { LibToasterService } from '../../../../services/lib-toaster/lib-toaster.service';
import { CognitoProfileService } from '../../../../services/cognito-profile/cognito-profile.service';

@Component({
  selector: 'pc-profileviewer',
  styleUrls: ['./profileviewer.component.scss'],
  template: `
  <div id="ProfileContainer" fxLayout="row" class="container">
  <div fxFlex="1 1 25%"></div>
  <div fxFlex="1 1 50%">
    <pc-profileheader [username]="user.username" [email]="email?.Value" [userRole]="userRole?.Value">
    </pc-profileheader>
    <pc-profile-change-password [errorMessage]="errorMessage" [resetForm]="resetForm" (newPassword)="onHandleNewPassword($event)">
      <h4>Update password</h4>
      <label for="ExistingPassword">Current Password</label>
    </pc-profile-change-password>
  </div>
  <div fxFlex="1 1 25%"></div>
</div>
  `,
})
export class ProfileviewerComponent implements OnInit, LibCallback {
  userName: Observable<string>;
  resetForm = false;
  user: any;
  errorMessage: string;
  userAttributes: any[];
  email: any;
  userRole: any;

  constructor(
    private _profileService: CognitoProfileService,
    private _cognitoUtil: LibCognitoService,
    private _toasterService: LibToasterService
  ) {}

  ngOnInit() {
    this.user = this._cognitoUtil.getCurrentUser();
    this._cognitoUtil.getUserAttributes(this);
  }

  onHandleNewPassword(event: CognitoChangePassword) {
    this._profileService.changePassword(event, this);
  }

  callback() {}

  callbackWithParam(results) {
    this.userAttributes = results;
    this.userRole = this.userAttributes.find(x => x.Name === 'custom:role');
    this.email = this.userAttributes.find(x => x.Name === 'email');
  }

  callbackWithMessage(err, results) {
    if (err) {
      this.errorMessage = err.message;
    } else {
      this.resetForm = true;
      this.errorMessage = '';
      this._toasterService.showToaster('Your password was successfully changed');
    }
  }
}
