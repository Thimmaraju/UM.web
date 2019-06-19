import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// components
import { ChangepasswordComponent } from '../change-password/components/changepassword/changepassword.component';
import { PopupChangepasswordComponent } from '../change-password/containers/popup-changepassword/popup-changepassword.component';

// web core components
import { PopupWindowModule, ButtonToggleModule, ButtonActionModule, ToastModule } from 'webcorecomponent-lib';
import { ToastService, PopupWindowService, LayoutModule, FooterModule } from 'webcorecomponent-lib';

import { AuthService } from '@app/core/authentication/auth/auth.service';

@NgModule({
  declarations: [
    ChangepasswordComponent,
    PopupChangepasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonToggleModule,
    ButtonActionModule,
    ToastModule,
    LayoutModule,
    FooterModule,
    PopupWindowModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ToastService,
    PopupWindowService,
    AuthService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  entryComponents: [
    PopupChangepasswordComponent
  ]
})
export class ChangepasswordModule { }
