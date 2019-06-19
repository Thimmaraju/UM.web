import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from '@app/core/authentication/auth/auth.service';
import { UsersService } from '@app/users/services/users.service';
import { ChangePasswordService } from '@app/users/shared/services/change-password.service';
import { Claims } from '@app/core/authentication/token/token.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ChangepasswordComponent } from './changepassword.component';

describe('ChangepasswordComponent', () => {
  let component: ChangepasswordComponent;
  let fixture: ComponentFixture<ChangepasswordComponent>;
  let injector: TestBed;
  let authServ: AuthService;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockUsersService = {
    createUser() {
      return {subscribe: () => {} };
    }
  };
  const mockAuthService = {
    getUsername() {
      return {subscribe: () => {} };
    },
    decodeToken() {
      return { uname: '' };
    }
  };

  const mockChangePasswordService = {
    getPasswordPolicy() {
      return {subscribe: () => {} };
    }
  };

  const mockpasswordPolicy = {
    minLength: 10,
    minLowerCase: 4,
    minUpperCase: 1,
    minNumber: 2,
    minSymbol: 1,
    excludeUserName: true,
    excludeAttributes: [],
  };

  const mockchangepassword = {
    id: '0w21bhb',
    oldPassword: 'Password@123',
    newPassword: 'Password-123',
  };

  const mockclaims = {
    jti: 'ef84e478-7bb7-4f29-b06b-2e919f92e2a8',
    rti: 'ef84e478-7bb7-4f29-b06b-2e919f92e2a8',
    sub: '00ujq0upltTjE5PaJ0h7',
    given_name: 'User1',
    family_name: 'S',
    uname: 'user1',
    cs: '["GHS","GardenCity"]',
    cci: '',
    use: 'Refresh',
    roles: '["Strategist"]',
    apps: '["pc-workflow"]',
    nbf: '111',
    exp: '111',
    iat: '111',
    iss: 'http://pc.omnicell.com',
    aud: 'http://pc.omnicell.com',
    role: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangepasswordComponent ],
      imports: [ HttpClientModule, HttpClientTestingModule ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ChangePasswordService, useValue: mockChangePasswordService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepasswordComponent);
    component = fixture.componentInstance;
    component.changePasswordForm = formBuilder.group({
      currentpassword: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    });
    injector = getTestBed();
    authServ = injector.get(AuthService);
    const user = {} as Claims;
    user.uname = 'foobar';
    fixture.detectChanges();
    component.claimstoken = mockclaims;
    component.passwordPolicy$ = mockpasswordPolicy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.changePasswordForm.valid).toBeFalsy();
  });

  it('form fields validity', () => {
    const currentpassword = component.changePasswordForm.controls['currentpassword'];
    const newpassword = component.changePasswordForm.controls['newpassword'];
    const confirmpassword = component.changePasswordForm.controls['confirmpassword'];
    expect(currentpassword.valid).toBeFalsy();
    expect(newpassword.valid).toBeFalsy();
    expect(confirmpassword.valid).toBeFalsy();

    let errors = {};
    currentpassword.setValue('');
    newpassword.setValue('');
    confirmpassword.setValue('');
    errors = currentpassword.errors || newpassword.errors || confirmpassword.errors || {};
    expect(errors['required']).toBeTruthy();
  });
});
