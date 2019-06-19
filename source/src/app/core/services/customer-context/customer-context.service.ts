import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserRoles } from '@app/core/guards/user-token.interface';

export interface CustomerContext {
  customer: string;
  role: UserRoles[];
}

@Injectable()
export class CustomerContextService {
  emptyCustomerContext = {} as CustomerContext;

  customerContext$ = new BehaviorSubject<CustomerContext>(this.emptyCustomerContext);

  constructor() {}

  setCustomerContext(value: CustomerContext): void {
    this.customerContext$.next(value);
  }

  getCustomerContext(): Observable<CustomerContext> {
    return this.customerContext$.asObservable();
  }
}
