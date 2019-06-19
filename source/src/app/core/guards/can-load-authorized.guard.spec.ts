import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth/auth.service';
import { CanLoadAuthorizedGuard } from './can-load-authorized.guard';
import { LocalStorageService, CustomerContextService, UserToken, UserRoles } from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';

export class AuthDataStub {
  public isRefreshTokenExpired(): boolean {
    return true;
  }
  public logout(): void {
    return;
  }
  public getRole(): string {
    return 'foo';
  }
}
let authService: AuthDataStub;

describe('Can Activate Optimization Guard', () => {
  let injector: TestBed;
  let guard: CanLoadAuthorizedGuard;
  let routerInstance: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [],
      providers: [{ provide: AuthService, useClass: AuthDataStub }, CanLoadAuthorizedGuard]
    });

    injector = getTestBed();
    guard = injector.get(CanLoadAuthorizedGuard);
    authService = injector.get(AuthService);
    routerInstance = injector.get(Router);
  });

  it('should exist', () => {
    expect(guard).toBeTruthy();
  });
  it('should reject if token is expired', () => {
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(true);
    const test = guard.canLoad();
    expect(test).toBeFalsy();
  });
  it('should not reject if token is not expired', () => {
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(false);
    const test = guard.canLoad();
    expect(test).toBeTruthy();
  });
});
