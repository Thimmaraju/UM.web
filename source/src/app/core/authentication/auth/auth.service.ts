import { Injectable, NgZone, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';
import { TokenService, CustomerAccess, Customer, Claims } from '@app/core/authentication/token/token.service';
import { UserRoles } from '@app/core/guards/user-token.interface';
import { CustomerContextService, CustomerContext } from '@app/core/services/customer-context/customer-context.service';
import { TokenValidationService } from '@app/core/authentication/token-validation/token-validation.service';
import { environment as env } from '@env/environment';

@Injectable()
export class AuthService {
  private readonly oktaKey = 'okta';

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  userName$ = new BehaviorSubject<string>('');
  userRole$ = new BehaviorSubject<UserRoles[]>([]);
  jwtHelper: JwtHelperService = new JwtHelperService();
  // role: string;
  roles: UserRoles[] = [];
  userRoles: string[] = Object.keys(UserRoles);
  navigation: any[] = [];
  token: string;
  customer: string;
  assignedCustomers: Customer[] = [];
  // authConfigs: AuthConfigs = <AuthConfigs>{};

  constructor(
    @Inject('LocationRef') private _locationRef: Location,
    private _localStorage: LocalStorageService,
    private _customerContext: CustomerContextService,
    private _router: Router,
    private _tokenService: TokenService,
    // private _oktaService: OktaService,
    private _zone: NgZone,
    private _tokenValidationService: TokenValidationService
  ) {}

  getTokensOkta(): void {
    this._tokenService.GetCustomerAccessOkta().subscribe((customerAccess: CustomerAccess) => {
      this.clearLocalStorage();
      this.setLocalStorage(customerAccess, true);
      this.setAssignedCustomers(customerAccess.customers);
      this.initUser();
    });
  }

  switchCustomer(customerId: string): void {
    this._tokenService.SwitchCustomers(customerId).subscribe((newToken) => {
      const customerContext = {} as CustomerContext;
      customerContext.customer = customerId;
      customerContext.role = this.roles;
      this._localStorage.removeItem('token');
      this._localStorage.setItem('token', newToken);
      this._customerContext.setCustomerContext(customerContext);
    });
  }

  redirectToNotAuthorized() {
    this._router.navigate(['/not-authorized']);
  }

  checkRefreshToken() {
    if (this.isRefreshTokenExpired()) {
      this.logout();
    }
  }

  errorRedirect() {
    this._router.navigate(['/page-not-found']);
  }

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  setUsername(value: Claims): void {
    let name: string;
    if (value.hasOwnProperty('given_name') && value.hasOwnProperty('family_name')) {
      name = `${value.given_name} ${value.family_name}`;
    } else {
      name = value.uname;
    }

    this.userName$.next(name);
  }

  getUsername(): Observable<string> {
    return this.userName$.asObservable();
  }

  getUserRole(): Observable<UserRoles[]> {
    return this.userRole$.asObservable();
  }

  setUserRole(value: string) {
    const userRoles = value ? JSON.parse(value) : UserRoles.None;
    this.userRole$.next(userRoles);
  }

  checkForDefaultCustomerAndRedirect(customers: Customer[], byPassRedirect = false): void {
    if (this.roles.indexOf(UserRoles.PharmAdmin) >= 0) {
      this.setCustomer(this.decodeToken().cci);
      if (!byPassRedirect || this.isDefaultRoute()) {
        this._zone.run(() => {
          this._router.navigate(['/optimization']);
        });
      }
    } else if (this.roles.indexOf(UserRoles.UserAdmin) >= 0) {
      this.setCustomer(this.decodeToken().cci);
      this._router.navigate(['/users']);
    } else if (this.roles.indexOf(UserRoles.Strategist) >= 0) {
      this.checkStrategist(customers, byPassRedirect);
    } else if (this.roles.indexOf(UserRoles.OmnicellAdmin) >= 0) {
      this.checkOmnicellAdmin(customers, byPassRedirect);
    } else {
      this._router.navigate(['/not-authorized']);
    }

    /* if (this.roles.find((x) => x !== UserRoles.PharmAdmin) || this.roles.find((x) => x !== UserRoles.Strategist) ||
          this.roles.find((x) => x !== UserRoles.UserAdmin) || this.roles.find((x) => x !== UserRoles.OmnicellAdmin)) {
    }*/
  }

  checkStrategist(customers: Customer[], byPassRedirect = false): void {
    if (this.isCurrentCustomerContextSet()) {
      this.setCustomer(this.decodeToken().cci);
      if (!byPassRedirect || this.isDefaultRoute()) {
        this._router.navigate(['/discovery/']);
      }
    } else {
      this._router.navigate(['/discovery/select-customer']);
    }
  }

  checkOmnicellAdmin(customers: Customer[], byPassRedirect = false): void {
    if (this.isCurrentCustomerContextSet()) {
      this.setCustomer(this.decodeToken().cci);
      if (!byPassRedirect || this.isDefaultRoute()) {
        this._router.navigate(['/users/']);
      }
    } else {
      this._router.navigate(['/discovery/select-customer']);
    }
  }

  isDefaultRoute(): boolean {
    return this._locationRef.pathname.endsWith('/');
  }

  setAssignedCustomers(customers: Customer[]): void {
    this.assignedCustomers = customers;
  }

  getAssignedCustomers(): Observable<Customer[]> {
    if (this.assignedCustomers.length > 0) {
      return of(this.assignedCustomers);
    } else {
      let customers = this._localStorage.getItem('customers');
      customers = this.removeSpecialCharacters(customers);
      const parsedCustomers = JSON.parse(customers);
      return of(parsedCustomers);
    }
  }

  getCurrentCustomer(): Observable<Customer> {
    const currentCustomer = this.getCustomer();
    if (this.assignedCustomers.length === 0) {
      let customers = this._localStorage.getItem('customers');
      customers = this.removeSpecialCharacters(customers);
      this.assignedCustomers = JSON.parse(customers);
    }
    return of(this.assignedCustomers.find((x) => x.customerId === currentCustomer));
  }

  removeSpecialCharacters(jsonString: string) {
    return jsonString.replace(/[\/\\]/g, '');
  }

  setCustomer(name: string): void {
    this.customer = name;
    this.broadCastTenantSelection();
  }

  broadCastTenantSelection(): void {
    const customerContext = {} as CustomerContext;
    customerContext.role = this.roles;
    customerContext.customer = this.customer;

    this._customerContext.setCustomerContext(customerContext);
  }

  getCustomer(): string {
    return this.decodeToken().cci;
  }

  redirecttoLogin() {
    this.clearLocalStorage();
    // To do-Add environmnet variable to read login url
    this._locationRef.href = env.loginHost + `/?src=${this._locationRef.href}`;
  }

  logout() {
    const noUser = {} as Claims;
    // this._oktaService.endSession();
    this.setLoggedIn(false);
    this.setUserRole('');
    this.setRole('');
    this.setCustomer('');
    this.setUsername(noUser);
    this.clearLocalStorage();
    this._tokenValidationService.end();
    this._locationRef.href = env.loginHost + `/?src=${this._locationRef.href}`;
  }

  clearLocalStorage(): void {
    this._localStorage.removeItem('token');
    this._localStorage.removeItem('refresh');
    this._localStorage.removeItem('url');
    this._localStorage.removeItem('customers');
    this._localStorage.removeItem(this.oktaKey);
  }

  setLocalStorage(access: CustomerAccess, isOkta = false): void {
    this._localStorage.removeItem('token');
    this._localStorage.setItem('customers', JSON.stringify(access.customers));
    this._localStorage.setItem('token', access.accessToken);
    this._localStorage.setItem('refresh', access.refreshToken);

    if (isOkta) {
      this._localStorage.setItem(this.oktaKey, '1');
    }
  }

  convertName(role: string): string {
    return role.replace(/[^A-Za-z0-9_$]/g, '');
  }

  setRole(value: string): void {
    let userRoles: UserRoles[];
    userRoles = value ? JSON.parse(value) : [];

    if (userRoles && userRoles.length > 0) {
      this.roles = userRoles;
      this.userRole$.next(userRoles);
    }
  }

  getRole(): UserRoles[] {
    let tokenClaims: Claims;
    if (this.roles && this.roles.length > 0) {
      return this.roles;
    } else {
      if (!this.isRefreshTokenExpired()) {
        tokenClaims = this.decodeToken();
        this.setRole(tokenClaims.roles);
        return this.roles;
      }
    }
  }

  isRefreshTokenExpired(): boolean {
    this.getToken().subscribe((x) => (this.token = x));
    if (this.token && this.token.length > 0) {
      return this.jwtHelper.isTokenExpired(this.token);
    } else {
      return true;
    }
  }

  isCurrentCustomerContextSet(): boolean {
    this.getAccessToken().subscribe((x) => (this.token = x));
    if (this.token && this.token.length > 0) {
      return this.decodeToken().hasOwnProperty('cci') ? this.decodeToken().cci.length > 0 : false;
    }
  }

  getNavigation(): any[] {
    return this.navigation;
  }

  getAccessToken(): Observable<string> {
    return of(this._localStorage.getItem('token'));
  }

  getToken(): Observable<string> {
    return of(this._localStorage.getItem('refresh'));
  }

  isUsingOkta(): boolean {
    return !!this._localStorage.getItem(this.oktaKey);
  }

  decodeToken(): Claims {
    return this.jwtHelper.decodeToken(this._localStorage.getItem('token'));
  }

  hasRefreshTokenExpired(): void {
    this._tokenValidationService.refreshTokenHasExpired().subscribe((hasRefreshTokenExpired) => {
      if (hasRefreshTokenExpired) {
        this.logout();
      }
    });
  }

  setAccessToken(customerId: string, isOkta: boolean) {
    this._tokenService.GetCustomerAccessToken(customerId).subscribe((data) => {
      this.setLocalStorage(data, isOkta);
      this.initUser(true);
      this._router.navigate(['/user-list']);
    });
  }

  init() {
    if (this._locationRef.pathname.endsWith('idpcallback')) {
      return;
    } else {
      this.getTokens();
    }
  }

  initUser(byPassRedirect = false): void {
    if (this.isRefreshTokenExpired()) {
      this.logout();
      return;
    }

    const user = this.decodeToken();
    const { roles, cs } = user;
    const customers = JSON.parse(cs);
    const userRoles = JSON.parse(roles);

    if (userRoles && userRoles.length > 0) {
      this.setRole(roles);
    }

    this.checkForDefaultCustomerAndRedirect(customers, byPassRedirect);
    this.setLoggedIn(true);
    this.setUsername(user);
    this._tokenValidationService.start();
    this.hasRefreshTokenExpired();
  }

  private getTokens(): void {
    if (!this.isCurrentCustomerContextSet() && this.hasToken()) {
      this._tokenService.GetCustomerAccess().subscribe((customerAccess: CustomerAccess) => {
        this.clearLocalStorage();
        this.setLocalStorage(customerAccess);
        this.setAssignedCustomers(customerAccess.customers);
        this.initUser();
      });
    } else {
      this.initUser();
    }
  }

  private hasToken(): boolean {
    return !!this._localStorage.getItem('token');
  }
}
