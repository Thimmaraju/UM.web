import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ChangePassword } from '../../models/change-password.interface';

@Component({
  selector: 'pc-profile-changepassword',
  styleUrls: ['profile-changepassword.component.scss'],
  template: `
    <mat-card>
      <form id="ChangePasswordForm" [formGroup]="changePasswordForm" (submit)="onNewPassword()">
        <mat-card-title>
          <h4>Update password</h4>
        </mat-card-title>
        <mat-card-content>
          <div *ngIf="errorMessage" class="error">
            {{errorMessage}}
          </div>
          <div>
            <mat-form-field class="full-width">
              <label for="ExistingPassword">Current Password</label>
              <input matInput id="ExistingPassword" formControlName="ExistingPassword" type="password">
              <mat-error *ngIf="changePasswordForm.controls['ExistingPassword'].touched && changePasswordForm.controls['ExistingPassword'].hasError('required')">
                An existing password is <strong>required</strong>
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <label for="Password">New Password</label>
              <input matInput id="Password" formControlName="Password" type="password">
              <mat-error *ngIf="changePasswordForm.controls['Password'].touched && changePasswordForm.controls['Password'].hasError('required')">
                A new password is <strong>required</strong>
              </mat-error>
            </mat-form-field>

          </div>
        </mat-card-content>
        <mat-card-actions>
          <button id="ChangePasswordButton" type="submit" [disabled]="!changePasswordForm.valid" mat-raised-button color="accent">CHANGE PASSWORD</button>
        </mat-card-actions>
      </form>
    </mat-card>
  `})

export class ProfileChangePasswordComponent implements OnInit, OnChanges {

  changePasswordForm: any;
  changePasswordValue: ChangePassword;

  @Input()
  errorMessage: string;

  @Input()
  resetForm: boolean;

  @Output()
  newPassword: EventEmitter<ChangePassword> = new EventEmitter<ChangePassword>();

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initizeForm();
  }

  ngOnChanges() {
    if (this.resetForm) {
      this.changePasswordForm.reset();
    }
  }

  initizeForm() {
    this.changePasswordForm = this._formBuilder.group({
      'ExistingPassword': ['', Validators.required],
      'Password': ['', Validators.required],
    });
  }

  onNewPassword() {
    if (this.changePasswordForm.valid) {
      this.changePasswordValue = this.changePasswordForm.value;
      this.newPassword.emit(this.changePasswordValue);
    }
  }

}


