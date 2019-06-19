import { EditUserService } from '@app/users/shared/services/edit-user.service';
import { UserSharedService } from '@app/users/shared/services/user-shared.service';
export * from '@app/users/shared/services/user-audit-log.service';
export * from './users.module';
export * from './services/users.service';
export * from './models/user.interface';
export * from './change-password/containers/popup-changepassword/popup-changepassword.component';
export * from './change-password/components/changepassword/changepassword.component';
export * from './change-password/containers/popup-changepassword/popup-changepassword.component';
export * from './change-password/changepassword.module';
export * from './shared/users-shared.module';

// Service
export * from '@app/users/shared/services/edit-user.service';
export * from '@app/users/shared/services/user-shared.service';

// Components
export * from '@app/users/add-user/components/add-user/add-user.component';
export * from '@app/users/add-user/containers/popup-adduser/popup-adduser.component';
export * from '@app/users/edit-user/containers/user-list/user-list.component';
export * from '@app/users/edit-user/containers/edit-user-form/edit-user-form.component';
export * from '@app/users/edit-user/components/userinformation/userinformation.component';
export * from '@app/users/edit-user/components/userrole/userrole.component';
export * from '@app/users/edit-user/components/user-site-association/user-site-association.component';
export * from '@app/users/edit-user/components/edit-user-header/edit-user-header.component';
export * from '@app/users/audit-log/containers/user-audit-log/user-audit-log.component';

export * from '@app/users/models/user-role.interface';
export * from '@app/users/models/user.interface';
export * from '@app/users/models/okta-userprofile.interface';
export * from '@app/users/models/user-profile.interface';
export * from '@app/users/models/okta-status.enum';
export * from '@app/users/models/userlabels.model';
export * from '@app/users/models/group.interface';
export * from '@app/users/models/group-profile.interface';
export * from '@app/users/models/okta-user.interface';
export * from '@app/users/models/okta-userprofile.interface';
export * from '@app/users/models/user-siteassociation.interface';
export * from '@app/users/models/site.interface';
export * from '@app/users/models/userlabels.model';
export * from '@app/users/models/user-audit-log.interface';
export * from '@app/users/models/credentials-profile.interface';
export * from '@app/users/models/credentials.interface';

export const SHARED_SERVICES = [
  { provide: EditUserService, useClass: EditUserService },
  { provide: UserSharedService, useClass: UserSharedService },
];
