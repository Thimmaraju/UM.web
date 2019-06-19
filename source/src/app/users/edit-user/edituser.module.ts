import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSharedModule } from '@app/users';
import { SharedModule } from '@app/shared';

// components
import {
  UserListComponent,
  EditUserFormComponent,
  UserinformationComponent,
  UserroleComponent,
  UserSiteAssociationComponent,
  UserAuditLogComponent,
} from '@app/users';
import { CanLoadUserManagementGuard, CanDeactivateGuard } from '@app/core';
import { EditUserHeaderComponent } from './components/edit-user-header/edit-user-header.component';

export const ROUTES: Routes = [
  {
    path: 'user-list',
    component: UserListComponent,
    data: { customerFilter: 'true' },
    canLoad: [CanLoadUserManagementGuard],
  },

  {
    path: 'edit-user-form/:id',
    component: EditUserFormComponent,
    data: { customerFilter: 'false' },
    canLoad: [CanLoadUserManagementGuard],
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    UsersSharedModule,
  ],
  declarations: [
    UserListComponent,
    EditUserFormComponent,
    UserinformationComponent,
    UserroleComponent,
    UserSiteAssociationComponent,
    EditUserHeaderComponent,
    UserAuditLogComponent,
  ],
  providers: [CanLoadUserManagementGuard, CanDeactivateGuard],
  entryComponents: [UserListComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class EdituserModule {}
