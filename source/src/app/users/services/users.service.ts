import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment as env } from '@env/environment';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private createUserUrl: string = env.userHost + 'v1/users/';
  private usersUrl: string = env.userHost + 'v1/users';

  user$: User;

  constructor(private _httpClient: HttpClient) {}

  createUser(user: User) {
    return this._httpClient.post<User>(this.createUserUrl, user);
  }

  checkEmailexists(email: string) {
    return this._httpClient.get<boolean>(`${this.usersUrl}/email/` + email);
  }

  getUser(username: string) {
    const params = new HttpParams().set('username', username);
    return this._httpClient.get(`${this.usersUrl}`, { params: params });
  }
}
