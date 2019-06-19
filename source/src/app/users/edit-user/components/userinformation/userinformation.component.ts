import { Component, Input, EventEmitter, Output, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserLabels } from '@app/users';

@Component({
  selector: 'pc-userinformation',
  styleUrls: ['./userinformation.component.scss'],
  template: `
    <div class="userprofile-filter-container">
      <oc-radiobutton
        class="filters"
        [inline]="true"
        [columnSpacing]="true"
        [groupName]="'userInformation'"
        [range]="userInformationOptions"
        [selectedItem]="selectedItem"
        (selection)="onuserInformationChanged($event)"
      ></oc-radiobutton>
    </div>
    <div class="border"></div>
    <div class="radiobuttonsections">
      <div class="DivWidth80 userinfo" *ngIf="selectedItem === 'P'" style="height:250px;">
        <div class="col border-right" id="userInputDiv">
          <form id="editUserForm" [formGroup]="editUserForm">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="userUsernameInput">{{ labels.USERNAME }}</label>
                  <input
                    id="userUsernameInput"
                    [readonly]="true"
                    id
                    trim="blur"
                    type="text"
                    class="form-control"
                    formControlName="username"
                    autocomplete="off"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="userEmailInput">{{ labels.EMAIL }}</label>
                  <input
                    id="userEmailInput"
                    [readonly]="isDisabled()"
                    email
                    pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                    trim="blur"
                    type="email"
                    class="form-control"
                    formControlName="email"
                    autocomplete="off"
                    minlength="5"
                    required
                  />
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['email'].hasError('required')"
                  >
                    Email is required
                  </div>
                  <!-- <div class="controlerror" *ngIf="!editUserForm.pristine && editUserForm.controls['email'].hasError('email')">Email not in valid format</div>-->
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['email'].hasError('pattern')"
                  >
                    Email not in valid format
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="userFirstNameInput">{{ labels.FIRSTNAME }}</label>
                  <input
                    id="userFirstNameInput"
                    [readonly]="isDisabled()"
                    trim="blur"
                    type="text"
                    class="form-control"
                    formControlName="firstname"
                    autocomplete="off"
                    required
                  />
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['firstname'].hasError('required')"
                  >
                    First Name is required
                  </div>
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['firstname'].hasError('minlength')"
                  >
                    First Name should be atleast 1 character
                  </div>
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['firstname'].hasError('maxlength')"
                  >
                    First Name should not exceed 50 characters
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="userLastNameInput">{{ labels.LASTNAME }}</label>
                  <input
                    id="userLastNameInput"
                    trim="blur"
                    [readonly]="isDisabled()"
                    type="text"
                    class="form-control"
                    formControlName="lastname"
                    autocomplete="off"
                    required
                  />
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['lastname'].hasError('required')"
                  >
                    Last Name is required
                  </div>
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['lastname'].hasError('minlength')"
                  >
                    Last Name should be atleast 1 character
                  </div>
                  <div
                    class="error"
                    *ngIf="!editUserForm.pristine && editUserForm.controls['lastname'].hasError('maxlength')"
                  >
                    Last Name should not exceed 50 characters
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="DivWidth80" *ngIf="selectedItem === 'C'" style="height:250px;">
        <div class="col border-right" id="userInputDiv">
          <form id="editUserCredentialForm" [formGroup]="editUserCredentialForm">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group passwordreset">
                  <label for="userUsernameInput">{{ labels.USERPASSWORD }}</label>
                  <oc-button-action
                    style="display:block;"
                    mode="secondary"
                    [buttonText]="'Reset Password'"
                    (click)="onResetPasswordClicked()"
                    [disabled]="isNonOkta || (!isActive && status != labels.RESETPASSWORD_USER_STATUS)"
                  ></oc-button-action>
                  <!--<button (click)="onResetPasswordClicked()" class="btn reset form-control" [disabled]="isNonOkta">
                    {{ labels.USER_CREDENTIALS_PASSWORD_RESET }}
                  </button>-->
                </div>
              </div>
            </div>
          </form>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <div class="statuscol">
                  <label for="userStatus" class="statuslabel">{{ labels.STATUS }}</label>
                  <label class="currentStatus">{{ status }}</label>
                </div>
                <div class="togglebuttoncuserinfo">
                  <oc-button-toggle
                    *ngIf="!isNonOkta && (isActive || isSuspendedUser)"
                    [onLabel]="'Active'"
                    [offLabel]="'Deactivate'"
                    [(ngModel)]="isUserinActiveState"
                    (change)="onStatusChanged()"
                  >
                  </oc-button-toggle>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserinformationComponent implements OnInit, OnChanges {
  labels = new UserLabels();

  user = { firstname: '', lastname: '', email: '' };
  editUserForm: FormGroup;
  editUserCredentialForm: FormGroup;
  changePasswordonLogin = false;
  isUserinActiveState = false;
  selectedItem = 'P';
  @Input() isActive: boolean;
  @Input() currentuserId: string;
  @Input() status: string;
  @Input() isSuspendedUser: boolean;
  @Input() isNonOkta: boolean;
  @Output() changestatus = new EventEmitter();
  @Output() resetPassword = new EventEmitter();

  userInformationOptions = [
    { name: 'User Profile', displayField: 'Profile', valueField: 'P', showChanges: false, showWarning: false },
    { name: 'User Credentials', displayField: 'Credentials', valueField: 'C', showChanges: false, showWarning: false },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.selectedItem = 'P';
  }

  ngOnChanges() {
    if (this.isActive && !this.isNonOkta) {
      this.isUserinActiveState = true;
    } else if (this.isSuspendedUser && !this.isNonOkta) {
      this.isUserinActiveState = false;
    }
  }

  createForm() {
    this.editUserForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });

    this.editUserCredentialForm = this.formBuilder.group({});
  }

  onStatusChanged() {
    let isStatusChanged: boolean;
    if ((this.isUserinActiveState && !this.isActive) || (!this.isUserinActiveState && this.isActive)) {
      isStatusChanged = true;
    }
    this.changestatus.emit(isStatusChanged);
  }

  onResetPasswordClicked() {
    this.resetPassword.emit();
  }

  onuserInformationChanged(item: any) {
    this.selectedItem = item.value;
  }

  isDisabled(): boolean {
    return this.isNonOkta;
  }
}
