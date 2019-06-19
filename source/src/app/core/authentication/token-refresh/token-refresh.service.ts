import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment as env } from '@env/environment';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { TokenService } from '../token/token.service';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class TokenRefreshService {
  private tokenUrl: string = env.userHost + 'v1/tokens';
  tokenRefreshed$ = new Subject<boolean>();
  jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private _http: HttpClient,
    private _localStorage: LocalStorageService,
    private _tokenService: TokenService
  ) {}

  hasBeenRefreshed(): Observable<boolean> {
    return this.tokenRefreshed$.asObservable();
  }

  Post(): Observable<string> {
    const refreshToken = this._localStorage.getItem('refresh');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: refreshToken,
    }).set('X-Skip-Interceptor', '');

    return this._http.post(
      `${this.tokenUrl}/refreshtoken/${this.getCustomerFromToken()}`,
      {},
      {
        headers: headers,
        responseType: 'text',
      }
    );
  }

  getCustomerFromToken(): string {
    return this.jwtHelper.decodeToken(this._localStorage.getItem('token')).cci;
  }

  refreshToken() {
    this.Post()
      .pipe(catchError((error) => throwError(error)))
      .subscribe(
        (newToken) => {
          this._localStorage.setItem('token', newToken);
          this.tokenRefreshed$.next(true);
        },
        (error: any) => {
          this._tokenService.isRefreshTokenExpired();
          this.tokenRefreshed$.next(false);
        }
      );
  }
}
