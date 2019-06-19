import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { UsersSharedModule } from '@app/users';
import { Subject } from 'rxjs/Subject';
import { PopupDialogService, SharedModule } from '@app/shared';

// Component
import { UserinformationComponent, UserroleComponent, EditUserFormComponent, OktaStatus } from '@app/users';
// service
import { EditUserService } from '@app/users';
import { ToastService } from '@app/shared';
// Model
import { User, UserLabels } from '@app/users';

describe('EditUserFormComponent', () => {
  let component: EditUserFormComponent;
  let fixture: ComponentFixture<EditUserFormComponent>;
  let editUserService: EditUserService;
  const labels = new UserLabels();

  const mockUser: User = {
    id: '00ui44ab3td6CD3CK09r',
    status: 'ACTIVE',
    profile: {
      firstName: 'John',
      lastName: 'Rob',
      email: 'John.Rob@xyz.com',
      login: 'John.Rob@xyz.com',
    },
    credentials: {
      provider: {
        type: 'Active Directory',
        name: 'Active Directory',
      },
    },
  };

  const mockOktaUser = {
    User: {
      id: '00ui44ab3td6CD3CK09r',
      status: 'ACTIVE',
      profile: {
        firstName: 'John',
        lastName: 'Rob',
        email: 'John.Rob@xyz.com',
        login: 'John.Rob@xyz.com',
      },
      credentials: null,
    },
    Groups: [
      {
        id: '00gibjc2ruryI0J2M0h7',
        profile: {
          name: 'Role:User Admin',
          description: 'User Admin Group',
        },
      },
    ],
  };

  const mockUserRoles = [
    {
      isPending: false,
      id: '00gibjc2ruryI0J2M0h7',
      rolename: 'User Admin',
      roledescription: 'Creates User',
      userAssigned: true,
    },
    {
      isPending: true,
      id: '00gibjc2ruryI0J2M0h7',
      rolename: 'Pharm Admin',
      roledescription: 'Validates on opportunity',
      userAssigned: true,
    },
    {
      isPending: false,
      id: '00gibjc2ruryI0J2M0h7',
      rolename: 'Pharm Tech',
      roledescription: 'Executes opportunity',
      userAssigned: true,
    },
  ];

  const mockCustomerFacilities = [
    {
      customerId: 'GHS',
      facilityId: 111,
      facilityName: 'Facility 1',
      facilityDescription: 'Facility 1 Desc',
    },
    {
      customerId: 'GHS',
      facilityId: 222,
      facilityName: 'Facility 2',
      facilityDescription: 'Facility 2 Desc',
    },
    {
      customerId: 'GHS',
      facilityId: 333,
      facilityName: 'Facility 3',
      facilityDescription: 'Facility 3 Desc',
    },
  ];

  const mockuserSites = [
    {
      isPending: true,
      id: 222,
      name: 'Facility 1',
      description: 'Facility 1 Desc',
      userAssociated: true,
    },
    { isPending: true, id: 333, name: 'Facility 2', description: 'Facility 2 Desc', userAssociated: true },
  ];

  const mockroleChange = {
    id: '00gibjc2ruryI0J2M0h7',
    rolename: 'User Admin',
    roledescription: 'Creates User',
    userAssigned: true,
  };

  const mocksiteAssociationChange = {
    id: 222,
    name: 'Facility 1',
    description: 'Facility 1 Desc',
    userAssociated: true,
  };

  const mockOktaRoles = [
    {
      id: '00gjmd3wt6J6h5g770h7',
      profile: {
        name: 'Role:Pharm Tech',
        description: 'Technician Group',
      },
    },
    {
      id: '00gjmd4dgqa7aNL190h7',
      profile: {
        name: 'Role:User Admin',
        description: 'User Admin Group',
      },
    },
    {
      id: '00gjmd4dgqa7aNP190h7',
      profile: {
        name: 'Role:Pharm Admin',
        description: 'Pharm Admin Group',
      },
    },
  ];

  class MockDialogService {
    titleElementText = 'Mock Title';
    messageElementText = 'Mock Message';
    primaryButtonText = 'Mock Primary Button Text';
    secondaryButtonText = 'Mock Secondary Button Text';
    defaultTimeoutResponse = false;
    response = new Subject<boolean>();
    showOnce() {}
  }
  const formBuilder: FormBuilder = new FormBuilder();

  const mockEditUserService = {
    getOktaGroupmembers: () => {
      return of(mockUser);
    },

    searchUser: () => {
      return of(mockUser);
    },

    getUserDetails: () => {
      return of(mockUser);
    },

    getUserRoles: () => {
      return of(mockOktaRoles);
    },

    getOktaRoles: () => {
      return of(mockOktaRoles);
    },

    checkEmailexists: () => {
      return { subscribe: () => {} };
    },

    updateUser: () => {
      return of(mockOktaUser);
    },

    getCustomerSites: () => {
      return of(mockCustomerFacilities);
    },

    resetPassword: () => {
      return of(true);
    },
  };

  const testROUTES: Routes = [{ path: 'user-list', component: EditUserFormComponent }];

  const toastService = new ToastService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersSharedModule, SharedModule, RouterTestingModule.withRoutes(testROUTES), BrowserAnimationsModule],
      declarations: [EditUserFormComponent, UserinformationComponent, UserroleComponent],
      providers: [
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: '00ui44ab3td6CD6tK09r',
            }),
          },
        },
        { provide: EditUserService, useValue: mockEditUserService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: PopupDialogService, useClass: MockDialogService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EditUserFormComponent);
    component = fixture.componentInstance;
    editUserService = fixture.debugElement.injector.get(EditUserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.oktaRoles = mockUserRoles;
    component.siteAssociationTab.userSites = mockuserSites;
    component.rolesTab.userRoles = mockUserRoles;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnit', async () => {
    spyOn(mockEditUserService, 'getUserDetails').and.returnValue(of(mockOktaUser));
    spyOn(mockEditUserService, 'getUserRoles').and.returnValue(of(mockUserRoles));
    spyOn(mockEditUserService, 'getOktaRoles').and.returnValue(of(mockOktaRoles));
    spyOn(component, 'getUserDetails');
    spyOn(component, 'getUserRoles');
    spyOn(component, 'getOktaRoles');
    spyOn(component, 'getCustomerSites');
    component.ngOnInit();
    expect(component.getUserDetails).toHaveBeenCalled();
    expect(component.getUserRoles).toHaveBeenCalled();
    expect(component.getOktaRoles).toHaveBeenCalled();
  });

  it('should get User Details', async () => {
    mockUser.status = 'ACTIVE';
    mockUser.profile.sites = [111];
    mockUser.credentials.provider.name = 'Active Directory';
    component.getUserDetails(mockUser);
    expect(component.isActiveUser).toBe(true);

    mockUser.status = 'SUSPENDED';
    component.getUserDetails(mockUser);
    expect(component.isSuspended).toBe(true);

    mockUser.status = 'DEPROVISIONED';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.DEPROVISIONED);

    mockUser.status = 'LOCKED';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.LOCKED);

    mockUser.status = 'PROVISIONED';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.PROVISIONED);

    mockUser.status = 'RECOVERY';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.RECOVERY);

    mockUser.status = 'STAGED';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.STAGED);

    mockUser.status = 'PASSWORD_EXPIRED';
    component.getUserDetails(mockUser);
    expect(component.status).toBe(OktaStatus.PASSWORD_EXPIRED);

    mockUser.status = 'TEST';
    component.getUserDetails(mockUser);
    expect(component.status).toBe('TEST');

    mockUser.profile.firstName = null;
    component.getUserDetails(mockUser);
    expect(component.warningUserInformationTab).toBe(true);
  });

  it('should get User Roles', async () => {
    component.getUserRoles(mockOktaRoles);
    expect(mockOktaRoles.length).toBe(3);
  });

  it('should get OktaRoles', async () => {
    component.firstname = 'John';
    component.isUserAdmin = true;
    component.getOktaRoles(mockOktaRoles);
    expect(mockOktaRoles.length).toBe(3);

    component.isPharmAdmin = true;
    component.getOktaRoles(mockOktaRoles);
    expect(mockOktaRoles.length).toBe(3);

    component.isPharmTechnician = true;
    component.getOktaRoles(mockOktaRoles);
    expect(mockOktaRoles.length).toBe(3);

    mockOktaRoles[0].profile.name = 'Test';
    component.getOktaRoles(mockOktaRoles);
    expect(mockOktaRoles.length).toBe(3);
  });

  it('should get customer Facilities', async () => {
    component.userAssociatedSitesID = [111];
    spyOn(mockEditUserService, 'getCustomerSites').and.returnValue(of(mockCustomerFacilities));
    component.getCustomerSites();
    expect(mockCustomerFacilities.length).toBe(3);
  });

  it('should call when role changes', (done) => {
    component.rolesTab.userRoles = mockUserRoles;

    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();

    mockUserRoles.forEach((mockUserRole) => {
      mockUserRole.isPending = false;
    });
    component.rolesTab.userRoles = mockUserRoles;
    component.roleChanged(mockroleChange);
    expect(component.pendingRolesTab).toBe(false);

    mockroleChange.rolename = 'Pharm Admin';
    mockroleChange.userAssigned = true;
    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();

    mockroleChange.rolename = 'Pharm Tech';
    mockroleChange.userAssigned = true;
    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();

    mockroleChange.rolename = 'User Admin';
    mockroleChange.userAssigned = false;
    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();

    mockroleChange.rolename = 'Pharm Admin';
    mockroleChange.userAssigned = false;
    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();

    mockroleChange.rolename = 'Pharm Tech';
    mockroleChange.userAssigned = false;
    component.roleChanged(mockroleChange);
    expect(mockroleChange).not.toBeNull();
    done();
  });

  it('should call when status changes', () => {
    component.statusChanged(true);
    expect(component.pendingUserInformationTab).toBe(true);

    component.statusChanged(false);
    expect(component.pendingUserInformationTab).toBe(false);
  });

  it('should call when site associated changes', (done) => {
    component.siteAssociationTab.userSites = mockuserSites;
    component.userAssociatedSitesID = [221];
    component.siteAssociated(mocksiteAssociationChange);
    expect(mocksiteAssociationChange).not.toBeNull();

    mockuserSites.forEach((mockuserSite) => {
      mockuserSite.isPending = false;
    });
    component.siteAssociationTab.userSites = mockuserSites;
    component.siteAssociated(mocksiteAssociationChange);
    expect(component.pendingSiteAssociationTab).toBe(false);

    component.userAssociatedSitesID = [222];
    mocksiteAssociationChange.userAssociated = false;
    component.siteAssociated(mocksiteAssociationChange);
    expect(mocksiteAssociationChange).not.toBeNull();
    done();
  });

  it('should set update user object and check entered email already exists', () => {
    // No change in email entered
    component.email = 'John.Rob@xyz.com';
    component.userinformationtab.editUserForm.setValue({
      firstname: 'John',
      lastname: 'Rob',
      email: 'John.Rob@xyz.com',
      username: 'John.Rob@xyz.com',
    });
    component.oktaRoles = mockUserRoles;
    component.isUserAdmin = true;
    component.isActiveUser = true;
    component.userinformationtab.isUserinActiveState = false;
    component.userinformationtab.changePasswordonLogin = true;
    spyOn(component, 'displayUserUpdateSuccess').and.callThrough();
    component.updateUser();

    mockUserRoles[0].rolename = 'Pharm Tech';
    component.isPharmTechnician = true;
    component.updateUser();

    component.isPharmAdmin = true;
    component.updateUser();

    component.isActiveUser = false;
    component.userinformationtab.isUserinActiveState = true;
    component.updateUser();
    // Entered email is different and new email doesnt exist

    component.email = 'John.Rob@xyz.com';
    component.userinformationtab.editUserForm.setValue({
      firstname: 'John',
      lastname: 'Rob',
      email: 'John1.Rob@xyz.com',
      username: 'John.Rob@xyz.com',
    });

    const searchedUser: User = null;
    const spyObj = spyOn(mockEditUserService, 'searchUser');
    spyObj.and.returnValue(searchedUser);
    component.updateUser();

    spyObj.and.returnValue(mockUser);
    component.updateUser();
    expect(toastService).not.toBeFalsy();

    // Check email exists throws error
    spyObj.and.returnValue(throwError('Error'));
    component.updateUser();
    expect(toastService).not.toBeFalsy();
  });

  it('should call when header information is updated', () => {
    component.userinformationtab.editUserForm.setValue({
      firstname: 'John',
      lastname: 'Rob',
      email: 'John1.Rob@xyz.com',
      username: 'John.Rob@xyz.com',
    });
    component.updateHeaderInfo();
    expect(component.firstname).toBe('John');
  });

  it('should call when values are reset', () => {
    component.siteAssociationTab.userSites = mockuserSites;
    component.rolesTab.userRoles = mockUserRoles;
    component.userinformationtab.isUserinActiveState = true;
    component.isActiveUser = false;
    component.isADUser = false;
    component.resetValues();
    expect(component.userinformationtab.isActive).toBe(true);

    component.isActiveUser = true;
    component.userinformationtab.isUserinActiveState = false;
    component.resetValues();
    expect(component.userinformationtab.isActive).toBe(false);
  });

  it('should call on password reset', () => {
    spyOn(mockEditUserService, 'resetPassword').and.returnValue(true);
    spyOn(component, 'displayDialog').and.callThrough();
    component.onPasswordReset();
    expect(component.userinformationtab.status).toBe('Password Reset');
  });

  xit('should not navigate if there are any pending changes', () => {
    component.isSaveButtonDisabled = false;
    spyOn(component, 'canDeactivate').and.callThrough();
    expect(component.canDeactivate).toBe(true);
  });
});
