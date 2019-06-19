import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenInterceptor } from './token-interceptor';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AuthService } from '../authentication/auth/auth.service';
import { Claims } from '@app/core/authentication/token/token.service';
import { TokenRefreshService } from '../authentication/token-refresh/token-refresh.service';

export function encodeTestToken(payload: any): string {
  return '.' + btoa(JSON.stringify(payload)) + '.';
}

export class LocalStorageServiceStub {
  public removeItem(key: string): void {}
  public setItem(key: string, value: string): void {}
  public getItem(key: string): string {
    return 'foo-bar';
  }
}

export class AuthServiceStub {
  public isTokenExpired(): boolean {
    return true;
  }
  public logout(): void {
    return;
  }
  public getRole(): string {
    return 'foo';
  }
  public isRefreshTokenExpired(): boolean {
    return true;
  }
  public getCustomer(): string {
    return 'foo';
  }
  public redirectToNotAuthorized(): void {}
  public checkRefreshToken(): void {}
}
export class TokenRefreshServiceStub {
  public Post(): void {}
}
let tokenRefreshServiceStub: TokenRefreshServiceStub;
let authServiceStub: AuthServiceStub;
let localServiceStub: LocalStorageServiceStub;

describe('Token Interceptor', () => {
  let injector: TestBed;
  let service: TokenInterceptor;
  let routerInstance: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        {
          provide: LocalStorageService,
          useClass: LocalStorageServiceStub
        },
        {
          provide: AuthService,
          useClass: AuthServiceStub
        },
        {
          provide: TokenRefreshService,
          useClass: TokenRefreshServiceStub
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });

    injector = getTestBed();
    service = injector.get(TokenInterceptor);
    routerInstance = injector.get(Router);
    localServiceStub = injector.get(LocalStorageService);
    authServiceStub = injector.get(AuthService);
    tokenRefreshServiceStub = injector.get(TokenRefreshService);
  });

  // Makes sure there are no outstanding requests.
  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  describe('making http calls', () => {
    it('adds Authorization header', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        const token = {} as Claims;
        token.exp = '9999999999';
        spyOn(localServiceStub, 'getItem').and.returnValue(encodeTestToken(token));
        spyOn(service, 'setHeaders').and.callThrough();
        spyOn(service, 'refreshToken');

        http.get('/data').subscribe(response => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(r => r.headers.has('Authorization'));
        expect(req.request.method).toEqual('GET');
        expect(localServiceStub.getItem).toHaveBeenCalled();

        req.flush({ foo: 'bar' });
        httpMock.verify();
      }
    ));

    it('should redirect when not authorized', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        const token = {} as Claims;
        token.exp = '9999999999';
        spyOn(localServiceStub, 'getItem').and.returnValue(encodeTestToken(token));
        spyOn(service, 'setHeaders').and.callThrough();
        spyOn(authServiceStub, 'redirectToNotAuthorized');
        spyOn(service, 'refreshToken');
        spyOn(routerInstance, 'navigate');

        const mockErrorResponse = {
          status: 401,
          statusText: 'Bad Request'
        };

        http.get('/data').subscribe(
          _ => {},
          err => {
            expect(err).toBeTruthy();
          }
        );

        const req = httpMock.expectOne(r => r.headers.has('Authorization'));
        req.flush(' ', mockErrorResponse);

        expect(authServiceStub.redirectToNotAuthorized).toHaveBeenCalled();

        httpMock.verify();
      }
    ));
    it('should redirect when refresh token is expired', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        const token = {} as Claims;
        token.exp = '9999999999';
        spyOn(localServiceStub, 'getItem').and.returnValue(encodeTestToken(token));
        spyOn(service, 'setHeaders').and.callThrough();
        spyOn(authServiceStub, 'redirectToNotAuthorized');
        spyOn(authServiceStub, 'checkRefreshToken');
        spyOn(routerInstance, 'navigate');

        const mockErrorResponse = {
          status: 403,
          statusText: 'Forbidden'
        };

        http.get('/data').subscribe(
          _ => {},
          err => {
            expect(err).toBeTruthy();
          }
        );

        const req = httpMock.expectOne(r => r.headers.has('Authorization'));
        req.flush(' ', mockErrorResponse);
        expect(authServiceStub.checkRefreshToken).toHaveBeenCalled();

        httpMock.verify();
      }
    ));
  });
});
