import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UsersSharedModule } from '@app/users';
import { SharedModule } from '@app/shared';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Component
import { UserinformationComponent } from '@app/users';

describe('UserinformationComponent', () => {
  let component: UserinformationComponent;
  let fixture: ComponentFixture<UserinformationComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, UsersSharedModule, SharedModule],
      declarations: [UserinformationComponent],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinformationComponent);
    component = fixture.componentInstance;
    component.editUserForm = formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    component.editUserForm.setValue({
      firstname: 'John',
      lastname: 'Rob',
      email: 'John.Rob@xyz.com',
      username: 'John.Rob@xyz.com',
    });
    expect(component).toBeTruthy();
  });

  it('should return isDisabled boolean property', () => {
    component.isNonOkta = false;
    component.isDisabled();
  });

  it('should set status on change', () => {
    component.isActive = true;
    component.isNonOkta = false;
    component.ngOnChanges();
    expect(component.isUserinActiveState).toBe(true);

    component.isActive = false;
    component.isSuspendedUser = true;
    component.isNonOkta = false;
    component.ngOnChanges();
    expect(component.isUserinActiveState).toBe(false);
  });

  it('should emit to parent on status change', () => {
    component.isUserinActiveState = true;
    component.isActive = false;
    spyOn(component.changestatus, 'emit').and.callThrough();
    component.onStatusChanged();
    expect(component.changestatus.emit).toHaveBeenCalled();

    component.isUserinActiveState = false;
    component.isActive = true;
    component.onStatusChanged();
    expect(component.changestatus.emit).toHaveBeenCalled();
  });

  it('should emit to parent on click of password reset', () => {
    spyOn(component.resetPassword, 'emit').and.callThrough();
    component.onResetPasswordClicked();
    expect(component.resetPassword.emit).toHaveBeenCalled();
  });

  it('should get called on selection of radio button', () => {
    const mockradiobuttonsettings = {
      name: 'User Profile',
      displayField: 'Profile',
      valueField: 'P',
      showChanges: false,
      showWarning: false,
    };
    component.onuserInformationChanged(mockradiobuttonsettings);
    expect(component.selectedItem).not.toBeNull();
  });
});
