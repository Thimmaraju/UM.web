import { Component, OnInit } from '@angular/core';
import { environment as env } from '@env/environment';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { AuthServiceLib } from '../lib/services/auth/authentication.service';
import { CustomerContextService } from '../lib/services/customer-context/customercontext.service';
import { PopupWindowProperties, PopupWindowService } from 'webcorecomponent-lib';
import { OktaPopupChangePasswordComponent } from '../lib/navigation-menu/change-password/containers/popup-change-password/okta-popup-change-password.component';

@Component({
  selector: 'pc-nav-menu',
  template: `
  <button id="ProfileLogoutButton" mat-icon-button [matMenuTriggerFor]="menu">
    <mat-icon>more_vert</mat-icon>
  </button>
  <mat-menu #menu="matMenu">
    <pc-app-list></pc-app-list>
    <button mat-menu-item (click)="redirectToProfile()" *ngIf="(hasCustomers && showProfile)">
      <mat-icon>person</mat-icon>
      <span>Profile</span>
    </button>
    <button mat-menu-item (click)="openChangePasswordDialog()" *ngIf="(showChangePassword)">
      <mat-icon>person</mat-icon>
      <span>Change Password</span>
    </button>
    <button id="LogoutButton" mat-menu-item (click)="logout()">
      <mat-icon>exit_to_app</mat-icon>
      <span>Logout</span>
    </button>
  </mat-menu>
  `,
  styles: []
})
export class NavMenuComponent implements OnInit {
  showProfile: boolean;
  hasCustomers: boolean;
  showChangePassword: boolean;
  popWindowLayout: any;
  toasterTimeout = env.toasterTimeout;

  constructor(
    private authService: AuthServiceLib,
    private router: Router,
    private _popupWindow: PopupWindowService,
    private customerContextService: CustomerContextService,
  ) { }

  ngOnInit() {
    this.showProfile = !this.authService.isUsingOkta();
    this.showChangePassword = this.authService.isUsingOkta();

    this.customerContextService.getCustomerContext()
      .pipe(
        map(ctx => !!(ctx.customer && ctx.customer.length > 0))
      )
      .subscribe(hasCustomers => this.hasCustomers = hasCustomers);
  }

  logout() {
    this.authService.logout();
  }

  redirectToProfile() {
    this.router.navigate(['profile']);
  }

  openChangePasswordDialog() {
    this.popWindowLayout = {'info' : false, 'filter' : false , 'footer' : true};

    const properties = new PopupWindowProperties();
    properties.data = {
      windowLayout: this.popWindowLayout,
    };

    this._popupWindow.show(OktaPopupChangePasswordComponent, properties);
  }
}
