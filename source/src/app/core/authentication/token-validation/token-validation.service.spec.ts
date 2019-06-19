import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { TokenRefreshService } from '../token-refresh/token-refresh.service';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';
import { TokenValidationService } from './token-validation.service';

describe('Core token validation service', () => {
  const dialogMock = {
    open: (comp, config) => ({ afterClosed: () => of(false) }),
    closeAll: () => null,
    openDialogs: [] as any
  } as MatDialog;

  const localStorageService: LocalStorageService = {
    getItem: () => 'foo'
  } as any;

  const tokenRefreshService: TokenRefreshService = {
    hasBeenRefreshed: () => of(true)
  } as any;

  const mockNgZone = {
    run: fn => {}
  } as NgZone;

  let service: TokenValidationService;

  beforeEach(() => {
    service = new TokenValidationService(localStorageService, dialogMock, tokenRefreshService, mockNgZone);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });
  it('should get tokens', () => {
    spyOn(localStorageService, 'getItem');
    spyOn(service, 'checkIfCustomerIsSet');
    service.getTokens();
    expect(localStorageService.getItem).toHaveBeenCalledTimes(2);
  });
  it('should check Refresh Token Expiration and publish if expired', () => {
    spyOn(service.isRefreshTokenValid$, 'next');
    spyOn(service.isTokenValid$, 'next');
    spyOn(service, 'closeDialog');
    service.checkRefreshTokenExpiration(true);
    expect(service.isRefreshTokenValid$.next).toHaveBeenCalled();
    expect(service.isTokenValid$.next).toHaveBeenCalled();
    expect(service.closeDialog).toHaveBeenCalled();
  });
  it('should check Refresh Token Expiration and not publish if not expired', () => {
    spyOn(service.isRefreshTokenValid$, 'next');
    spyOn(service.isTokenValid$, 'next');
    spyOn(service, 'closeDialog');
    service.checkRefreshTokenExpiration(false);
    expect(service.isRefreshTokenValid$.next).not.toHaveBeenCalled();
    expect(service.isTokenValid$.next).not.toHaveBeenCalled();
    expect(service.closeDialog).not.toHaveBeenCalled();
  });
  it('should check access token is expired and open dialog if it is', () => {
    spyOn(service, 'openDialog');
    service.checkAccessTokenExpiration(true, true);
    expect(service.openDialog).toHaveBeenCalled();
  });
  it('should check access token is expired and not open dialog if it is not expired', () => {
    spyOn(service, 'openDialog');
    service.checkAccessTokenExpiration(false, true);
    expect(service.openDialog).not.toHaveBeenCalled();
  });
  it('should return isRefreshTokenValid', () => {
    spyOn(service, 'isRefreshTokenValid$').and.returnValue(of(true));
    service.isRefreshTokenValid$.subscribe(x => expect(x).toBeTruthy);
  });
  it('should close the dialog', () => {
    spyOn(dialogMock, 'closeAll');
    service.closeDialog();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
  it('should open dialog', () => {
    spyOn(mockNgZone, 'run').and.callFake(fn => fn());
    spyOn(dialogMock, 'open');
    service.openDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });
  it('auto logout a strategist if they dont select a customer before the access times out', () => {
    spyOn(service, 'openDialog');
    spyOn(service.isRefreshTokenValid$, 'next');
    spyOn(service.isTokenValid$, 'next');
    service.checkAccessTokenExpiration(true, false);
    expect(service.openDialog).not.toHaveBeenCalled();
    expect(service.isRefreshTokenValid$.next).toHaveBeenCalled();
    expect(service.isTokenValid$.next).toHaveBeenCalled();
  });
});
