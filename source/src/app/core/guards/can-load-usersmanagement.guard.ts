import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '@app/core';
import { UserRoles } from './user-token.interface';

@Injectable()
export class CanLoadUserManagementGuard implements CanLoad {
  constructor(private router: Router, private _authService: AuthService) {}

  canLoad(): boolean {
    if (
      this._authService.getRole().find((x) => x === UserRoles.OmnicellAdmin) ||
      this._authService.getRole().find((x) => x === UserRoles.UserAdmin) ||
      this._authService.getRole().find((x) => x === UserRoles.Strategist)
    ) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}
