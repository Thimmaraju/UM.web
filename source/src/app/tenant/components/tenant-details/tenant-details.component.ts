import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Customer } from '@app/core';

@Component({
  selector: 'pc-tenant-details',
  styleUrls: ['tenant-details.component.scss'],
  template: `
    <div id="TenantContainer" class="facility-context" fxLayout="row">
      <div fxFlex="1 1 auto">
        <span class="facility-context__facility-name">{{selectedTenantName}}</span>
        <button id="SelectTenantButton" mat-icon-button [disabled]="displaySelection" [matMenuTriggerFor]="menu" *ngIf="selectedTenantName && tenants.length > 1">
          <mat-icon>filter_list</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button [id]="'Tenant' + (tenant?.customerId) + 'Button'" *ngFor="let tenant of tenants; trackBy:itemTrackBy;" (click)="newTenantSelected(tenant?.customerId)"
            mat-menu-item> {{ tenant?.name }}</button>
        </mat-menu>
      </div>
    </div>
  `
})
export class TenantDetailsComponent implements OnChanges, OnInit {
  selectedTenantName: string;
  displaySelection = false;
  selectedTenant: any;

  constructor() {}

  @Input()
  selectedTenentId: string;

  @Input()
  tenants: Customer[];

  @Input()
  isSelectionDisabled: string;

  @Output()
  newTenant: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.doChecks();
  }

  ngOnChanges(): void {
    this.doChecks();
  }

  doChecks(): void {
    this.checkIfSelected();
    this.checkIfSelectionIsDisabled();
  }

  checkIfSelected(): void {
    if (this.selectedTenentId) {
      this.selectedTenantName = this.findTenantName(this.selectedTenentId, this.tenants);
    } else {
      this.checkIfDefault();
    }
  }

  checkIfSelectionIsDisabled(): void {
    if (this.isSelectionDisabled === 'true') {
      this.displaySelection = false;
    } else {
      this.displaySelection = true;
    }
  }

  checkIfDefault(): void {
    if (this.tenants && this.tenants.length === 1) {
      this.selectedTenant = this.tenants[0].customerId;
      this.newTenantSelected(this.selectedTenant);
    }
  }

  findTenantName(tenantId: string, tenants: Customer[]): string {
    if (tenants && tenants.length > 0) {
      return tenants.find(tenant => tenant.customerId === tenantId).name;
    }
  }

  newTenantSelected(customer: string) {
    this.newTenant.emit(customer);
  }

  itemTrackBy(index: number, item: any) {
    return index;
  }
}
