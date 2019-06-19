import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CoreModule, TokenInterceptor, CanSelectCustomerWorkflowGuard, CanLoadAuthorizedGuard } from '@app/core';

import { SharedModule } from '@app/shared';
import { StaticModule } from '@app/static';
import { TenantModule } from '@app/tenant';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { UsersModule } from '@app/users/users.module';

import { IE11_BROWSER_AGENT } from '@app/constants';
import { BrowserAgents } from '@app/shared/models/browser-agents.enum';
import { NoCacheInterceptor } from '@app/core/Intercepetor/no-cache.interceptor';
import 'hammerjs';
import { NavMenuModule } from '../../projects/nav-menu/src/public_api';

const logo = require('../assets/Omnicell Logo White-30px high-02.png');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    StaticModule,
    TenantModule,
    UsersModule,
    AppRoutingModule,
    NgProgressModule.forRoot({ meteor: false, spinner: false }),
    NgProgressHttpModule.forRoot(),
    NavMenuModule,
  ],
  exports: [],
  providers: [
    { provide: IE11_BROWSER_AGENT, useValue: navigator.userAgent.includes(BrowserAgents.IE11) },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true, deps: [IE11_BROWSER_AGENT] },
    CanSelectCustomerWorkflowGuard,
    CanLoadAuthorizedGuard,
    { provide: 'AppLogo', useValue: logo },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
