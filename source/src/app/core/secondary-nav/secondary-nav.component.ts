import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CustomerContextService, AuthService, CustomerContext, Customer } from '@app/core';

@Component({
  selector: 'pc-secondary-nav',
  styleUrls: ['secondary-nav.component.scss'],
  template: `
    <nav>
      <div id="SecondaryNavContainer" class="secondary-nav-container" fxLayout="row">
        <div fxFlex="1 1 2%"></div>
        <div fxFlex="1 1 30%" fxLayout  fxLayoutAlign="start center" >
            <pc-tenant-details
                [selectedTenentId]="selectedId"
                [tenants]="customers$ | async"
                [isSelectionDisabled]="isDisabled"
                (newTenant)="selectTenant($event)" >
            </pc-tenant-details>
        </div>
      </div>
    </nav>
  `
})
export class SecondaryNavComponent implements OnInit {
  customers$: Observable<Customer[]>;
  selectedId: string;
  isDisabled: boolean;

  constructor(
    private _customerContext: CustomerContextService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this.customers$ = this._authService.getAssignedCustomers();
    this.checkIfTenantSelected();

    this._customerContext.getCustomerContext().subscribe((customerContext: CustomerContext) => {
      this.setTenantId(customerContext.customer);
    });

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this._activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(route => this.setSelectionDisabled(route));
  }

  setSelectionDisabled(routeDataProperty: any) {
    if (routeDataProperty && routeDataProperty.hasOwnProperty('customerFilter')) {
      this.isDisabled = routeDataProperty['customerFilter'];
    }
  }

  checkIfTenantSelected(): void {
    const selectedTenant = this._authService.getCustomer();
    if (selectedTenant !== null) {
      this.setTenantId(selectedTenant);
    }
  }

  setTenantId(tenantId: string): void {
    this.selectedId = tenantId;
  }

  selectTenant(tenantId: string) {
    this._authService.switchCustomer(tenantId);
  }
}
