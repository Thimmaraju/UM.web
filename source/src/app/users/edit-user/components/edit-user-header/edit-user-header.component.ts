import { Component, Input } from '@angular/core';
import { UserLabels } from '@app/users';

@Component({
  selector: 'pc-edit-user-header',
  styleUrls: ['./edit-user-header.component.scss'],
  template: `
    <div class="subnav">
      <div class="row">
        <div class="col-back" [routerLink]="'/user-list'">
          <img [src]="usersBackButton" />
        </div>
        <div class="col">
          <h5>
            {{ labels.USERNAME }}
          </h5>
          <h5>{{ userName }}</h5>
        </div>
        <div class="col">
          <h5>{{ labels.FIRSTNAME }}</h5>
          <h5 class="subnavh5last">{{ firstName }}</h5>
        </div>
        <div class="col">
          <h5>{{ labels.LASTNAME }}</h5>
          <h5>{{ lastName }}</h5>
        </div>
      </div>
    </div>
  `,
})
export class EditUserHeaderComponent {
  @Input() userName: string;
  @Input() firstName: string;
  @Input() lastName: string;
  usersBackButton = require('../../../../../assets/UsersBackButton.png');
  labels = new UserLabels();
}
