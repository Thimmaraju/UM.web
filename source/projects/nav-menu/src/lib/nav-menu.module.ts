import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatDialogModule, MatCardModule } from '@angular/material';

// components
import { NavMenuComponent } from './nav-menu.component';
import { AppsListComponent } from './navigation-menu/app-list/containers/app-list/apps-list.component';
import { OktaPopupChangePasswordComponent } from './navigation-menu/change-password/containers/popup-change-password/okta-popup-change-password.component';
import { OktaChangePasswordComponent } from './navigation-menu/change-password/components/change-password/okta-change-password.component';
import { ProfileviewerComponent } from './navigation-menu/profile/containers/profileviewer/profileviewer.component';
import { ProfileheaderComponent } from './navigation-menu/profile/components/profileheader/profileheader.component';
import { ProfileChangePasswordComponent } from './navigation-menu/profile/components/profile-change-password/profile-change-password.component';
import { LibRefreshDialogComponent } from './navigation-menu/refresh-dialog/lib-refresh-dialog/lib-refresh-dialog.component';

// services
import { AuthServiceLib } from './services/auth/authentication.service';
import { AppListService } from './services/app-list/app-list.service';
import { LibToasterService } from './services/lib-toaster/lib-toaster.service';

// web core components
import { PopupWindowModule, ButtonToggleModule, ButtonActionModule, ToastModule, LayoutModule, FooterModule } from 'webcorecomponent-lib';
import { ToastService, PopupWindowService } from 'webcorecomponent-lib';

const UP_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileviewerComponent,
  }
];

@NgModule({
  declarations: [
    NavMenuComponent,
    AppsListComponent,
    OktaPopupChangePasswordComponent,
    OktaChangePasswordComponent,
    ProfileviewerComponent,
    ProfileheaderComponent,
    ProfileChangePasswordComponent,
    LibRefreshDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    PopupWindowModule,
    ButtonToggleModule,
    ButtonActionModule,
    ToastModule,
    LayoutModule,
    FooterModule,
    RouterModule.forChild(UP_ROUTES)
  ],
  exports: [
    RouterModule,
    NavMenuComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AuthServiceLib,
    AppListService,
    ToastService,
    LibToasterService,
    PopupWindowService
  ],
  entryComponents: [
    OktaPopupChangePasswordComponent,
  ]
})
export class NavMenuModule { }
