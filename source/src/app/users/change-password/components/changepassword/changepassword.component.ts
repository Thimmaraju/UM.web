import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PasswordPolicy } from '@app/users/models/policy.interface';

import { AuthService } from '@app/core/authentication/auth/auth.service';
import { ChangePasswordService } from '@app/users/shared/services/change-password.service';
import { Claims } from '@app/core/authentication/token/token.service';

@Component({
  selector: 'pc-changepassword',
  styleUrls: ['./changepassword.component.scss'],
  template: `
    <form novalidate [formGroup]="changePasswordForm">
      <div class="form-content" fxLayout="column" fxLayoutAlign="center center">
        <div class="DivWidth80">
          <div class="row">
            <div class="col-md-6">
              <div class="col">
                <div class="col-md-6">
                  <div class="input-field">
                    <label for="txtCurrentPassword">Current Password</label>
                    <input
                      matInput
                      id="txtCurrentPassword"
                      formControlName="currentpassword"
                      placeholder="Required"
                      type="password"
                      required
                      autocomplete="off"
                      trim="blur"
                    />
                    <mat-error *ngIf="formErrors.currentpassword">
                      {{ formErrors.currentpassword }}
                    </mat-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-field">
                    <label for="txtNewPassword">New Password</label>
                    <input
                      matInput
                      id="txtNewPassword"
                      formControlName="newpassword"
                      placeholder="Required"
                      type="password"
                      required
                      autocomplete="off"
                      trim="blur"
                      (blur)="validateUsernameInPassword()"
                      (keyup)="validateUsernameInPassword()"
                    />
                    <mat-error *ngIf="formErrors.newpassword">
                      {{ formErrors.newpassword }}
                    </mat-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-field">
                    <label for="txtConfirmPassword">Confirm Password</label>
                    <input
                      matInput
                      id="txtConfirmPassword"
                      formControlName="confirmpassword"
                      placeholder="Required"
                      type="password"
                      required
                      autocomplete="off"
                      trim="blur"
                      (blur)="validateUsernameInPassword()"
                      (keyup)="validatePasswords()"
                    />
                    <mat-error *ngIf="formErrors.confirmpassword">
                      {{ formErrors.confirmpassword }}
                    </mat-error>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="col">
                <h1>Omnicell Password Requirements</h1>
                <mat-progress-spinner color="primary" mode="indeterminate" value="50" *ngIf="!passwordPolicy$">
                </mat-progress-spinner>
                <div class="col-lg-6" *ngIf="passwordPolicy$">
                  <ul>
                    <li *ngIf="passwordPolicy$.minLength">
                      Password must be minimum {{ passwordPolicy$.minLength }} characters
                    </li>
                    <li *ngIf="passwordPolicy$.minLowerCase">
                      Password must have {{ passwordPolicy$.minLowerCase }} lowercase character
                    </li>
                    <li *ngIf="passwordPolicy$.minUpperCase">
                      Password must have {{ passwordPolicy$.minUpperCase }} uppercase character
                    </li>
                    <li *ngIf="passwordPolicy$.minNumber">
                      Password must have {{ passwordPolicy$.minNumber }} numeric value (0-9)
                    </li>
                    <li *ngIf="passwordPolicy$.minSymbol">
                      Password must have {{ passwordPolicy$.minSymbol }} symbol (e.g., !@#$%^&*)
                    </li>
                    <li *ngIf="!passwordPolicy$.minSymbol">Password must not include special symbol</li>
                    <li *ngIf="passwordPolicy$.excludeUserName">Password must not contain part of your username</li>
                    <li *ngIf="passwordPolicy$.excludeAttributes.includes('firstName')">
                      Password must not contain part of your First Name
                    </li>
                    <li *ngIf="passwordPolicy$.excludeAttributes.includes('lastName')">
                      Password must not contain part of your Last Name
                    </li>
                    <li>Passwords are case sensitive</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class ChangepasswordComponent implements OnInit, OnChanges {
  @Input() oktapasswordPolicy: PasswordPolicy;
  passwordPolicy$: PasswordPolicy;
  changePasswordForm: FormGroup;
  username: string;
  claimstoken: Claims;

  formErrors = {
    currentpassword: '',
    newpassword: '',
    confirmpassword: '',
  };

  validationMessages = {};
  passwordRegEx: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private chngPasswordService: ChangePasswordService
  ) {}

  ngOnInit() {
    this.createForm();
    this.claimstoken = this.authService.decodeToken();
    const uname = this.claimstoken.uname;
    this.username = uname.substring(0, uname.lastIndexOf('@')); // remove the customer entry from the 'uname'
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentpassword: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    });

    this.changePasswordForm.valueChanges.subscribe((data) => {
      this.onValueChanged();
    });

    this.onValueChanged(); // reset form validation messages
  }

  onValueChanged() {
    if (!this.changePasswordForm) {
      return;
    }

    const form = this.changePasswordForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  // get Okta Default Password policies and change the form validators accordingly
  getPasswordPolicies(): any {
    if (this.oktapasswordPolicy) {
      this.passwordPolicy$ = this.oktapasswordPolicy;
      this.createValidationMessages();

      const allowSpecialChars = this.passwordPolicy$.minSymbol;

      if (allowSpecialChars) {
        this.passwordRegEx =
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&-+;:,.?)(_]).{' + this.passwordPolicy$.minLength + ',}';
      } else {
        this.passwordRegEx = '(?=.*[A-Z])(?=.*d)[a-zA-Z0-9]{' + this.passwordPolicy$.minLength + ',}';
      }

      this.changePasswordForm.controls['newpassword'].setValidators([
        Validators.minLength(this.passwordPolicy$.minLength),
        Validators.pattern(this.passwordRegEx),
      ]);

      this.changePasswordForm.controls['confirmpassword'].setValidators([
        Validators.minLength(this.passwordPolicy$.minLength),
        Validators.pattern(this.passwordRegEx),
      ]);
    }
  }

  // create validation messages on the form controls
  createValidationMessages() {
    if (this.passwordPolicy$) {
      this.validationMessages = {
        currentpassword: {
          required: 'Current Password is required.',
          minlength: 'Current Password should be atleast ' + this.passwordPolicy$.minLength + ' characters.',
          pattern: 'Current Password is not in the password policy pattern.',
        },
        newpassword: {
          required: 'New Password is required.',
          minlength: 'New Password should be atleast ' + this.passwordPolicy$.minLength + ' characters.',
          excludeUsername: 'New Password should not contain username',
          pattern: 'New Password is not in the password policy pattern.',
          currentPassword: 'New Passowrd cannot be Current Password',
        },
        confirmpassword: {
          required: 'Confirm Password is required.',
          minlength: 'Confirm Password should be atleast ' + this.passwordPolicy$.minLength + ' characters.',
          mismatch: 'Password do not match.',
          excludeUsername: 'Confirm Password should not contain username',
          pattern: 'Confirm Password is not in the password policy pattern.',
          currentPassword: 'Cofirm Passowrd cannot be Current Password',
        },
      };
    }
  }

  validatePasswords() {
    const currPWD = this.changePasswordForm.get('currentpassword').value;
    const newPWD = this.changePasswordForm.get('newpassword').value;
    const confPWD = this.changePasswordForm.get('confirmpassword').value;

    if (this.passwordPolicy$.excludeUserName) {
      if (confPWD.toLowerCase().includes(this.username.toLowerCase())) {
        this.changePasswordForm.get('confirmpassword').setErrors({ excludeUsername: true });
        this.formErrors['confirmpassword'] = this.validationMessages['confirmpassword']['excludeUsername'];
      }
    }

    if (currPWD === newPWD) {
      this.changePasswordForm.get('confirmpassword').setErrors({ currentPassword: true });
      this.formErrors['confirmpassword'] = this.validationMessages['confirmpassword']['currentPassword'];
    }

    if (newPWD !== confPWD) {
      this.changePasswordForm.get('confirmpassword').setErrors({ mismatch: true });
      this.formErrors['confirmpassword'] = this.validationMessages['confirmpassword']['mismatch'];
    }
  }

  validateUsernameInPassword() {
    const currPWD = this.changePasswordForm.get('currentpassword').value;
    const newPWD = this.changePasswordForm.get('newpassword').value;

    if (currPWD === newPWD) {
      this.changePasswordForm.get('newpassword').setErrors({ currentPassword: true });
      this.formErrors['newpassword'] = this.validationMessages['newpassword']['currentPassword'];
    }

    if (this.passwordPolicy$.excludeUserName) {
      if (newPWD.toLowerCase().includes(this.username.toLowerCase())) {
        this.changePasswordForm.get('newpassword').setErrors({ excludeUsername: true });
        this.formErrors['newpassword'] = this.validationMessages['newpassword']['excludeUsername'];
      }
    }
  }

  ngOnChanges() {
    this.getPasswordPolicies();
  }
}
