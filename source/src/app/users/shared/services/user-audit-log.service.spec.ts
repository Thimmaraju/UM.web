import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment as env } from '@env/environment';

import { UserAuditLogService } from './user-audit-log.service';
import { UserAuditLog } from '@app/users';

describe('UserAuditLogService', () => {
  const userAuditLogUrl: string = env.userHost + 'v1/AuditLogs/';

  let injector: TestBed;
  let service: UserAuditLogService;
  let httpMock: HttpTestingController;
  const userId = '00uk4jp5ub9IMjYEn0h7';

  const mockUserLog: UserAuditLog[] = [
    {
      event: 'Remove user from group membership',
      update: 'Role:Strategist',
      changedBy: 'sai sankar kunnathukuzhiyil',
      updateTime: 'Apr 4, 2019, 6:14:53 PM'
    },
    {
      event: 'Add user to group membership',
      update: 'Role:Strategist',
      changedBy: 'Aditya SRK',
      updateTime: 'Apr 3, 2019, 11:41:45 PM'
    },
    {
      event: 'Update user profile for Okta',
      update: 'Aditya 369 Sadhu',
      changedBy: 'Aditya SRK',
      updateTime: 'Apr 3, 2019, 3:11:43 PM'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAuditLogService]
    });
      injector = getTestBed();
      service = injector.get(UserAuditLogService);
      httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    const auditservice: UserAuditLogService = TestBed.get(UserAuditLogService);
    expect(auditservice).toBeTruthy();
  });

  it('should return an Observable<UserAuditLog[]>', () => {
    service.getUserAuditLog(userId).subscribe(
      (data) => {
      expect(data).toEqual(mockUserLog);
    });

    const req = httpMock.expectOne(`${userAuditLogUrl}` + userId);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserLog);
  });
});
