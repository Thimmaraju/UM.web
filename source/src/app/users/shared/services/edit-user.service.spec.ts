import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment as env } from '@env/environment';

import { EditUserService } from '@app/users';


describe('Edit User Service', () => {
  const url: string = env.userHost + 'v1/users';
  const groupUrl: string = env.userHost + 'v1/groups';
  const appUrl: string = env.userHost + 'v1/apps';
  const facilityUrl: string = env.orgviewHost + 'v1/Facility';

  let injector: TestBed;
  let service: EditUserService;
  let httpMock: HttpTestingController;

  const mockUsers = [{
    id: '00ui44ab3td6CD3CK09r',
    status: 'ACTIVE',
    profile: {
      firstName: 'John',
      lastName: 'Rob',
      email: 'John.Rob@xyz.com',
      login: 'John.Rob@xyz.com'
    },
    'credentials': null,
  },
  {
    id: '00ui44ab3td6CD6tK09r',
    status: 'ACTIVE',
    profile: {
      firstName: 'Issac',
      lastName: 'New',
      email: 'Issac.New@xyz.com',
      login: 'Issac.New@xyz.com'
    },
    'credentials': null,
  },
  ];

  const mockUser = {
    id: '00ui44ab3td6CD3CK09r',
    status: 'ACTIVE',
    profile: {
      firstName: 'John',
      lastName: 'Rob',
      email: 'John.Rob@xyz.com',
      login: 'John.Rob@xyz.com'
    },
    'credentials': null,
  };

  const mockUserRoles = [
    {
      id: '00gibjc2ruryI0J2M0h7',
      rolename: 'UserAdmin',
      roledescription: 'Creates Hospital User',
      userAssigned: true
    }
  ];

  const mockFacilities = [
    {
      customerId: 'G1',
      facilityId: 222,
      facilityName: 'Facility 1',
      facilityDescription: 'Facility 1 Desc'
    },
    {
      customerId: 'G2',
      facilityId: 333,
      facilityName: 'Facility 2',
      facilityDescription: 'Facility 2 Desc'
    }
  ];

  const mockGroup = [{
    id: '00gibjc2ruryI0J2M0h7',
    profile: {
      name: 'Role:Pharm Admin',
      description: 'Pharm Admin Group'
    }
  },
  {
    id: '00gjmd3wt6J6h5g770h7',
    profile: {
      name: 'Role:Technician',
      description: 'Technician Group'
    }
  }
  ];

  const mockOktaUser = {
    User: {
      id: '00ui44ab3td6CD3CK09r',
      status: 'ACTIVE',
      profile: {
        firstName: 'John',
        lastName: 'Rob',
        email: 'John.Rob@xyz.com',
        login: 'John.Rob@xyz.com'
      },
      'credentials': null
    },
    Groups: [{
      id: '00gibjc2ruryI0J2M0h7',
      profile: {
        name: 'Role:Pharm Admin',
        description: 'Pharm Admin Group'
      }
    }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EditUserService]
    });

    injector = getTestBed();
    service = injector.get(EditUserService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get Okta Group Members', () => {
    it('should return an Observable<Group[]>', () => {
      service.getOktaGroupmembers().subscribe(data => {
        expect(data.length).toBe(2);
        expect(data).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${groupUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('get Okta Roles', () => {
    it('should return an empty Observable<Group[]>', () => {

      service.getOktaRoles().subscribe(
        () => { },
        err => {
          expect(err).toEqual(mockGroup);
        }
      );

      const req = httpMock.expectOne(`${groupUrl}/roles`);

      expect(req.request.method).toBe('GET');

      req.flush(mockGroup);
    });
  });

  describe('get User Roles', () => {
    it('should return an Observable<userrole[]>', () => {
      service.getUserRoles('00ui44ab3td6CD6tK09r').subscribe(data => {
        expect(data.length).toBe(2);
        expect(data).toEqual(mockGroup);
      });

      const params = { param: 'userId', value: '00ui44ab3td6CD6tK09r' };
      const req = httpMock.expectOne(`${url}/00ui44ab3td6CD6tK09r/roleGroups`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroup);
    });
  });

  describe('get Details for an user', () => {
    it('should return an Observable<User>', () => {
      service.getUserDetails('00ui44ab3td6CD6tK09r').subscribe(data => {
        expect(data).toEqual(mockUser);
      });

      const params = { param: 'userId', value: '00ui44ab3td6CD6tK09r' };
      const req = httpMock.expectOne(`${url}/00ui44ab3td6CD6tK09r`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('check if email already exists', () => {
    it('should return a boolean', () => {
      service.checkEmailexists('John.Rob@xyz.com').subscribe(data => {
        expect(data).toEqual(true);
      });

      const params = { param: 'email', value: 'John.Rob@xyz.com' };
      const req = httpMock.expectOne(`${url}/email/John.Rob@xyz.com`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('Search user online', () => {
    it('should return an Observable<User[]>', () => {
      service.searchUser('Rob').subscribe(data => {
        expect(data.length).toBe(2);
        expect(data).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${url}/name/Rob`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('Update user', () => {
    it('should return an Observable<User>', () => {
      service.updateUser(mockOktaUser).subscribe(data => {
        expect(data).toEqual(mockOktaUser);
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockOktaUser);
    });
  });

  describe('Get Customer Facilities', () => {
    it('should return an Observable<Facility>', () => {
      service.getCustomerSites().subscribe(data => {
        expect(data).toEqual(mockFacilities);
      });

      const req = httpMock.expectOne(`${facilityUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFacilities);
    });
  });

  describe('Reset Password', () => {
    it('should reset password and return result', () => {
      service.resetPassword('00ui44ab3td6CD6tK09r').subscribe(data => {
        expect(data).toEqual(true);
      });

      const req = httpMock.expectOne(`${url}/resetpassword/00ui44ab3td6CD6tK09r`);
      expect(req.request.method).toBe('PUT');
    });
  });
});
