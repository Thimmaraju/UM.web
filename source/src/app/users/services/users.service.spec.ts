import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment as env } from '@env/environment';
import { User } from '@app/users';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let _service: UsersService;
  let _httpMock: HttpTestingController;
  const createUserUrl: string = env.userHost + 'v1/users/CreateUser';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService],
      imports: [HttpClientModule, HttpClientTestingModule],
    });

    _httpMock = TestBed.get(HttpTestingController);
    _service = TestBed.get(UsersService);
  });

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });
});
