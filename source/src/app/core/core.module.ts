import { NgModule, Optional, SkipSelf, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { RouterModule } from '@angular/router';

import { TenantModule } from '@app/tenant';

// components
import { NavComponent } from './nav/nav.component';
import { SecondaryNavComponent } from './secondary-nav/secondary-nav.component';
import { RefreshDialogComponent } from './authentication/refresh-dialog/refresh-dialog.component';

import { ToastModule } from 'webcorecomponent-lib';
import { ToastService } from 'webcorecomponent-lib';

// services
import { AuthService } from './authentication/auth/auth.service';
import { CognitoUtil } from './authentication/cognito.service';
import { LocalStorageService } from './local-storage/local-storage.service';
import { CustomerContextService } from './services/customer-context/customer-context.service';
import { TokenService } from './authentication/token/token.service';
// import { AuthConfigsService } from '../auth/shared/authconfigs.service';
import { TokenValidationService } from '../core/authentication/token-validation/token-validation.service';
import { TokenRefreshService } from './authentication/token-refresh/token-refresh.service';
import { NavMenuModule } from '../../../projects/nav-menu/src/public_api';

@NgModule({
  imports: [RouterModule, CommonModule, SharedModule, TenantModule, ToastModule, NavMenuModule],
  declarations: [NavComponent, SecondaryNavComponent, RefreshDialogComponent],
  providers: [
    AuthService,
    CognitoUtil,
    CustomerContextService,
    TokenService,
    //  AuthConfigsService,
    LocalStorageService,
    TokenValidationService,
    TokenRefreshService,
    ToastService,
    { provide: 'LocationRef', useValue: window.location },
    { provide: 'WindowRef', useValue: window },
    { provide: 'StorageRef', useValue: localStorage },
  ],
  exports: [NavComponent, SecondaryNavComponent],
  entryComponents: [RefreshDialogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
