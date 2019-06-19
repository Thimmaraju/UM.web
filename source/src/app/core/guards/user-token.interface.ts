export interface UserToken {
  'cognito:groups': string[];
  'custom:role': string;
  email: string;
  family_name: string;
  given_name: string;
  username: string;
}

export enum UserRoles {
  PharmAdmin = 'Pharm Admin',
  Strategist = 'Strategist',
  OmnicellAdmin = 'Omnicell Admin',
  UserAdmin = 'User Admin',
  Technician = 'Technician',
  None = ''
}
