import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '@app/core';

@Injectable()
export class CanLoadAuthorizedGuard implements CanLoad {
  constructor(private router: Router, private _authService: AuthService) {}

  canLoad(): boolean {
    if (this._authService.isRefreshTokenExpired()) {
      return false;
    } else {
      return true;
    }
  }
}
