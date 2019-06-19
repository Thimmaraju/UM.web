import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { TenantModule } from '@app/tenant';
import { CdkTableModule } from '@angular/cdk/table';

import { SHARED_SERVICES } from '@app/shared';

import { AdduserComponent } from './add-user/components/add-user/add-user.component';
import { PopupAdduserComponent } from './add-user/containers/popup-adduser/popup-adduser.component';
import { PopupWindowModule, ButtonToggleModule, ButtonActionModule, ToastModule } from 'webcorecomponent-lib';

import { ToastService, PopupWindowService, LayoutModule, FooterModule } from 'webcorecomponent-lib';

import { EdituserModule } from '@app/users/edit-user/edituser.module';
import { ChangepasswordModule } from '@app/users/change-password/changepassword.module';
import { SelectCustomerViewerComponent } from './select-customer/containers/select-customer-viewer.component';

export const ROUTES: Routes = [
  {
    path: 'select-customer',
    component: SelectCustomerViewerComponent,
    data: { customerFilter: 'false' },
  },
];

@NgModule({
  declarations: [AdduserComponent, PopupAdduserComponent, SelectCustomerViewerComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    SharedModule,
    TenantModule,
    ButtonToggleModule,
    ButtonActionModule,
    ToastModule,
    LayoutModule,
    FooterModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    RouterModule,
    EdituserModule,
    PopupWindowModule,
    ChangepasswordModule,
  ],
  entryComponents: [PopupAdduserComponent],
  providers: [...SHARED_SERVICES, PopupWindowService, ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class UsersModule {}
