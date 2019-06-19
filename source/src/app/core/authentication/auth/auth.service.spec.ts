import { TestBed, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { CognitoUtil } from '../cognito.service';
import {
  LocalStorageService,
  CustomerContext,
  CustomerContextService,
  UserToken,
  UserRoles,
  Customer,
  CustomerAccess,
  Claims,
  TokenService,
} from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenValidationService } from '../token-validation/token-validation.service';
import { UserroleComponent } from '@app/users';

const mockOktaService = {
  endSession: () => of(),
};

const customerAccess = {} as CustomerAccess;
export class TokenServiceStub {
  public GetCustomerAccess(): Observable<CustomerAccess> {
    return of(customerAccess);
  }
  public GetCustomerAccessOkta(): Observable<CustomerAccess> {
    return of(customerAccess);
  }
  public SwitchCustomers(customerId: string): Observable<string> {
    return of('foo');
  }
}

export class LocalStorageServiceStub {
  public removeItem(key: string): void {}
  public setItem(key: string, value: string): void {}
  public getItem(key: string): string {
    return 'foo-bar';
  }
}

export class CustomerContextServiceStub {
  public setCustomerContext(value: CustomerContext): void {}
}

class LocationRefStub {
  set href(value: string) {}
  get pathname(): string {
    return 'test';
  }
  set pathname(path) {}
}

class AuthConfigsServiceStub {
  getCustomerFromUrl() {
    return ''; // no customer in url
  }
}

export class TokenValidationServiceStub {
  public end(): void {}
  public start(): void {}
  public refreshTokenHasExpired(): Observable<boolean> {
    return of(true);
  }
}

let tokenServiceStub: TokenServiceStub;
let localStorageServiceStub: LocalStorageServiceStub;
let customerContextStub: CustomerContextServiceStub;
let locationRef: Location;
let tokenValidationServiceStub: TokenValidationServiceStub;

