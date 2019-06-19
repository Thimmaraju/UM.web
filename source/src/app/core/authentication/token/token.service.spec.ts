import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';
import { of } from 'rxjs';

export class LocalStorageServiceStub {
  public removeItem(key: string): void {}
  public setItem(key: string, value: string): void {}
  public getItem(key: string): string {
    return 'foo-bar';
  }
}
let localServiceStub: LocalStorageServiceStub;
describe('Core token service', () => {
  let injector: TestBed;
  let service: TokenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        TokenService,
        {
          provide: LocalStorageService,
          useClass: LocalStorageServiceStub
        }
      ]
    });
    injector = getTestBed();
    service = injector.get(TokenService);
    localServiceStub = injector.get(LocalStorageService);
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it(`should get customer access`, async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      service.GetCustomerAccess().subscribe();

      backend.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET' && req.url.includes('/v1/customers');
      }, 'Get Customer Access to be called');
    })
  ));

  it(`should get customer access via Okta`, async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      service.GetCustomerAccessOkta().subscribe();
      backend.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET' && req.url.includes('/v1/customers/okta');
      }, 'Get Customer Access via Okta to be called');
    })
  ));

  it(`should switch customers`, async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      service.SwitchCustomers('foo').subscribe();
      backend.expectOne((req: HttpRequest<any>) => {
        return req.method === 'POST' && req.url.includes('/v1/tokens/switchcustomer/foo');
      }, 'Post to switch customers with customer id');
    })
  ));

  it(`should refresh token`, async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      service.RefreshToken('foo').subscribe();
      backend.expectOne((req: HttpRequest<any>) => {
        return req.method === 'POST' && req.url.includes('/v1/tokens/refreshtoken/foo');
      }, 'Refresh the token with customer id');
    })
  ));
  it('should get token', () => {
    spyOn(localServiceStub, 'getItem');
    service.getToken();
    expect(localServiceStub.getItem).toHaveBeenCalled();
  });
  it('should determine if refresh token is expired, truthy', () => {
    spyOn(service, 'getToken').and.returnValue(of('foo'));
    spyOn(service, 'isTokenExpired').and.returnValue(true);
    const results = service.isRefreshTokenExpired();
    expect(results).toBeTruthy();
  });
  it('should determine if refresh token is expired, falsy', () => {
    spyOn(service, 'getToken').and.returnValue(of('foo'));
    spyOn(service, 'isTokenExpired').and.returnValue(false);
    const results = service.isRefreshTokenExpired();
    expect(results).toBeFalsy();
  });
});
