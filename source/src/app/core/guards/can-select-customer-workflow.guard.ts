import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/core';
import { UserRoles } from './user-token.interface';

@Injectable()
export class CanSelectCustomerWorkflowGuard implements CanActivate {
  constructor(private router: Router, private _authService: AuthService) {}

  canActivate(): boolean {
    if (
      !(
        this._authService.getRole().find((x) => x === UserRoles.Strategist) ||
        this._authService.getRole().find((x) => x === UserRoles.OmnicellAdmin)
      )
    ) {
      this.router.navigate(['/not-authorized']);
      return false;
    } else {
      return true;
    }
  }
}
