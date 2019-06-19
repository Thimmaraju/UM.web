import { TestBed, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth/auth.service';
import { CanLoadUserManagementGuard } from './can-load-usersmanagement.guard';
import { UserRoles } from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenRefreshService } from '../authentication/token-refresh/token-refresh.service';

export class AuthDataStub {
  public isTokenExpired(): boolean {
    return true;
  }
  public logout(): void {
    return;
  }
  public getRole(): string {
    return 'foo';
  }
}

export class TokenRefreshServiceStub {
  public Post(): void {}
}

let authService: AuthDataStub;
let tokenRefreshService: TokenRefreshServiceStub;

describe('Can load User Management', () => {
  let injector: TestBed;
  let guard: CanLoadUserManagementGuard;
  let routerInstance: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [],
      providers: [
        { provide: AuthService, useClass: AuthDataStub },
        { provide: TokenRefreshService, useClass: TokenRefreshServiceStub },
      ],
    });

    injector = getTestBed();
    guard = injector.get(CanLoadUserManagementGuard);
    authService = injector.get(AuthService);
    routerInstance = injector.get(Router);
    tokenRefreshService = injector.get(TokenRefreshService);
  });

  xit('should exist', () => {
    expect(guard).toBeTruthy();
  });
  xit('should reject if role is incorrect', () => {
    spyOn(authService, 'isTokenExpired').and.returnValue(false);
    spyOn(authService, 'getRole').and.returnValue(UserRoles.PharmAdmin);
    spyOn(routerInstance, 'navigate');
    const test = guard.canLoad();
    expect(test).toBeFalsy();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });
  xit('should return ture if role is correct', () => {
    spyOn(authService, 'isTokenExpired').and.returnValue(false);
    spyOn(authService, 'getRole').and.returnValue(UserRoles.UserAdmin);
    spyOn(routerInstance, 'navigate');
    const test = guard.canLoad();
    expect(test).toBeTruthy();
    expect(routerInstance.navigate).not.toHaveBeenCalled();
  });
});
