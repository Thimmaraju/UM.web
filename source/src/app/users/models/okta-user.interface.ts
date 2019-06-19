import { User, Group } from '@app/users';

export interface OktaUser {
    User: User;
    Groups: Group[];
    ResetPasswordOnNextLogin?: boolean;
    SuspendUser?: boolean;
    ActivateUser?: boolean;
  }
