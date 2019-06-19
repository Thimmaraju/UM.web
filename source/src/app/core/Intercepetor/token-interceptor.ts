import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AuthService } from '../authentication/auth/auth.service';
import { TokenRefreshService, InterceptorSkipHeader } from '../authentication/token-refresh/token-refresh.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isUpdating = false;
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private offsetSeconds = 30000;

  constructor(
    private _localStorageService: LocalStorageService,
    private _authService: AuthService,
    private _tokenRefreshService: TokenRefreshService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const JWT = this._localStorageService.getItem('token');

    if (req.headers.has(InterceptorSkipHeader)) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      return next.handle(req.clone({ headers }));
    }
    req = this.setHeaders(req, JWT);

    return next.handle(req).pipe(
      tap((_) => {
        const expirationLeft = this.jwtHelper.getTokenExpirationDate(JWT).getTime() - Date.now();
        if (expirationLeft < this.offsetSeconds && !this.isUpdating) {
          this.isUpdating = true;
          this.refreshToken();
        }
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>err).status) {
            case 400:
              return throwError(err);
            case 401:
              if (err.url.toLowerCase().indexOf('/facility') < 0) { this._authService.redirectToNotAuthorized(); }
              return throwError(err);
            case 403:
              this._authService.checkRefreshToken();
              return throwError(err);
          }
        }
      })
    );
  }

  refreshToken() {
    this._tokenRefreshService
      .Post()
      .pipe(catchError((error) => throwError(error)))
      .subscribe(
        (newToken) => {
          this._localStorageService.setItem('token', newToken);
          this.isUpdating = false;
        },
        (error: any) => {
          this.isUpdating = false;
          this._authService.checkRefreshToken();
        }
      );
  }

  setHeaders(req: HttpRequest<any>, JWT: string): HttpRequest<any> {
    return (req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'gzip',
        Authorization: JWT,
      },
    }));
  }
}
