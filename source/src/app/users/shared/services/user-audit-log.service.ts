import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuditLogService {

  private userAuditLogUrl: string = env.userHost + 'v1/AuditLogs/';

  constructor(private _httpClient: HttpClient) { }

  getUserAuditLog(userId: string) {
    return this._httpClient.get(this.userAuditLogUrl + userId);
  }
}
