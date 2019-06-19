import { Component, Input } from '@angular/core';

@Component({
  selector: 'pc-tab-header',
  styleUrls: ['./tab-header.component.scss'],
  template: `
    <div id="Tab{{heading | titlecase | trim: true}}" class="tab-header">
      {{ heading }}&nbsp;
      <span class="count-badge" *ngIf="showBadge && (badgeCount > 0 || showWhenEmpty)"> {{ badgeCount }} </span>
    </div>
  `
})
export class TabHeaderComponent {
  @Input()
  heading: string;

  @Input()
  badgeCount = 0;

  @Input()
  showBadge = false;

  @Input()
  showWhenEmpty = false;

  constructor() { }
}
