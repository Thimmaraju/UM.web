import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment as env } from '@env/environment';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { UserRoles } from '@app/core/guards/user-token.interface';

export interface CustomerAccess {
  accessToken: string;
  refreshToken: string;
  customers: Customer[];
}

export interface Customer {
  customerId: string;
  name: string;
  info: string;
  updateTime: Date;
}

export interface Claims {
  jti: string;
  rti: string;
  sub: string;
  given_name: string;
  family_name: string;
  uname: string;
  role: string;
  cs: string;
  cci: string;
  exp: string;
  iat: string;
  iss: string;
  nbf: string;
  aud: string;
  use: string;
  roles: string;
}

@Injectable()
export class TokenService {
  private customersUrl: string = env.userHost + 'v1/customers';
  private tokenUrl: string = env.userHost + 'v1/tokens';
  token: string;
  jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(private http: HttpClient, private _localStorage: LocalStorageService) {}

  GetCustomerAccess(): Observable<CustomerAccess> {
    return this.http.get<CustomerAccess>(`${this.customersUrl}`).pipe(
      map((response) => response as CustomerAccess),
      catchError((error) => throwError(error))
    );
  }

  GetCustomerAccessOkta(): Observable<CustomerAccess> {
    return this.http.get<CustomerAccess>(`${this.customersUrl}/okta`).pipe(
      map((response) => response as CustomerAccess),
      catchError((error) => throwError(error))
    );
  }

  SwitchCustomers(customerId: string): Observable<string> {
    return this.http.post(`${this.tokenUrl}/switchcustomer/${customerId}`, {}, { responseType: 'text' }).pipe(
      map((response) => response),
      catchError((error) => throwError(error))
    );
  }

  RefreshToken(customerId: string): Observable<string> {
    return this.http.post(`${this.tokenUrl}/refreshtoken/${customerId}`, {}, { responseType: 'text' }).pipe(
      map((response) => response),
      catchError((error) => throwError(error))
    );
  }

  GetCustomerAccessToken(customerId: string): Observable<CustomerAccess> {
    const refreshToken = this._localStorage.getItem('refresh');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: refreshToken,
    }).set('X-Skip-Interceptor', '');

    return this.http.post(`${this.tokenUrl}/RefreshCustomerToken/${customerId}`, {}, { headers: headers }).pipe(
      map((response) => response as CustomerAccess),
      catchError((error) => throwError(error))
    );
  }

  getToken(): Observable<string> {
    return of(this._localStorage.getItem('refresh'));
  }

  isRefreshTokenExpired(): boolean {
    this.getToken().subscribe((x) => (this.token = x));
    if (this.token && this.token.length > 0) {
      return this.isTokenExpired(this.token);
    } else {
      return true;
    }
  }
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
