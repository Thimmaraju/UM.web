export enum OktaStatus {
  ACTIVE = 'Active',
  STAGED = 'Activation pending',
  PROVISIONED = 'Pending User Action',
  RECOVERY = 'Password Reset',
  SUSPENDED = 'Deactivated',
  DEPROVISIONED = 'Deactivated',
  LOCKED = 'Locked Out',
  PASSWORD_EXPIRED = 'Password Expired',
}
