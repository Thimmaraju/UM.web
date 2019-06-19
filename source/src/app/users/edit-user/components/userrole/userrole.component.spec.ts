import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersSharedModule } from '@app/users';
import { SharedModule } from '@app/shared';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// Componet
import { UserroleComponent } from '@app/users';

describe('UserroleComponent', () => {
  const userRole: any[] = [
    {
      id: '00ui44ab3td6CD3CK09r',
      rolename: 'UserAdmin',
      roledescription: 'UserAdmin',
      userAssigned: true,
    },
  ];
  let component: UserroleComponent;
  let fixture: ComponentFixture<UserroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UsersSharedModule, SharedModule],
      declarations: [UserroleComponent],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have id of current user', () => {
    component.currentuserId = '00ui44ab3td6CD6tK09r';
    expect(component.currentuserId).toBe('00ui44ab3td6CD6tK09r');
  });

  it('should have user roles array', () => {
    component.userRoles = userRole;
    expect(component.userRoles).toEqual(userRole);
  });

  it('should have boolean value to check AD user', () => {
    component.isADUser = true;
    expect(component.isADUser).toEqual(true);
  });

  it('handle role change should emit an event', () => {
    spyOn(component.changeRole, 'emit').and.callThrough();
    component.rolechanged(userRole);
    expect(component.changeRole.emit).toHaveBeenCalled();
  });

  it('handle is disabled for AD user', () => {
    component.isADUser = true;
    component.isDisabled();
    expect(component.isADUser).toEqual(true);
  });
});
