import { Injectable, NgZone } from '@angular/core';
import { Observable, interval, Subject, merge, empty } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { RefreshDialogComponent } from '../refresh-dialog/refresh-dialog.component';
import { TokenRefreshService } from '../token-refresh/token-refresh.service';

@Injectable()
export class TokenValidationService {
  private _jwtHelper: JwtHelperService = new JwtHelperService();
  interval$ = interval(5000);
  isAccessTokenExpired = false;
  isTokenValid$ = new Subject<boolean>();
  isRefreshTokenValid$ = new Subject<boolean>();

  constructor(
    private _localStorage: LocalStorageService,
    private _matDialog: MatDialog,
    private _tokenRefreshService: TokenRefreshService,
    private _zone: NgZone
  ) {}

  start(): void {
    const pause$ = this.isTokenValid$;
    const resume$ = this._tokenRefreshService.hasBeenRefreshed();
    merge(pause$, resume$)
      .pipe(
        startWith(true),
        switchMap((val) => (val ? this.interval$ : empty()))
      )
      .subscribe((_) => {
        const { accessToken, refreshToken, isCustomerSet } = this.getTokens();
        if (accessToken && refreshToken) {
          const isRefreshTokenExpired = this.isTokenExpired(refreshToken);
          this.checkRefreshTokenExpiration(isRefreshTokenExpired);
          this.isAccessTokenExpired = this.isTokenExpired(accessToken);
          this.checkAccessTokenExpiration(this.isAccessTokenExpired, isCustomerSet);
        }
      });
  }

  end() {
    this.isTokenValid$.next(false);
  }

  getTokens() {
    return {
      accessToken: this._localStorage.getItem('token'),
      refreshToken: this._localStorage.getItem('refresh'),
      isCustomerSet: this.checkIfCustomerIsSet(),
    };
  }

  checkRefreshTokenExpiration(isRefreshTokenExpired: boolean): void {
    if (isRefreshTokenExpired) {
      this.isRefreshTokenValid$.next(true);
      this.isTokenValid$.next(false);
      this.closeDialog();
    }
  }

  checkAccessTokenExpiration(isAccessTokenExpired: boolean, isCustomerSet: boolean): void {
    if (isAccessTokenExpired && isCustomerSet) {
      this.openDialog();
    } else if (isAccessTokenExpired && !isCustomerSet) {
      this.isRefreshTokenValid$.next(true);
      this.isTokenValid$.next(false);
    }
  }

  isTokenExpired(token: string): boolean {
    return this._jwtHelper.isTokenExpired(token);
  }

  checkIfCustomerIsSet(): boolean {
    return this._jwtHelper.decodeToken(this._localStorage.getItem('token')).cci ? true : false;
  }

  refreshTokenHasExpired(): Observable<boolean> {
    return this.isRefreshTokenValid$.asObservable();
  }

  closeDialog(): void {
    this._matDialog.closeAll();
  }

  openDialog(): void {
    if (this._matDialog.openDialogs && this._matDialog.openDialogs.length > 0) {
      return;
    }
    this._zone.run(() => {
      this._matDialog.open<RefreshDialogComponent>(RefreshDialogComponent, { width: '50vw', disableClose: true });
    });
  }
}
