import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';

import {
  NavComponent,
  CustomerContextService,
  AuthService,
  LocalStorageService
} from '@app/core';
import { PopupWindowModule } from 'webcorecomponent-lib';
import { PopupWindowService } from 'webcorecomponent-lib';
import { of } from 'rxjs';

const mockAuthService = {
  logout: () => { },
  isLoggedIn: () => { },
  getUsername: () => { },
  isUsingOkta: () => false,
  getNavigation: () => []
};

const mockRouter = {
  navigate: (commands: any[]) => { }
};

const mockLocalStorageService = {
  removeItem: (key: string) => { }
};

const mockCustomerContextService = {
  getCustomerContext: () => { }
};

const mockPopupWindowService = {
  show() {}
};

describe('Nav component', () => {
  let authService: AuthService;
  let customerContextService: CustomerContextService;

  let router: Router;
  let component: NavComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ PopupWindowModule ],
      providers: [
        NavComponent, PopupWindowService,
        {
          provide: CustomerContextService,
          useValue: mockCustomerContextService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService
        },
        {
          provide: PopupWindowService,
          useValue: mockPopupWindowService
        }
      ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    component = TestBed.get(NavComponent);
    customerContextService = TestBed.get(CustomerContextService);
  });

  it('Should call auth service logout and redirect', () => {
    spyOn(authService, 'logout').and.callThrough();
    // spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    // expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should redirect to profile', () => {
    spyOn(router, 'navigate');

    component.redirectToProfile();

    expect(router.navigate).toHaveBeenCalledWith(['profile']);
  });

  it('should init and set showProfile to "false" if okta is used', async(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authService, 'isUsingOkta').and.returnValue(true);
    spyOn(authService, 'getUsername');

    spyOn(customerContextService, 'getCustomerContext').and.returnValue(of({ customer: 'test-user' }));

    expect(component.showProfile).toBeFalsy();

    component.ngOnInit();

    expect(component.showProfile).toBe(false);

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(authService.getUsername).toHaveBeenCalled();
    expect(authService.isUsingOkta).toHaveBeenCalled();

    expect(customerContextService.getCustomerContext).toHaveBeenCalled();
  }));

  it('should init and set showProfile to "true" if okta is NOT used', async(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authService, 'isUsingOkta').and.returnValue(false);
    spyOn(authService, 'getUsername');

    spyOn(customerContextService, 'getCustomerContext').and.returnValue(of({ customer: 'test-user' }));

    expect(component.showProfile).toBeFalsy();

    component.ngOnInit();

    expect(component.showProfile).toBe(true);

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(authService.getUsername).toHaveBeenCalled();
    expect(authService.isUsingOkta).toHaveBeenCalled();

    expect(customerContextService.getCustomerContext).toHaveBeenCalled();
  }));

  it('should init and set showChangePassword to "true" if okta is used', async(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authService, 'isUsingOkta').and.returnValue(true);
    spyOn(authService, 'getUsername');

    spyOn(customerContextService, 'getCustomerContext').and.returnValue(of({ customer: 'test-user' }));

    expect(component.showChangePassword).toBeFalsy();

    component.ngOnInit();

    expect(component.showChangePassword).toBe(true);

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(authService.getUsername).toHaveBeenCalled();
    expect(authService.isUsingOkta).toHaveBeenCalled();

    expect(customerContextService.getCustomerContext).toHaveBeenCalled();
  }));

  it('should init and set showChangePassword to "false" if okta is NOT used', async(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(of(true));
    spyOn(authService, 'isUsingOkta').and.returnValue(false);
    spyOn(authService, 'getUsername');

    spyOn(customerContextService, 'getCustomerContext').and.returnValue(of({ customer: 'test-user' }));

    expect(component.showChangePassword).toBeFalsy();

    component.ngOnInit();

    expect(component.showChangePassword).toBe(false);

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(authService.getUsername).toHaveBeenCalled();
    expect(authService.isUsingOkta).toHaveBeenCalled();

    expect(customerContextService.getCustomerContext).toHaveBeenCalled();
  }));
});
