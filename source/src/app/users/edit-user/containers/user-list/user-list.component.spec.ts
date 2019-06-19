import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserListComponent } from '@app/users';
import { LocalStorageService, AuthService, UserRoles } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Routes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule, ToastService, PopupWindowProperties, PopupWindowService } from '@app/shared';

import { Observable } from 'rxjs/Observable';
import { CustomerContextService, CustomerContext, CognitoUtil } from '@app/core';
import { EditUserService } from '@app/users';
import { AdduserComponent } from '@app/users/add-user/components/add-user/add-user.component';
import { PopupAdduserComponent } from '@app/users/add-user/containers/popup-adduser/popup-adduser.component';
// Model
import { User, OktaUserProfile, UserProfile } from '@app/users';

describe('UserListComponent', () => {
  const users: User[] = [
    {
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
    {
      id: '00ui44ab3td6CD6tK09r',
      status: 'ACTIVE',
      profile: {
        firstName: 'Issac',
        lastName: 'New',
        email: 'Issac.New@xyz.com',
        login: 'Issac.New@xyz.com',
      },
      credentials: null,
    },
  ];

  const rowUser: any = {
    id: '00ui44ab3td6CD6tK09r',
    firstName: 'Issac',
    lastName: 'New',
    email: 'Issac.New@xyz.com',
    login: 'Issac.New@xyz.com',
  };

  class MockLocationRef {
    get hash() {
      return '';
    }
  }

  const mockAuthService = {
    getTokensOkta: () => {},
    redirectToNotAuthorized: () => {},
    getRole: () => {},
    getCustomer: () => {},
    isCurrentCustomerContextSet(): boolean {
      return true;
    },
    initUser(): void {},
    isRefreshTokenExpired(): boolean {
      return false;
    },
  };
  const customerContext = { role: ['Strategist'], customer: 'GH1' } as CustomerContext;
  const mockEditUserService = {
    getOktaGroupmembers: () => {
      return of(users);
    },

    searchUser: () => {
      return of(users);
    },
  };

  const CustomerContextServiceStub = {
    getCustomerContext(): Observable<CustomerContext> {
      return of(customerContext);
    },
    setCustomerContext(value: CustomerContext): void {},
  };

  const testROUTES: Routes = [{ path: 'user-list', component: UserListComponent }];

  let customerContextService: CustomerContextService;
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let editUserService: EditUserService;
  let toastService: ToastService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(testROUTES),
        BrowserModule,
      ],
      declarations: [UserListComponent, AdduserComponent, PopupAdduserComponent],
      providers: [
        ToastService,
        PopupWindowService,
        { provide: EditUserService, useValue: mockEditUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: 'LocationRef', useClass: MockLocationRef },
        { provide: CustomerContextService, useValue: CustomerContextServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    editUserService = fixture.debugElement.injector.get(EditUserService);
    toastService = fixture.debugElement.injector.get(ToastService);
    customerContextService = fixture.debugElement.injector.get(CustomerContextService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On init, defaults', () => {
    const custContext = {} as CustomerContext;
    custContext.role = [UserRoles.Strategist];
    custContext.customer = 'GHS';
    spyOn(CustomerContextServiceStub, 'getCustomerContext').and.returnValue(of(custContext));

    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(component.loadData).toHaveBeenCalled();

    custContext.role = [UserRoles.OmnicellAdmin];
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalled();

    custContext.role = [UserRoles.UserAdmin];
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should load data successfully', async () => {
    spyOn(mockEditUserService, 'getOktaGroupmembers').and.returnValue(of(users));
    component.loadData();
    expect(users.length).toBe(2);

    users[0].status = 'STAGED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'DEPROVISIONED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'LOCKED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'PROVISIONED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'RECOVERY';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'SUSPENDED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'PASSWORD_EXPIRED';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);

    users[0].status = 'TEST';
    component.loadData();
    fixture.detectChanges();
    expect(users.length).toBe(2);
  });

  it('should subscribe to search box text after view initialization', async () => {
    component.searchElement.searchOutput$ = of('search text');
    spyOn(component, 'checkSearchkeyword').and.callThrough();
    component.ngAfterViewInit();
    expect(component.checkSearchkeyword).toHaveBeenCalledWith('search text');

    component.searchElement.searchOutput$ = of(throwError('Error'));
    component.ngAfterViewInit();
    expect(toastService.success).not.toBeUndefined();
  });

  it('should search users based on keyword entered', async () => {
    const spyObj = spyOn(mockEditUserService, 'searchUser');
    spyObj.and.returnValue(of(users));
    component.searchUser('Rob');
    expect(users.length).toBe(2);

    const searchUsers: User[] = [];

    spyObj.and.callThrough();
    component.searchUser('Rob');

    const toastServiceSuccess = new ToastService();
    expect(toastServiceSuccess).not.toBeUndefined();

    spyObj.and.returnValue(throwError('Error'));
    component.searchUser('Rob');
  });

  it('searchUser() - if no keyword entered', async () => {
    component.checkSearchkeyword('');
    expect(component.userProfile.length).toEqual(0);
  });

  it('should call row click of user list', function() {
    const navigateSpy = spyOn(router, 'navigate');
    component.onRowClick(rowUser);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should open popup for adding user', async () => {
    const _popup = new PopupWindowService(null, null, null);
    spyOn(component, 'openAddUser').and.returnValue(true);
    component.openAddUser();
    expect(_popup.show).toEqual(_popup.show);
  });

  it('should unsubscribe', () => {
    spyOn(component.unsubscribe$, 'complete');
    spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
