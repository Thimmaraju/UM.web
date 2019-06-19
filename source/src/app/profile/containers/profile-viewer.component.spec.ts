import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CognitoUtil, CoreModule } from '@app/core';
import { ToasterService } from '@app/shared';
import { ProfileService } from '../shared/profile.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared';
import { ProfileViewerComponent } from './profile-viewer.component';
import { ProfileHeaderComponent } from '../components/profile-header/profile-header.component';
import { ProfileChangePasswordComponent } from '../components/profile-changepassword/profile-changepassword.component';
import { ChangePassword } from '../models/change-password.interface';

export class MockProfileService {
  public changePassword(newPassword: ChangePassword, callback: any): void {
    return;
  }
}

export class CognitoDataStub {
  public getCurrentUser(user: any): void {
    return;
  }
  public getUserAttributes(comp: any): void {
    return;
  }
}

let mockProfileService: MockProfileService;
let cognitoDataStub: CognitoDataStub;

describe('ProfileViewerComponent', () => {
  let component: ProfileViewerComponent;
  let fixture: ComponentFixture<ProfileViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, CoreModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfileViewerComponent, ProfileHeaderComponent, ProfileChangePasswordComponent],
      providers: [
        {
          provide: ProfileService,
          useClass: MockProfileService
        },
        {
          provide: CognitoUtil,
          useClass: CognitoDataStub
        },
        ToasterService,
        FormBuilder
      ]
    });

    fixture = TestBed.createComponent(ProfileViewerComponent);
    component = fixture.componentInstance;
    mockProfileService = fixture.debugElement.injector.get(ProfileService);
    cognitoDataStub = fixture.debugElement.injector.get(CognitoUtil);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get the current user', () => {
    spyOn(cognitoDataStub, 'getCurrentUser');
    component.ngOnInit();
    expect(cognitoDataStub.getCurrentUser).toHaveBeenCalled();
  });

  it('should call change password', () => {
    spyOn(mockProfileService, 'changePassword');
    component.onHandleNewPassword(null);
    expect(mockProfileService.changePassword).toHaveBeenCalled();
  });

  it('should set the phone and email', () => {
    const info = [
      {
        Name: 'custom:role',
        Value: 'strategist'
      },
      {
        Name: 'email',
        Value: 'test.email.com'
      }
    ];
    component.callbackWithParam(info);
    expect(component.userRole.Value).toBe('strategist');
    expect(component.email.Value).toBe('test.email.com');
  });

  it('should set the error msg', () => {
    const err = { message: 'error msg' };
    component.callbackWithMessage(err, 1);
    expect(component.errorMessage).toBe('error msg');
  });
});
