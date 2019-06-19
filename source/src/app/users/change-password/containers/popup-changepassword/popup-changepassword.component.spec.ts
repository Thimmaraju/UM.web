import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from '@app/core/authentication/auth/auth.service';
import { ChangePasswordService } from '@app/users/shared/services/change-password.service';

import {
  PopupWindowModule,
  ButtonToggleModule,
  ButtonActionModule,
  ToastModule,
  PopupWindowProperties,
} from 'webcorecomponent-lib';
import { ToastService, PopupWindowService, LayoutModule, FooterModule } from 'webcorecomponent-lib';
import { FormBuilder } from '@angular/forms';

import { PopupChangepasswordComponent } from './popup-changepassword.component';
import { ChangepasswordComponent } from '@app/users';
import { PasswordPolicy } from '@app/users/models/policy.interface';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('PopupChangepasswordComponent', () => {
  let component: PopupChangepasswordComponent;
  let fixture: ComponentFixture<PopupChangepasswordComponent>;
  let injector: TestBed;
  let chngservice: ChangePasswordService;
  let authService: AuthService;
  // let httpMock: HttpTestingController;

  const formBuilder: FormBuilder = new FormBuilder();

  const mockclaims = {
    uname: 'foo',
    sub: '00ujpca0qtX0HoNe30h7',
  };

  const mockAuthService = {
    decodeToken: () => {
      return mockclaims;
    },
  };

  const mockToastService = {};

  const mockPasswordPolicy = {
    minLength: 9,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumber: 1,
    minSymbol: 1,
    excludeUserName: true,
    excludeAttributes: [],
  };

  const mockchangepassword = {
    id: '0w21bhb',
    oldPassword: 'Password@123',
    newPassword: 'Password-123',
  };

  const mockChangePasswordService = {
    getPasswordPolicy: () => {
      return of(mockPasswordPolicy);
    },

    changeUserPassword: () => {
      return of('');
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupChangepasswordComponent, ChangepasswordComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        ToastModule,
        LayoutModule,
        FooterModule,
        ButtonActionModule,
        ButtonToggleModule,
        PopupWindowModule,
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        ToastService,
        PopupWindowService,
        { provide: FormBuilder, useValue: formBuilder },
        { provide: AuthService, useValue: mockAuthService },
        { provide: chngservice, useValue: mockChangePasswordService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupChangepasswordComponent);
    const popWindowLayout = { info: false, filter: false, footer: true };
    const properties = new PopupWindowProperties(); // Set properties
    properties.data = {
      windowLayout: popWindowLayout,
    };
    fixture.componentInstance.data = properties.data;

    component = fixture.componentInstance;
    fixture.detectChanges();

    injector = getTestBed();
    authService = fixture.debugElement.injector.get(AuthService);
    chngservice = fixture.debugElement.injector.get(ChangePasswordService);
    component.passwordPolicy = mockPasswordPolicy;
    component.passwordDetails.changePasswordForm = formBuilder.group({
      currentpassword: [''],
      newpassword: [''],
      confirmpassword: [''],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    spyOn(mockAuthService, 'decodeToken').and.returnValue(mockclaims);
    spyOn(component, 'getPasswordPolicies');
    component.ngOnInit();
    expect(component.claimstoken).toEqual(mockclaims);
    // expect(component.passwordPolicy).toEqual(mockPasswordPolicy);
  });

  it('should get password policies', () => {
    spyOn(mockChangePasswordService, 'getPasswordPolicy').and.returnValue(mockPasswordPolicy);
    component.getPasswordPolicies();
    expect(component.passwordPolicy).toEqual(mockPasswordPolicy);
  });
});
