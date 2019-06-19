import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { environment as env } from '@env/environment';

import { UserLabels } from '../../../../models/labels.model';
import { OktaChangePasswordComponent } from '../../components/change-password/okta-change-password.component';
import { PasswordValue, ChangePassword, PasswordPolicy } from '../../../../models/password-policy.interface';

import { IPopupWindowContainer } from 'webcorecomponent-lib';
import { ToastService } from 'webcorecomponent-lib';

// Service
import { AuthServiceLib } from '../../../../services/auth/authentication.service';
import { ChangepasswordService } from '../../../../services/change-password/changepassword.service';

@Component({
  selector: 'pc-okta-popup-change-password',
  styleUrls: ['./okta-popup-change-password.component.scss'],
  template: `
  <oc-popupwindow-layout
      [windowInfo]="windowInfo"
      [windowFilter]="windowFilter"
      [windowFooter]="windowFooter">
      <ng-container class="ocwindowheader">
        <div>Change Password</div>
      </ng-container>
      <ng-container class="ocwindowcontent">
          <pc-okta-change-password #passwordDetails [oktapasswordPolicy]="passwordPolicy"></pc-okta-change-password>
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
export class OktaPopupChangePasswordComponent implements OnInit, IPopupWindowContainer {
  @Output() dismiss = new Subject<boolean>();
  @ViewChild('passwordDetails') passwordDetails: OktaChangePasswordComponent;

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
    private _authService: AuthServiceLib,
    private _toastservice: ToastService,
    private _chngpwdService: ChangepasswordService
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
