import { Component, Input, Output, EventEmitter } from '@angular/core';

// model
import { UserLabels, UserRole } from '@app/users';

@Component({
  selector: 'pc-userrole',
  styleUrls: ['./userrole.component.scss'],
  template: `
    <div class="userrole">
      <oc-grid #ocgrid ocgridfilter="false" style="height:280px">
        <ng-container class="ocgridheader">
          <div class="first"></div>
          <div class="rolename">Role Name</div>
          <div class="col width-common30 nowrap">Role Description</div>
          <div class="gridrightmarginheader">Assigned</div>
        </ng-container>
        <ng-container class="ocgridbody">
          <div class="row" *ngFor="let item of userRoles">
            <div class="first"><img [src]="pendingimage" *ngIf="item.isPending" /></div>
            <div class="col" [attr.data-title]="'rolename'" style="display:none">{{ item.id }}</div>
            <div class="rolename" [attr.data-title]="'rolename'">{{ item.rolename }}</div>
            <div class="col width-common30 nowrap roledesc" ocGridColwrap [attr.data-title]="'roledescription'">
              {{ item.roledescription }}
            </div>
            <div class="togglebuttonc">
              <oc-button-toggle
                [disabled]="isDisabled()"
                [onLabel]="'Yes'"
                [offLabel]="'No'"
                [(ngModel)]="item.userAssigned"
                (change)="rolechanged(item)"
              >
              </oc-button-toggle>
            </div>
          </div>
        </ng-container>
      </oc-grid>
    </div>
  `,
})
export class UserroleComponent {
  labelsforuser = new UserLabels();
  isRoleChanged = true;
  @Input() currentuserId: string;
  @Input() userRoles: UserRole[];
  @Input() isADUser: boolean;
  @Output() changeRole = new EventEmitter();
  pendingimage = require('../../../../../assets/PendingBadgeSlate.png');
  constructor() {}

  rolechanged(item: any) {
    if (item) {
      item.isPending = item.isPending ? false : !item.isPending ? true : false;
      this.changeRole.emit(item);
    }
  }

  isDisabled(): boolean {
    return this.isADUser;
  }
}
