import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PopupAdduserComponent } from './popup-adduser.component';
import { AdduserComponent } from '@app/users';
import { UsersService } from '../../../services/users.service';

import {
  PopupWindowModule, ButtonToggleModule, ButtonActionModule, ToastModule, PopupWindowProperties
} from 'webcorecomponent-lib';
import { ToastService, PopupWindowService, LayoutModule, FooterModule } from 'webcorecomponent-lib';
import { FormBuilder } from '@angular/forms';
import { User } from '@app/users';

describe('PopupAdduserComponent', () => {
  let component: PopupAdduserComponent;
  let fixture: ComponentFixture<PopupAdduserComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockUsersService = {
    createUser() {
      return {subscribe: () => {} };
    },
    checkEmailexists(email: string) {
      return { subscribe: () => {} };
    },
    checkDuplicateUsername(username: string) {
      return { subscribe: () => {} };
    }
  };

  const mockToastService = {
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToastModule, LayoutModule, FooterModule, ButtonActionModule, ButtonToggleModule, PopupWindowModule, HttpClientModule, HttpClientTestingModule],
      declarations: [ PopupAdduserComponent, AdduserComponent ],
      providers: [ToastService, PopupWindowService,
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UsersService, useValue: mockUsersService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAdduserComponent);
    const popWindowLayout = { info: false, filter: false, footer: false };
    const properties = new PopupWindowProperties(); // Set properties
    properties.data = {
      windowLayout: popWindowLayout
    };
    fixture.componentInstance.data = properties.data;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check duplicate email', () => {
    const spyObj = spyOn(mockUsersService, 'checkEmailexists');
    spyObj.and.returnValue(true);
    component.adduserDetails.userForm.get('email').setErrors({'duplicateEmail': true});
    expect(component.adduserDetails.userForm.hasError).toBeTruthy();
  });

  it('check duplicate username', () => {
    const userObj: User = {
      id: null,
      profile: {
        login: '',
        email: '',
        firstName: '',
        lastName: ''
      },
      status: ''
    };

    const spyObj = spyOn(mockUsersService, 'checkDuplicateUsername');
    spyObj.and.returnValue(userObj);
    component.adduserDetails.userForm.get('login').setErrors({'duplicateLogin': true});
    expect(component.adduserDetails.userForm.hasError).toBeTruthy();
  });
});
