import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { ChangePassword } from '../../models/change-password.interface';
import { SharedModule } from '@app/shared';

import { ProfileChangePasswordComponent } from './profile-changepassword.component';

describe('Profile Change Password', () => {

  let changePassword: ChangePassword;
  const data = {
    ExistingPassword: '',
    Password: '',
  };
  changePassword = data;

  let component: ProfileChangePasswordComponent;
  let fixture: ComponentFixture<ProfileChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
      declarations: [
        ProfileChangePasswordComponent
      ]
    });

    fixture = TestBed.createComponent(ProfileChangePasswordComponent);
    component = fixture.componentInstance;
  });

  it('should init form', () => {
    spyOn(component, 'initizeForm').and.callThrough();
    component.ngOnInit();
    expect(component.initizeForm).toHaveBeenCalled();
  });

  it('should not emit an event if the form is not valid', () => {
    spyOn(component.newPassword, 'emit').and.callThrough();
    component.ngOnInit();
    component.onNewPassword();
    expect(component.newPassword.emit).not.toHaveBeenCalled();
  });
  it('should emit an event if the form is valid', () => {
    spyOn(component.newPassword, 'emit').and.callThrough();
    component.ngOnInit();
    component.changePasswordForm.controls['ExistingPassword'].setValue('Foo');
    component.changePasswordForm.controls['Password'].setValue('Bar');
    component.onNewPassword();
    expect(component.newPassword.emit).toHaveBeenCalled();
  });
  it('if reset form is selected', () => {
    component.initizeForm();
    component.ngOnChanges();
    expect(component.changePasswordForm.touched).toBeFalsy();
  });

});
