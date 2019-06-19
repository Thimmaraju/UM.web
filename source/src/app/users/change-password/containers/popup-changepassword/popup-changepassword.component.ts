import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { environment as env } from '@env/environment';

import { UserLabels } from '@app/users/models/userlabels.model';
import { IPopupWindowContainer } from '@app/shared';
import { ChangepasswordComponent } from '@app/users/change-password/components/changepassword/changepassword.component';
import { PasswordValue, ChangePassword } from '@app/users/models/policy.interface';
import { PasswordPolicy } from '@app/users/models/policy.interface';

// Service
import { UsersService } from '@app/users/services/users.service';
import { AuthService } from '@app/core/authentication/auth/auth.service';
import { ToastService } from '@app/shared';
import { ChangePasswordService } from '@app/users/shared/services/change-password.service';

@Component({
  selector: 'pc-popup-changepassword',
  styleUrls: ['./popup-changepassword.component.scss'],
  template: `
  <oc-popupwindow-layout
    [windowInfo]="windowInfo"
    [windowFilter]="windowFilter"
    [windowFooter]="windowFooter">
    <ng-container class="ocwindowheader">
      <div>Change Password</div>
    </ng-container>
    <ng-container class="ocwindowcontent">
        <pc-changepassword #passwordDetails [oktapasswordPolicy]="passwordPolicy"></pc-changepassword>
    </ng-container>
    <ng-container class="ocwindowfooter">
      <oc-footer>
        <div class="ocleftalign">
        </div>
        <div class="ocrightalign">
          <oc-button-action buttonText="Cancel" (click) ="close()"></oc-button-action>
          <oc-button-action buttonText="Save" [disabled]="passwordDetails.changePasswordForm.invalid" (click)="changeUserPassword()"></oc-button-action>
        </div>
      </oc-footer>
    </ng-container>
</oc-popupwindow-layout>
  `,
})
export class PopupChangepasswordComponent implements OnInit, IPopupWindowContainer {

  @Output() dismiss = new Subject<boolean>();
  @ViewChild('passwordDetails') passwordDetails: ChangepasswordComponent;

  changePasswordForm: FormGroup;
  userLabel = new UserLabels();

  popWindowLayout: any;
  toasterTimeout = env.toasterTimeout;
  data: any;

  // Popup Window Properties
  windowInfo = false;
  windowFilter = false;
  windowFooter = false;

  // password objects
  changPassword: ChangePassword;
  oldPassword: PasswordValue;
  newPassword: PasswordValue;
  username: string;
  userId: string;
  passwordPolicy: PasswordPolicy;

  claimstoken: any;

  constructor(
    private _userService: UsersService,
    private _authService: AuthService,
    private _toastservice: ToastService,
    private _chngpwdService: ChangePasswordService
  ) { }

  ngOnInit() {
    this.windowInfo = this.data.windowLayout.info;
    this.windowFilter = this.data.windowLayout.filter;
    this.windowFooter = this.data.windowLayout.footer;

    this.claimstoken = this._authService.decodeToken();
    this.getPasswordPolicies();

  }

  // get Okta Default Password policies and change the form validators accordingly
  getPasswordPolicies(): any {
    this._chngpwdService.getPasswordPolicy().subscribe((result: PasswordPolicy) => {
      this.passwordPolicy = result;
    });
  }

  // on save, execute the change password operation
  changeUserPassword() {
    this.userId = this.claimstoken.sub; // get userid from the token
    const pwdDetails: any = this.passwordDetails.changePasswordForm.getRawValue();

    if (this.userId) {

      this.changPassword = {
        id: this.userId,
        oldPassword: {
          value: pwdDetails.currentpassword
        },
        newPassword: {
          value: pwdDetails.newpassword
        }
      };

      this._chngpwdService.changeUserPassword(this.changPassword)
      .subscribe(
        (result) => {
          this.close();
          this._toastservice.success('success', this.userLabel.CHANGE_PASSWORD_SUCCESS, { timeout: this.toasterTimeout, pauseOnHover: true });
        },
        (error) => {
          this.close();
          this._toastservice.error('fail', this.userLabel.CHANGE_PASSWORD_FAIL, { timeout: this.toasterTimeout, pauseOnHover: true });
        }
      );
    } else {
      this.close();
      this._toastservice.error('fail', this.userLabel.CHANGE_PASSWORD_TROUBLE, );
    }

  }

  close() {
    this.dismiss.next(true);
  }

}
