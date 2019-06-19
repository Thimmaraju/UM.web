import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment as env } from '@env/environment';
import { CustomerContextService } from '../services/customer-context/customer-context.service';
import { AuthService } from '../authentication/auth/auth.service';
import { PopupWindowProperties, PopupWindowService } from 'webcorecomponent-lib';
import { PopupChangepasswordComponent } from '@app/users/change-password/containers/popup-changepassword/popup-changepassword.component';

@Component({
  selector: 'pc-nav',
  styleUrls: ['./nav.component.scss'],
  template: `
    <header>
      <nav>
        <div id="LoggedInHeaderContainer" fxLayout="row" *ngIf="(isLoggedIn | async)">
          <span *ngIf="hasCustomers">
            <button [id]="('Nav' + (item.label | titlecase | trim: true) + 'Button')" mat-button class="nav-button" *ngFor="let item of navigation" [routerLink]="[item.link]"
              routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">
              <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
              <span fxShow [fxShow.xs]="false" fxShow [fxShow.md]="false">{{ item.label }}</span>
            </button>
          </span>
          <div fxFlex="1 1 auto"></div>
          <div fxFlexAlign="end">
            <span class="image-icon"><img [src]="logo" /> </span>
            <span class="product-name">User Management</span>
            <span class="user-name" *ngIf="(userName | async)">
              {{userName | async}}
            </span>
            <pc-nav-menu fxShow [fxShow.xs]="false" [fxShow.sm]="false" [fxShow.md]="false"></pc-nav-menu>
          </div>
        </div>
        <div id="LoggedOutLogoContainer" fxLayout="row" fxLayoutAlign="center end" *ngIf="!(isLoggedIn | async)">
          <img [src]="logo" />
        </div>
      </nav>
    </header>
`
})
export class NavComponent implements OnInit {
  logo = require('../../../assets/Omnicell Logo White-30px high-02.png');
  version = env.version.app;
  navigation: any[] = [];
  isLoggedIn: Observable<boolean>;
  userName: Observable<string>;
  userRole$: Observable<string>;
  progressBarMode: string;
  showProfile: boolean;
  hasCustomers: boolean;
  showChangePassword: boolean;
  popWindowLayout: any;
  toasterTimeout = env.toasterTimeout;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _popupWindow: PopupWindowService,
    private customerContextService: CustomerContextService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService
      .isLoggedIn()
      .pipe(tap(x => (this.navigation = this.authService.getNavigation())));

    this.userName = this.authService.getUsername();
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

    this._popupWindow.show(PopupChangepasswordComponent, properties);
  }
}
