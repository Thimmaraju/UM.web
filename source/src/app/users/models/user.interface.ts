import { Credentials, OktaUserProfile } from '@app/users';
import { ErrorCause } from '@app/users/models/errorcause.interface';
export interface User {
  id?: string;
  status?: string;
  profile: OktaUserProfile;
  credentials?: Credentials;
  errorCauses?: ErrorCause[];
}
