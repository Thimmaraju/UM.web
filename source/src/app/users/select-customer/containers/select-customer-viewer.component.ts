import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, map, take } from 'rxjs/operators';
import { CustomerContextService, CustomerContext, AuthService, UserRoles, Customer } from '@app/core';

@Component({
  selector: 'pc-select-customer-viewer',
  styleUrls: ['select-customer-viewer.component.scss'],
  template: `
    <div fxLayout="row" class="container">
      <div fxFlex="1 1 35%"></div>
      <mat-card fxFlex="1 1 30%">
        <mat-card-title>
          <h4>Please select a customer to begin</h4>
        </mat-card-title>
        <mat-card-content>
          <div fxLayout="row" fxFlex="1 auto">
            <button id="SelectCustomer" mat-icon-button [matMenuTriggerFor]="menu">
              <span>Select a customer</span>
              <mat-icon>filter_list</mat-icon>
            </button>
            <mat-menu #menu="matMenu" [overlapTrigger]="false" xPosition="after">
              <button
                id="SelectCustomer{{ customer?.customerId }}Button"
                *ngFor="let customer of (customers$ | async); trackBy: itemTrackBy"
                (click)="handleTenantSelected(customer?.customerId)"
                mat-menu-item
              >
                {{ customer?.name }}
              </button>
            </mat-menu>
          </div>
        </mat-card-content>
      </mat-card>
      <div fxFlex="1 1 35%"></div>
    </div>
  `,
})
export class SelectCustomerViewerComponent implements OnInit, OnDestroy {
  customers$: Observable<Customer[]>;
  unsubscribe$ = new Subject();

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _customerContext: CustomerContextService
  ) {}

  ngOnInit() {
    this.checkIfTenantSelected();
  }

  checkIfTenantSelected(): void {
    if (!this._authService.isRefreshTokenExpired() && this._authService.isCurrentCustomerContextSet()) {
      this._authService.initUser();
    } else {
      this.loadTenants();
    }
  }

  loadTenants(): void {
    this.customers$ = this._authService.getAssignedCustomers();
  }

  handleTenantSelected(customerId: string): void {
    let userRole: UserRoles[];
    this._authService.getUserRole().subscribe((x) => (userRole = x));
    const customerContext = {} as CustomerContext;
    customerContext.customer = customerId;
    customerContext.role = userRole;
    this._authService.switchCustomer(customerId);
    this._authService.initUser();
    this._customerContext
      .getCustomerContext()
      .pipe(
        filter((x) => x.role && x.role.find((y) => y === UserRoles.Strategist) && x.customer !== ''),
        take(1),
        map((_) => {
          this.navigateToDashboard();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((_) => _);
  }

  navigateToDashboard(): void {
    this._router.navigate(['discovery']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  itemTrackBy(index: number, item: any) {
    return index;
  }
}
