import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment as env } from '@env/environment';

// Model
import { User, OktaUser, Site, Group, UserRole } from '@app/users';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditUserService {
  private usersUrl: string = env.userHost + 'v1/users';
  private groupUrl: string = env.userHost + 'v1/groups';
  private appUrl: string = env.userHost + 'v1/apps';
  private facilityUrl: string = env.orgviewHost + 'v1/Facility';

  facilities: Site[] = [
    { customerId: 'GHS', facilityId: 425, facilityName: 'GHS Street 1', facilityDescription: 'GHS in street 1' },
    { customerId: 'GHS', facilityId: 273, facilityName: 'GHS Street 2', facilityDescription: 'GHS in street 2' },
    { customerId: 'GHS', facilityId: 373, facilityName: 'GHS Street 3', facilityDescription: 'GHS in street 3' },
    { customerId: 'GHS', facilityId: 378, facilityName: 'GHS Street 4', facilityDescription: 'GHS in street 4' },
  ];
  constructor(private http: HttpClient) {}

  getOktaGroupmembers() {
    return this.http.get<User[]>(`${this.groupUrl}/users`);
  }

  getOktaRoles() {
    return this.http.get<Group[]>(`${this.groupUrl}/roles`);
  }

  updateUser(user: OktaUser) {
    return this.http.put(`${this.usersUrl}`, user);
  }

  getUserRoles(userId: string) {
    return this.http.get<Group[]>(`${this.usersUrl}/` + userId + `/roleGroups`);
  }

  getCustomerSites() {
    return this.http.get<Site[]>(`${this.facilityUrl}`);
  }

  getUserDetails(userId: string) {
    return this.http.get<User>(`${this.usersUrl}/` + userId);
  }

  checkEmailexists(email: string) {
    return this.http.get<boolean>(`${this.usersUrl}/email/` + email);
  }

  searchUser(user: string) {
    return this.http.get<User[]>(`${this.usersUrl}/name/` + user);
  }

  resetPassword(userId: string) {
    return this.http.put(`${this.usersUrl}/resetpassword/` + userId, userId);
  }
}
