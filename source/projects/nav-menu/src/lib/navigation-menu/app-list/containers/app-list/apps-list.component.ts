import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, forkJoin } from 'rxjs';
import { switchMap, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { environment as env } from '@env/environment';

// services
import { AppListService } from '../../../../services/app-list/app-list.service';
import { AuthServiceLib } from '../../../../services/auth/authentication.service';
import { CustomerContextService, CustomerContext } from '../../../../services/customer-context/customercontext.service';

// models
import { AppList } from '../../../../models/app-list.interface';

@Component({
  selector: 'pc-app-list',
  styleUrls: ['./apps-list.component.scss'],
  template: `
    <button mat-menu-item *ngFor="let app of applist" (click)="openApp(app.url)">
      <img class="appIcon" [src]="app.iconurl" />
      <span>{{ app.name }}</span>
    </button>
  `,
})
export class AppsListComponent implements OnInit, OnDestroy {
  refreshToken: string;
  loaded = false;
  url: string;
  customer: string;
  applist: AppList[];
  isOkta: string;
  unsubscribe$ = new Subject();
  currentApp: string;

  constructor(
    private _authService: AuthServiceLib,
    private _applistservice: AppListService,
    private _customerContext: CustomerContextService
  ) { }

  ngOnInit() {
    this._customerContext
      .getCustomerContext()
      .pipe(
        filter((x) => x.customer !== ''),
        switchMap((customerContext: CustomerContext) =>
          forkJoin(this._authService.getToken(), this._applistservice.getApps())
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.buildURLSwithtokens(data[0]);
        this.loadApps(data[1]);
      });
    this.isOkta = String(this._authService.isUsingOkta());
  }

  buildURLSwithtokens(currentRefrestoken: any) {
    this.customer = this._authService.getCustomer();
    this.refreshToken = currentRefrestoken;
  }

  loadApps(data) {
    this.applist = data;
    this.applist.forEach((app) => {
      app.url = `${app.url}?t=${this.refreshToken}&cci=${this.customer}&o=${this.isOkta}`;
    });
    this.loaded = true;

    if (this.isOkta) {
      this.filterApps(this.applist);
    }
  }

  // hide apps based on role only when user is logged in by Okta, else show all the apps
  filterApps(apps: AppList[]) {
    const currentAppUrl: string = window.location.href;
    const appName = env.appName.name;

    if (appName.toLocaleLowerCase().indexOf('generalledger') > 0) {
      this.currentApp = 'General Ledger';
    } else if (appName.toLocaleLowerCase().indexOf('globalformulary') > 0) {
      this.currentApp = 'Global Formulary';
    } else if (appName.toLocaleLowerCase().indexOf('omnicellperformancecenter') > 0) {
      this.currentApp = 'Performance Center';
    } else if (appName.toLocaleLowerCase().indexOf('usermanagement') > 0) {
      this.currentApp = 'User Management';
    }

    this.applist = apps.filter((app) => app.name !== this.currentApp);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openApp(appurl: string) {
    window.open(appurl, '_blank');
  }
}
