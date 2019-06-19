import { Component, Input } from '@angular/core';

@Component({
  selector: 'pc-tab-info',
  styleUrls: ['./tab-info.component.scss'],
  template: `
    <div class="tab-info-container">
      <div class="totals" *ngIf="showTotals">
        Totals&nbsp;
        <span class="inventory-reductions">
          Inventory Reduction Total:&nbsp;<strong>{{irTotal | currency:'USD':'symbol-narrow':'1.0-0'}}</strong>
        </span>
        <span class="expiring-medications">
          Expiring Medication Totals:&nbsp;<strong>{{emTotal | currency:'USD':'symbol-narrow':'1.0-0'}}</strong>
        </span>
      </div>
      <div class="sort-indicator">Sort: <strong>{{sortIndicator}}</strong></div>
    </div>
  `
})
export class TabInfoComponent {
  @Input()
  showTotals = false;

  @Input()
  irTotal = 0;

  @Input()
  emTotal = 0;

  @Input()
  sortIndicator: string;
}
