import { Component } from '@angular/core';

@Component({
  selector: 'pc-not-authorized',
  styleUrls: ['not-authorized.component.scss'],
  template: `
  <div class="background">
    <div class="gradient">
      <div class="container">
        <h1>Not Authorized</h1>
        <h1>If you feel you have reached this in error, contact an administrator</h1>
      </div>
    </div>
  </div>
  `
})
export class NotAuthorizedComponent {
  constructor() {}
}
