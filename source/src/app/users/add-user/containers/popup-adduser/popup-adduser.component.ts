import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { environment as env } from '@env/environment';

import { UserLabels } from '@app/users/models/userlabels.model';
import { IPopupWindowContainer } from '@app/shared';
import { User } from '@app/users/models/User.interface';
import { OktaUserProfile } from '@app/users/models/okta-userprofile.interface';

import { AdduserComponent } from '@app/users';

// Service
import { UsersService } from '@app/users/services/users.service';
import { ToastService } from '@app/shared';

@Component({
  selector: 'pc-popup-adduser',
  styleUrls: ['./popup-adduser.component.scss'],
  template: `
  <oc-popupwindow-layout
    [windowInfo]="windowInfo"
    [windowFilter]="windowFilter"
    [windowFooter]="windowFooter">
    <ng-container class="ocwindowheader">
      <div>New User</div>
    </ng-container>
    <ng-container class="ocwindowcontent">
        <pc-add-user #adduserDetails (addSaveUserDetails)="saveUser($event)">
        </pc-add-user>
    </ng-container>
</oc-popupwindow-layout>
`,
})
export class PopupAdduserComponent implements OnInit, IPopupWindowContainer {

  @Output() dismiss = new Subject<boolean>();
  @ViewChild('adduserDetails') adduserDetails: AdduserComponent;

  popWindowLayout: any;
  toasterTimeout = env.toasterTimeout;
  data: any;

  // Popup Window Properties
  windowInfo = false;
  windowFilter = false;
  windowFooter = false;

  userForm: FormGroup;
  userLabel = new UserLabels();

  user$: User;
  userProfile$: OktaUserProfile;
  errorSummary$: string;

  constructor(
    private _userService: UsersService,
    private _toastservice: ToastService
  ) { }

  ngOnInit() {
    this.windowInfo = this.data.windowLayout.info;
    this.windowFilter = this.data.windowLayout.filter;
    this.windowFooter = this.data.windowLayout.footer;
  }

  saveUser(event: any) {

    this.userProfile$ = {
      firstName: event.value.firstname.trim(),
      lastName: event.value.lastname.trim(),
      email: event.value.email.toLowerCase(),
      login: event.value.login.trim()
    };

    this.user$ = {
      profile: this.userProfile$
    };

    this.checkDuplicateEmail(this.userProfile$.email);
  }

  // check if an email exists in the system already
  checkDuplicateEmail(email: string) {
    this._userService.checkEmailexists(email)
      .subscribe(
        (result: boolean) => {
          if (result) {
            this.adduserDetails.userForm.get('email').setErrors({'duplicateEmail': true});
          } else {
            this.checkDuplicateUsername(this.userProfile$.login);
          }
        },
        (error) => {
          this.close();
          this._toastservice.error('failure', this.userLabel.ADD_USER_FAILURE, { timeout: this.toasterTimeout, pauseOnHover: true });
        });
  }

  // check if an user name exists in the system already
  checkDuplicateUsername(username: string) {
    this._userService.getUser(username)
      .subscribe(
        (result: User) => {
          if (result.id === null || result.id === '') {
            this.createUserProfile(this.user$);
          } else {
            this.adduserDetails.userForm.get('login').setErrors({'duplicateLogin': true});
          }
        },
        (error) => {
          this.close();
          this._toastservice.error('failure', this.userLabel.ADD_USER_FAILURE, { timeout: this.toasterTimeout, pauseOnHover: true });
        });
  }

  // create user profile in the okta after all validations
  // if 'result' has errorCauses then check for the error, else show the success toaster
  createUserProfile(user: User) {
    this._userService.createUser(user)
      .subscribe(
        (result: User) => {
          if (result.errorCauses != null && result.errorCauses.length > 0) {
            this.errorSummary$ = result.errorCauses[0].errorSummary;

            if (this.errorSummary$.includes('login')) {
              this.adduserDetails.userForm.get('login').setErrors({'duplicateLogin': true});
            }

            if (this.errorSummary$.includes('email')) {
              this.adduserDetails.userForm.get('email').setErrors({'duplicateEmail': true});
            }
          } else {
            this.close();
            this._toastservice.success('success', this.userLabel.ADD_USER_SUCCESS, { timeout: this.toasterTimeout, pauseOnHover: true });
          }
        },
        (error) => {
          console.log(error);
          this._toastservice.error('failure', this.userLabel.ADD_USER_FAILURE, { timeout: this.toasterTimeout, pauseOnHover: true });
        }
      );
  }

  close() {
    this.dismiss.next(true);
  }
}
