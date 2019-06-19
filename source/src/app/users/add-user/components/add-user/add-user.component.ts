import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pc-add-user',
  styleUrls: ['./add-user.component.scss'],
  template: `
    <div>
      <form novalidate id="userForm" [formGroup]="userForm">
        <div class="form-content" fxLayout="column" fxLayoutAlign="center center">
          <div class="DivWidth70">
            <div class="row">
              <div class="col-md-6">
                <div class="input-field">
                  <label for="txtUserName">User Name</label>
                  <input
                    matInput
                    id="txtUserName"
                    formControlName="login"
                    placeholder="User Name"
                    type="text"
                    [(ngModel)]="login"
                    required
                    autocomplete="off"
                  />
                  <div
                    class="fielderror"
                    *ngIf="!userForm.controls['login'].pristine && userForm.controls['login'].hasError('required')"
                  >
                    User Name is required
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="!userForm.controls['login'].pristine && userForm.controls['login'].hasError('minlength')"
                  >
                    User Name must have minimum 3 characters
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="!userForm.controls['login'].pristine && userForm.controls['login'].hasError('maxlength')"
                  >
                    User Name must not exceed 100 characters
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['login'].pristine && userForm.controls['login'].hasError('duplicateLogin')
                    "
                  >
                    User Name already exists
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-field">
                  <label for="txtEmail">Email</label>
                  <input
                    matInput
                    id="txtEmail"
                    formControlName="email"
                    placeholder="Email"
                    type="text"
                    email
                    [(ngModel)]="email"
                    required
                    autocomplete="off"
                  />
                  <div
                    class="fielderror"
                    *ngIf="!userForm.controls['email'].pristine && userForm.controls['email'].hasError('required')"
                  >
                    Email is required
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="!userForm.controls['email'].pristine && userForm.controls['email'].hasError('pattern')"
                  >
                    Email not in valid format
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['email'].pristine && userForm.controls['email'].hasError('duplicateEmail')
                    "
                  >
                    Email already exists
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="input-field">
                  <label for="txtFirstName">First Name</label>
                  <input
                    matInput
                    id="txtFirstName"
                    formControlName="firstname"
                    placeholder="First Name"
                    type="text"
                    [(ngModel)]="firstname"
                    required
                    autocomplete="off"
                  />
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['firstname'].pristine && userForm.controls['firstname'].hasError('required')
                    "
                  >
                    First Name is required
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['firstname'].pristine && userForm.controls['firstname'].hasError('minlength')
                    "
                  >
                    First Name must have minimum 1 character
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['firstname'].pristine && userForm.controls['firstname'].hasError('maxlength')
                    "
                  >
                    First Name must not exceed 50 characters
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-field">
                  <label for="txtLastName">Last Name</label>
                  <input
                    matInput
                    id="txtLastName"
                    formControlName="lastname"
                    placeholder="Last Name"
                    type="text"
                    [(ngModel)]="lastname"
                    required
                    autocomplete="off"
                  />
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['lastname'].pristine && userForm.controls['lastname'].hasError('required')
                    "
                  >
                    Last Name is required
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['lastname'].pristine && userForm.controls['lastname'].hasError('minlength')
                    "
                  >
                    Last Name must have minimum 1 character
                  </div>
                  <div
                    class="fielderror"
                    *ngIf="
                      !userForm.controls['lastname'].pristine && userForm.controls['lastname'].hasError('maxlength')
                    "
                  >
                    Last Name must not exceed 50 characters
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6"></div>
              <div class="col-md-6"></div>
            </div>
          </div>
        </div>
      </form>
      <div class="extraFormSpace"></div>
    </div>
    <div class="ocwindowfooter">
      <oc-footer>
        <div class="ocleftalign">
          <oc-button-action buttonText="Cancel" (click)="close()"></oc-button-action>
        </div>
        <div class="ocrightalign">
          <oc-button-action
            buttonText="Create User"
            [disabled]="userForm.invalid"
            (click)="saveUser()"
          ></oc-button-action>
        </div>
      </oc-footer>
    </div>
  `,
})
export class AdduserComponent implements OnInit {
  @Output() addSaveUserDetails = new EventEmitter();

  userForm: FormGroup;

  @Input() login: string;
  @Input() firstname: string;
  @Input() lastname: string;
  @Input() email: string;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.userForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
        ],
      ],
    });
  }

  saveUser() {
    this.addSaveUserDetails.emit(this.userForm);
  }
  close() {}
}
