import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment as env } from '@env/environment';
import { ChangePassword } from '../../models/password-policy.interface';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  private passwordPolicyUrl: string = env.userHost + 'v1/policy/';
  private changePasswordUrl: string = env.userHost + 'v1/users/' + 'password';

  constructor(private _httpClient: HttpClient) { }

  getPasswordPolicy() {
    return this._httpClient.get(`${this.passwordPolicyUrl}`);
  }

  changeUserPassword(chngPassword: ChangePassword) {
    return this._httpClient.put<ChangePassword>(this.changePasswordUrl, chngPassword);
  }
}
