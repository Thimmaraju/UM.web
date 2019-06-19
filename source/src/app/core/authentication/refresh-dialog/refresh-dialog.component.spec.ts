import { RefreshDialogComponent } from './refresh-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { of, Observable } from 'rxjs';
import { TokenRefreshService } from '../token-refresh/token-refresh.service';

describe('Refresh Dialog Component', () => {
  const mockDialogRef: MatDialogRef<RefreshDialogComponent> = {
    close: val => of(val)
  } as any;

  const dialogMock = {
    open: (comp, config) => ({ afterClosed: () => of(false) }),
    closeAll: () => null,
    openDialogs: [] as any
  } as MatDialog;

  const tokenRefreshService = {
    hasBeenRefreshed(): Observable<boolean> {
      return of(true);
    },
    refreshToken(): void {}
  } as TokenRefreshService;

  let component: RefreshDialogComponent;

  beforeEach(() => {
    component = new RefreshDialogComponent(mockDialogRef, tokenRefreshService);
  });
  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the token has been refreshed on init', () => {
    spyOn(tokenRefreshService, 'hasBeenRefreshed').and.returnValue(of(true));
    component.ngOnInit();
    expect(tokenRefreshService.hasBeenRefreshed).toHaveBeenCalled();
  });
  it('should check if the token has been refreshed on init and close the dialog if true', () => {
    spyOn(tokenRefreshService, 'hasBeenRefreshed').and.returnValue(of(true));
    spyOn(mockDialogRef, 'close');
    component.ngOnInit();
    expect(tokenRefreshService.hasBeenRefreshed).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  it('should check if the token has been refreshed on init and not close the dialog if false', () => {
    spyOn(tokenRefreshService, 'hasBeenRefreshed').and.returnValue(of(false));
    spyOn(mockDialogRef, 'close');
    component.ngOnInit();
    expect(tokenRefreshService.hasBeenRefreshed).toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
  it('should call the Token Refresh Service refreshToken method when the button is clicked', () => {
    spyOn(tokenRefreshService, 'refreshToken');
    component.handleClick();
    expect(tokenRefreshService.refreshToken).toHaveBeenCalled();
  });
});
