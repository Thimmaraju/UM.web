export interface PasswordPolicy {
    minLength: number;
    minLowerCase: number;
    minUpperCase: number;
    minNumber: number;
    minSymbol: number;
    excludeUserName: boolean;
    excludeAttributes: string[];
}

export interface ChangePassword {
    id: string;
    oldPassword: PasswordValue;
    newPassword: PasswordValue;
}

export interface PasswordValue {
    value: string;
}
