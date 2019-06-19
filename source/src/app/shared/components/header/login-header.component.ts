import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pc-login-header',
  styleUrls: ['./login-header.component.scss'],
  template: `
    <header id="AppHeader">
      <div fxLayout="row" fxLayoutAlign="center" class="login-header">
        <div class="logo-container">
          <img [src]="logoUrl" />
        </div>
      </div>
    </header>
  `
})
export class LoginHeaderComponent {
  logoUrl = '../../../assets/oc-logo-large-white-text.png';
}
