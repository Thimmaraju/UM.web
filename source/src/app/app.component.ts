import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { URLSearchParams } from '@angular/http';

import { routerTransition, AuthService, UserRoles, LocalStorageService } from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition],
})
export class AppComponent implements OnInit {
  navigation: any[];
  isLoggedIn: Observable<boolean>;
  userName: Observable<string>;
  userRole$: Observable<UserRoles[]>;
  stratigistRole: string;
  refreshtoken: string;
  token: string;
  customer: string;

  constructor(
    @Inject('AppLogo') public logo,
    private _authService: AuthService,
    private _router: Router,
    private _localStorageservice: LocalStorageService
  ) {}

  ngOnInit() {
    if (!this._authService.isCurrentCustomerContextSet()) {
      const params = new URLSearchParams(window.location.search);
      const reftok = params.get('?t');
      const custname = params.get('cci');
      const isOkta = params.get('o');
      if (reftok) {
        this._localStorageservice.setItem('refresh', reftok);
        this._authService.setAccessToken(custname, isOkta === 'true');
        this.isLoggedIn = this._authService.isLoggedIn();
      } else {
        this._authService.redirecttoLogin();
      }
    } else {
      this.setValues();
    }
  }

  setValues() {
    this._authService.initUser(true);
    this.isLoggedIn = of(true);
    this.userName = this._authService.getUsername();
    this.userRole$ = this._authService.getUserRole();
    this.stratigistRole = UserRoles.Strategist;
  }

  logout() {
    this._authService.logout();
  }

  redirectToProfile() {
    this._router.navigate(['profile']);
  }
}