describe('Authentication Service', () => {
  let injector: TestBed;
  let service: AuthService;
  let routerInstance: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [],
      providers: [
        AuthService,
        CognitoUtil,
        {
          provide: LocalStorageService,
          useClass: LocalStorageServiceStub,
        },
        {
          provide: CustomerContextService,
          useClass: CustomerContextServiceStub,
        },
        {
          provide: TokenService,
          useClass: TokenServiceStub,
        },
        {
          provide: 'LocationRef',
          useClass: LocationRefStub,
        },
        {
          provide: TokenValidationService,
          useClass: TokenValidationServiceStub,
        },
      ],
    });

    injector = getTestBed();
    service = injector.get(AuthService);
    routerInstance = injector.get(Router);
    tokenServiceStub = injector.get(TokenService);
    localStorageServiceStub = injector.get(LocalStorageService);
    customerContextStub = injector.get(CustomerContextService);
    tokenValidationServiceStub = injector.get(TokenValidationService);
    locationRef = TestBed.get('LocationRef');
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  it('should get tokens if customer context is not set', () => {
    const customers: Customer[] = [];
    const custAccess = { customers } as CustomerAccess;

    spyOnProperty(locationRef, 'pathname', 'get').and.returnValue('');

    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(false);
    spyOn(tokenServiceStub, 'GetCustomerAccess').and.returnValue(of(custAccess));

    spyOn(service, 'clearLocalStorage');
    spyOn(service, 'setLocalStorage');
    spyOn(service, 'setAssignedCustomers');
    spyOn(service, 'initUser');

    service.init();

    expect(service.isCurrentCustomerContextSet).toHaveBeenCalled();
    expect(tokenServiceStub.GetCustomerAccess).toHaveBeenCalled();
    expect(service.clearLocalStorage).toHaveBeenCalled();
    expect(service.setAssignedCustomers).toHaveBeenCalled();
    expect(service.initUser).toHaveBeenCalled();
  });

  it('should not get tokens if customer context is set', () => {
    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(true);
    spyOn(service, 'initUser');

    service.init();

    expect(service.isCurrentCustomerContextSet).toHaveBeenCalled();
    expect(service.initUser).toHaveBeenCalled();
  });

  it('should switch customers when called', () => {
    spyOn(tokenServiceStub, 'SwitchCustomers').and.returnValues(of('bar'));
    spyOn(localStorageServiceStub, 'removeItem');
    spyOn(localStorageServiceStub, 'setItem');
    spyOn(customerContextStub, 'setCustomerContext');
    service.switchCustomer('foobar');
    expect(localStorageServiceStub.removeItem).toHaveBeenCalled();
    expect(localStorageServiceStub.setItem).toHaveBeenCalled();
    expect(customerContextStub.setCustomerContext).toHaveBeenCalled();
  });

  it('should get assigned customers from memory when present', () => {
    const customer = {} as Customer;
    const customers: Customer[] = [];
    customers.push(customer);
    spyOn(localStorageServiceStub, 'getItem');
    service.assignedCustomers = customers;
    let results: Customer[] = [];
    service.getAssignedCustomers().subscribe((x) => (results = x));
    expect(results.length).toBe(1);
    expect(localStorageServiceStub.getItem).not.toHaveBeenCalled();
  });

  it('should get assigned customers from local storage when not present in memory', () => {
    const customers: Customer[] = [];
    spyOn(localStorageServiceStub, 'getItem');
    spyOn(service, 'removeSpecialCharacters');
    spyOn(JSON, 'parse');
    service.assignedCustomers = customers;
    let results: Customer[] = [];

    service.getAssignedCustomers().subscribe((x) => (results = x));

    expect(localStorageServiceStub.getItem).toHaveBeenCalled();
    expect(service.removeSpecialCharacters).toHaveBeenCalled();
  });

  it('should remove special characters', () => {
    const beforeString = '/foo/';
    const afterString = service.removeSpecialCharacters(beforeString);
    expect(afterString).not.toContain('/');
  });

  it('set logged in', () => {
    spyOn(service.loggedIn$, 'next');
    service.setLoggedIn(true);
    expect(service.loggedIn$.next).toHaveBeenCalled();
  });

  it('should broadcast tenant selection', () => {
    spyOn(customerContextStub, 'setCustomerContext');
    service.broadCastTenantSelection();
    expect(customerContextStub.setCustomerContext).toHaveBeenCalled();
  });

  it('should get role for memory if present', () => {
    spyOn(service, 'isRefreshTokenExpired');
    spyOn(service, 'decodeToken');
    spyOn(service, 'setRole');
    service.roles = [UserRoles.None];
    service.getRole();
    expect(service.isRefreshTokenExpired).not.toHaveBeenCalled();
    expect(service.decodeToken).not.toHaveBeenCalled();
    expect(service.setRole).not.toHaveBeenCalled();
  });

  it('should get access token', () => {
    spyOn(localStorageServiceStub, 'getItem');
    service.getAccessToken();
    expect(localStorageServiceStub.getItem).toHaveBeenCalled();
  });

  it('should get role from token if not present in memory', () => {
    spyOn(service, 'isRefreshTokenExpired');
    const claims = {} as Claims;
    claims.role = 'foo';
    spyOn(service, 'decodeToken').and.returnValue(claims);
    spyOn(service, 'setRole');
    service.roles = [];
    service.getRole();
    expect(service.isRefreshTokenExpired).toHaveBeenCalled();
    expect(service.decodeToken).toHaveBeenCalled();
    expect(service.setRole).toHaveBeenCalled();
  });

  it('should determine if current customer context is set', () => {
    const token = {} as Claims;
    token.cci = 'foo';
    const returnToken = JSON.stringify(token);
    spyOn(service, 'decodeToken').and.returnValue(token);
    spyOn(service, 'getAccessToken').and.returnValue(of(returnToken));
    const results = service.isCurrentCustomerContextSet();
    expect(results).toBeTruthy();
    expect(service.getAccessToken).toHaveBeenCalled();
  });

  it('is logged in should return false by default', () => {
    let test: boolean;
    service.setLoggedIn(false);
    const result = service.isLoggedIn();
    result.subscribe((x) => (test = x));
    expect(test).toBeFalsy();
  });

  it('should set user name and call next', () => {
    spyOn(service.userName$, 'next');
    const user = {} as Claims;
    service.setUsername(user);
    expect(service.userName$.next).toHaveBeenCalled();
  });

  it('should user given and family name if available', () => {
    const result = '';
    spyOn(service.userName$, 'next');
    const user = {} as Claims;
    user.family_name = 'foo';
    user.given_name = 'bar';
    user.uname = 'foobar';
    service.setUsername(user);
    expect(service.userName$.next).toHaveBeenCalledWith('bar foo');
  });

  it('should use username if given and family name is not available', () => {
    const result = '';
    spyOn(service.userName$, 'next');
    const user = {} as Claims;
    user.uname = 'foobar';
    service.setUsername(user);
    expect(service.userName$.next).toHaveBeenCalledWith('foobar');
  });

  it('get user name should return empty string if not set', () => {
    let test: string;
    service.getUsername().subscribe((x) => {
      test = x;
    });
    expect(test).toBe('');
  });

  it('get user name should return user name', () => {
    let test: string;
    const user = {} as Claims;
    user.uname = 'foobar';
    service.setUsername(user);
    service.getUsername().subscribe((x) => (test = x));
    expect(test).toBe('foobar');
  });

  it('get user role', () => {
    const test: UserRoles[] = [UserRoles.Strategist];
    // service.setUserRole(UserRoles.Strategist);
    spyOn(service, 'getUserRole').and.returnValue(test);
    // service.getUserRole().subscribe((x) => (test = x));
    expect(test).not.toBeNull();
  });

  it('clear local storage', () => {
    const spy = spyOn(localStorageServiceStub, 'removeItem');

    service.clearLocalStorage();

    expect(spy.calls.count()).toBe(5);
    // allArgs return each args from the spy which is a array (spy.calls.argsFor(index) => [])
    // since removeItem takes a single args, simplify by mapping to first args sent to
    // spy so we don' have to do [['token'], ['refresh'], ...] in the toEqual call
    expect(spy.calls.allArgs().map((a) => a[0])).toEqual(['token', 'refresh', 'url', 'customers', 'okta']);
  });

  it('convert name', () => {
    const test = service.convertName('foo bar');
    expect(test).toBe('foobar');
  });

  xit('should set role when value exist', () => {
    spyOn(service.userRole$, 'next');
    service.setRole(UserRoles.None);
    expect(service.roles).toBe([UserRoles.None]);
    // expect(service.userRole$.next).toHaveBeenCalled();
  });

  it('should not set role when value is empty', () => {
    spyOn(service.userRole$, 'next');
    service.setRole('');
    expect(service.userRole$.next).not.toHaveBeenCalled();
  });

  it('should get token', () => {
    spyOn(localStorageServiceStub, 'getItem');
    service.getToken();
    expect(localStorageServiceStub.getItem).toHaveBeenCalled();
  });

  it('should intiUser if token is valid', () => {
    const user = {} as Claims;
    user.role = 'foo';
    user.cs = 'foo';

    spyOn(service, 'isRefreshTokenExpired').and.returnValue(false);
    spyOn(service, 'decodeToken').and.returnValue(user);
    spyOn(service, 'setLoggedIn');
    spyOn(service, 'setUsername');
    spyOn(service, 'convertName');
    spyOn(service, 'setRole');
    spyOn(service, 'checkForDefaultCustomerAndRedirect');
    spyOn(service, 'hasRefreshTokenExpired');
    spyOn(JSON, 'parse');
    spyOn(tokenValidationServiceStub, 'start');
    service.initUser();
    expect(service.isRefreshTokenExpired).toHaveBeenCalled();
    expect(service.decodeToken).toHaveBeenCalled();
    expect(service.setLoggedIn).toHaveBeenCalled();
    expect(service.setUsername).toHaveBeenCalled();
    expect(service.checkForDefaultCustomerAndRedirect).toHaveBeenCalled();
  });

  xit('should redirect if token is not valid', () => {
    spyOn(service, 'isRefreshTokenExpired').and.returnValue(true);
    spyOn(routerInstance, 'navigate');
    service.initUser();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('initUser should call checkForDefaultCustomerAndRedirect with false by default', () => {
    const user = {} as Claims;
    user.role = 'foo';
    user.cs = 'foo';
    spyOn(service, 'isRefreshTokenExpired').and.returnValue(false);
    spyOn(service, 'decodeToken').and.returnValue(user);
    spyOn(service, 'setLoggedIn');
    spyOn(service, 'setUsername');
    spyOn(service, 'convertName');
    spyOn(service, 'setRole');
    spyOn(service, 'checkForDefaultCustomerAndRedirect');
    spyOn(service, 'hasRefreshTokenExpired');
    spyOn(JSON, 'parse').and.returnValue(user.cs);
    spyOn(tokenValidationServiceStub, 'start');
    service.initUser();
    expect(service.checkForDefaultCustomerAndRedirect).toHaveBeenCalledWith('foo', false);
  });

  it('intiUser should call checkForDefaultCustomerAndRedirect with true when passed in', () => {
    const user = {} as Claims;
    user.role = 'foo';
    user.cs = 'foo';
    spyOn(service, 'isRefreshTokenExpired').and.returnValue(false);
    spyOn(service, 'decodeToken').and.returnValue(user);
    spyOn(service, 'setLoggedIn');
    spyOn(service, 'setUsername');
    spyOn(service, 'convertName');
    spyOn(service, 'setRole');
    spyOn(service, 'checkForDefaultCustomerAndRedirect');
    spyOn(service, 'hasRefreshTokenExpired');
    spyOn(JSON, 'parse').and.returnValue(user.cs);
    spyOn(tokenValidationServiceStub, 'start');
    service.initUser(true);
    expect(service.checkForDefaultCustomerAndRedirect).toHaveBeenCalledWith('foo', true);
  });

  it('should check for default customer for a Strategist role', () => {
    spyOn(service, 'checkStrategist');
    spyOn(routerInstance, 'navigate');
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    const customer2 = {} as Customer;
    customer2.name = 'bar';
    customers.push(customer1);
    customers.push(customer2);
    service.roles = [UserRoles.Strategist];
    service.checkForDefaultCustomerAndRedirect(customers);
    expect(service.checkStrategist).toHaveBeenCalled();
    expect(routerInstance.navigate).not.toHaveBeenCalled();
  });

  it('should redirect for a PharmAdmin role', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isDefaultRoute').and.returnValue(true);
    spyOn(service, 'decodeToken').and.returnValue({ cci: 'foobar' });
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    customers.push(customer1);
    service.roles = [UserRoles.PharmAdmin];
    service.checkForDefaultCustomerAndRedirect(customers, true);
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('should redirect for other roles', () => {
    spyOn(routerInstance, 'navigate');
    service.roles = [UserRoles.None];
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.checkForDefaultCustomerAndRedirect(customers, true);
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('checkForDefaultCustomerAndRedirect should not redirect if byPassRedirect is true and default route is false', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isDefaultRoute').and.returnValue(false);
    spyOn(service, 'decodeToken').and.returnValue({ cci: 'foobar' });
    service.roles = [UserRoles.None];
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.roles = [UserRoles.PharmAdmin];
    service.checkForDefaultCustomerAndRedirect(customers, true);
    expect(routerInstance.navigate).not.toHaveBeenCalled();
  });

  it('checkForDefaultCustomerAndRedirect should redirect if byPassRedirect is false and default route is true', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isDefaultRoute').and.returnValue(true);
    spyOn(service, 'decodeToken').and.returnValue({ cci: 'foobar' });
    service.roles = [UserRoles.None];
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.roles = [UserRoles.PharmAdmin];
    service.checkForDefaultCustomerAndRedirect(customers);
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('check strategist with one customer assigned and current customer context is set', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'decodeToken').and.returnValue({ cci: '' });
    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(true);
    spyOn(service, 'isDefaultRoute').and.returnValue(true);
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.checkStrategist(customers, true);
    expect(service.setCustomer).toHaveBeenCalled();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('check strategist without current context set', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(false);
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.checkStrategist(customers);
    expect(service.setCustomer).not.toHaveBeenCalled();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('check strategist should redirect if default route', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(true);
    spyOn(service, 'isDefaultRoute').and.returnValue(true);
    spyOn(service, 'decodeToken').and.returnValue({ cci: '' });
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.checkStrategist(customers);
    expect(service.setCustomer).toHaveBeenCalled();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });

  it('check strategist should not redirect if byPassRedirect is true', () => {
    spyOn(routerInstance, 'navigate');
    spyOn(service, 'setCustomer');
    spyOn(service, 'isCurrentCustomerContextSet').and.returnValue(true);
    spyOn(service, 'isDefaultRoute').and.returnValue(false);
    spyOn(service, 'decodeToken').and.returnValue({ cci: '' });
    const customers: Customer[] = [];
    const customer1 = {} as Customer;
    customer1.name = 'foo';
    service.checkStrategist(customers, true);
    expect(routerInstance.navigate).not.toHaveBeenCalled();
  });

  it('should get omnicell tokens from a Okta token', () => {
    const custAccess = {} as CustomerAccess;
    spyOn(tokenServiceStub, 'GetCustomerAccessOkta').and.returnValue(of(custAccess));
    spyOn(service, 'clearLocalStorage');
    spyOn(service, 'setLocalStorage');
    spyOn(service, 'setAssignedCustomers');
    spyOn(service, 'initUser');
    service.getTokensOkta();
    expect(service.clearLocalStorage).toHaveBeenCalled();
    expect(service.setLocalStorage).toHaveBeenCalled();
    expect(service.setAssignedCustomers).toHaveBeenCalled();
    expect(service.initUser).toHaveBeenCalled();
  });

  it('should logout and remove values', () => {
    spyOn(service, 'setLoggedIn');
    spyOn(service, 'setUserRole');
    spyOn(service, 'setRole');
    spyOn(service, 'setCustomer');
    spyOn(service, 'setUsername');
    spyOn(service, 'clearLocalStorage');
    spyOn(tokenValidationServiceStub, 'end');
    service.logout();
    expect(service.setLoggedIn).toHaveBeenCalled();
    expect(service.setUserRole).toHaveBeenCalled();
    expect(service.setRole).toHaveBeenCalled();
    expect(service.setCustomer).toHaveBeenCalled();
    expect(service.setUsername).toHaveBeenCalled();
    expect(service.clearLocalStorage).toHaveBeenCalled();
  });

  it('should get current customer when assigned customers is present', () => {
    let results = {} as Customer;
    const currentCustomer = {} as Customer;
    currentCustomer.customerId = 'foo';
    const currentCustomers = [] as Customer[];
    currentCustomers.push(currentCustomer);
    spyOn(service, 'getCustomer').and.returnValue('foo');
    spyOn(service, 'removeSpecialCharacters');
    spyOn(localStorageServiceStub, 'getItem');
    spyOn(JSON, 'parse');
    service.assignedCustomers = currentCustomers;
    service.getCurrentCustomer().subscribe((x) => (results = x));
    expect(results.customerId).toBe('foo');
    expect(service.removeSpecialCharacters).not.toHaveBeenCalled();
  });

  it('should get current customers from local storage when assigned customers is not present', () => {
    let results = {} as Customer;
    const currentCustomers = [] as Customer[];
    const returnedCustomers = [] as Customer[];
    const returnedCustomer = {} as Customer;
    returnedCustomer.customerId = 'foo';
    returnedCustomers.push(returnedCustomer);
    service.assignedCustomers = currentCustomers;
    spyOn(service, 'getCustomer').and.returnValue('foo');
    spyOn(localStorageServiceStub, 'getItem');
    spyOn(service, 'removeSpecialCharacters');
    spyOn(JSON, 'parse').and.returnValue(returnedCustomers);
    service.getCurrentCustomer().subscribe((x) => (results = x));
    expect(results.customerId).toBe('foo');
    expect(service.removeSpecialCharacters).toHaveBeenCalled();
  });

  it('should not init if location pathname is "idpcallback"', () => {
    const spy = spyOnProperty(locationRef, 'pathname', 'get').and.returnValue('idpcallback');
    spyOn(tokenServiceStub, 'GetCustomerAccess');
    spyOn(localStorageServiceStub, 'getItem');

    service.init();

    expect(spy).toHaveBeenCalled();
    expect(tokenServiceStub.GetCustomerAccess).not.toHaveBeenCalled();
    expect(localStorageServiceStub.getItem).not.toHaveBeenCalled();
  });

  it('should set local storage with an okta entry', () => {
    const setSpy = spyOn(localStorageServiceStub, 'setItem');
    const rmSpy = spyOn(localStorageServiceStub, 'removeItem');

    const custAccess = {
      customers: [],
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
    };

    service.setLocalStorage(custAccess as CustomerAccess, true);

    expect(rmSpy.calls.count()).toBe(1);
    expect(setSpy.calls.count()).toBe(4);
    expect(setSpy.calls.argsFor(3)).toEqual(['okta', '1']);
  });

  it('should get return "true" if okta was used to log in', () => {
    const spy = spyOn(localStorageServiceStub, 'getItem').and.returnValue('1');
    const isOkta = service.isUsingOkta();

    expect(isOkta).toBe(true);
    expect(spy).toHaveBeenCalledWith('okta');
  });

  it('should get return "false" if okta was NOT used to log in', () => {
    const spy = spyOn(localStorageServiceStub, 'getItem').and.returnValue(undefined);
    const isOkta = service.isUsingOkta();

    expect(isOkta).toBe(false);
    expect(spy).toHaveBeenCalledWith('okta');
  });
});
