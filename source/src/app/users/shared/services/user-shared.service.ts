import { Injectable } from '@angular/core';
import { OktaStatus } from '@app/users';
@Injectable({
  providedIn: 'root',
})
export class UserSharedService {
  getCustomStatusMappedtoOkta(oktaStatus: string): string {
    let returnedCustomStatus: string;
    switch (oktaStatus) {
      case 'ACTIVE':
        returnedCustomStatus = OktaStatus.ACTIVE;
        break;

      case 'DEPROVISIONED':
        returnedCustomStatus = OktaStatus.DEPROVISIONED;
        break;

      case 'LOCKED':
        returnedCustomStatus = OktaStatus.LOCKED;
        break;

      case 'PROVISIONED':
        returnedCustomStatus = OktaStatus.PROVISIONED;
        break;

      case 'RECOVERY':
        returnedCustomStatus = OktaStatus.RECOVERY;
        break;

      case 'STAGED':
        returnedCustomStatus = OktaStatus.STAGED;
        break;

      case 'SUSPENDED':
        returnedCustomStatus = OktaStatus.SUSPENDED;
        break;

      case 'PASSWORD_EXPIRED':
        returnedCustomStatus = OktaStatus.PASSWORD_EXPIRED;
        break;

      default:
        returnedCustomStatus = oktaStatus;
    }
    return returnedCustomStatus;
  }
}
