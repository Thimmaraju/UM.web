import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CognitoUtil, Callback } from '@app/core';
import { ToasterService } from '@app/shared';
import { ChangePassword } from '../models/change-password.interface';
import { ProfileService } from '../shared/profile.service';

@Component({
  selector: 'pc-profile-viewer',
  styleUrls: ['profile-viewer.component.scss'],
  template: `
    <div id="ProfileContainer" fxLayout="row" class="container">
      <div fxFlex="1 1 25%"></div>
      <div fxFlex="1 1 50%">
        <pc-profile-header [username]="user.username" [email]="email?.Value" [userRole]="userRole?.Value">
        </pc-profile-header>
        <pc-profile-changepassword [errorMessage]="errorMessage" [resetForm]="resetForm" (newPassword)="onHandleNewPassword($event)">
          <h4>Update password</h4>
          <label for="ExistingPassword">Current Password</label>
        </pc-profile-changepassword>
      </div>
      <div fxFlex="1 1 25%"></div>
    </div>
  `
})
export class ProfileViewerComponent implements OnInit, Callback {
  userName: Observable<string>;
  resetForm = false;
  user: any;
  errorMessage: string;
  userAttributes: any[];
  email: any;
  userRole: any;

  constructor(
    private _profileService: ProfileService,
    private _cognitoUtil: CognitoUtil,
    private _toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.user = this._cognitoUtil.getCurrentUser();
    this._cognitoUtil.getUserAttributes(this);
  }

  onHandleNewPassword(event: ChangePassword) {
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
