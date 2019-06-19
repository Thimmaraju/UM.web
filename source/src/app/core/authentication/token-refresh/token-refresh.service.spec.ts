import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenRefreshService } from './token-refresh.service';
import { TokenService } from '../token/token.service';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';
import { of } from 'rxjs';

export class LocalStorageServiceStub {
  public removeItem(key: string): void {}
  public setItem(key: string, value: string): void {}
  public getItem(key: string): string {
    return 'foo-bar';
  }
}
export class TokenServiceStub {
  public isRefreshTokenExpired(): boolean {
    return true;
  }
}

let localServiceStub: LocalStorageServiceStub;
let tokenServiceStub: TokenServiceStub;
describe('Core token refresh service', () => {
  let injector: TestBed;
  let service: TokenRefreshService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        TokenRefreshService,
        {
          provide: LocalStorageService,
          useClass: LocalStorageServiceStub
        },
        {
          provide: TokenService,
          useClass: TokenServiceStub
        }
      ]
    });
    injector = getTestBed();
    service = injector.get(TokenRefreshService);
    localServiceStub = injector.get(LocalStorageService);
    tokenServiceStub = injector.get(TokenService);
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it(`should post to get new access token`, async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      spyOn(localServiceStub, 'getItem').and.returnValue('foo');
      spyOn(service, 'getCustomerFromToken').and.returnValue('bar');
      service.Post().subscribe();

      backend.expectOne((req: HttpRequest<any>) => {
        return req.method === 'POST' && req.url.includes('/v1/tokens/refreshtoken/bar');
      }, 'Get Customer Access to be called');
    })
  ));

  it(`should refresh token`, () => {
    spyOn(localServiceStub, 'setItem');
    spyOn(service.tokenRefreshed$, 'next');
    spyOn(service, 'Post').and.returnValue(of('foo'));
    service.refreshToken();
    expect(service.Post).toHaveBeenCalled();
    expect(localServiceStub.setItem).toHaveBeenCalled();
    expect(service.tokenRefreshed$.next).toHaveBeenCalled();
  });
});
