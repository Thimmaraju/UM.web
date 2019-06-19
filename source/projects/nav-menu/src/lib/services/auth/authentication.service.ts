import { Injectable, NgZone, Inject } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment as env } from '@env/environment';

// services
import { LocalstorageServiceLib } from '../local-storage/localstorage.service';
import { OmniTokenService, CustomerAccess, Customer } from '../omni-token/omni-token.service';
import { CustomerContextService, CustomerContext } from '../customer-context/customercontext.service';
import { OmniTokenValidationService } from '../omni-token-validation/omni-token-validation.service';

// models
import { UserRoles } from '../../models/usertoken.interface';
import { Claims, } from '../omni-token/omni-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceLib {
  private readonly oktaKey = 'okta';

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  userName$ = new BehaviorSubject<string>('');
  userRole$ = new BehaviorSubject<UserRoles[]>([]);
  jwtHelper: JwtHelperService = new JwtHelperService();
  roles: UserRoles[] = [];
  customer: string;

  constructor(
    @Inject('LocationRef')
    private _locationRef: Location,
    private _localStorage: LocalstorageServiceLib,
    private _customerContext: CustomerContextService,
    private _router: Router,
    private _tokenService: OmniTokenService,
    // private _oktaService: OktaService,
    private _zone: NgZone,
    private _tokenValidationService: OmniTokenValidationService,
    private _activatedrouter: ActivatedRoute
  ) { }

  getToken(): Observable<string> {
    return of(this._localStorage.getItem('refresh'));
  }

  isUsingOkta(): boolean {
    return !!this._localStorage.getItem(this.oktaKey);
  }

  decodeToken(): Claims {
    return this.jwtHelper.decodeToken(this._localStorage.getItem('token'));
  }

  getCustomer(): string {
    return this.decodeToken().cci;
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

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }

  setUserRole(value: string) {
    const userRoles = value ? JSON.parse(value) : UserRoles.None;
    this.userRole$.next(userRoles);
  }

  setRole(value: string): void {
    let userRoles: UserRoles[];
    userRoles = value ? JSON.parse(value) : [];

    if (userRoles && userRoles.length > 0) {
      this.roles = userRoles;
      this.userRole$.next(userRoles);
    }
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

  setUsername(value: Claims): void {
    let name: string;
    if (value.hasOwnProperty('given_name') && value.hasOwnProperty('family_name')) {
      name = `${value.given_name} ${value.family_name}`;
    } else {
      name = value.uname;
    }

    this.userName$.next(name);
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

  clearLocalStorage(): void {
    this._localStorage.removeItem('token');
    this._localStorage.removeItem('refresh');
    this._localStorage.removeItem('url');
    this._localStorage.removeItem('customers');
    this._localStorage.removeItem(this.oktaKey);
  }

  private hasToken(): boolean {
    return !!this._localStorage.getItem('token');
  }
}
