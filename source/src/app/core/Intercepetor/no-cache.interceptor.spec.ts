import { NoCacheInterceptor } from '@app/core/Intercepetor/no-cache.interceptor';

describe('No Cache Interceptor', () => {
  class MockHeaders {
    set(key, val) {
      return this;
    }
  }

  class MockRequest {
    method = 'GET';
    headers = new MockHeaders();

    clone(obj) { return obj; }
  }

  it('should set no-cache headers for IE11 based GET requests', () => {
    const interceptor = new NoCacheInterceptor(true);
    const req = new MockRequest();

    const next = {
      handle: jasmine.createSpy()
    };

    const setSpy = spyOn(req.headers, 'set').and.callThrough();
    spyOn(req, 'clone');

    interceptor.intercept(req as any, next as any);

    expect(req.clone).toHaveBeenCalled();
    expect(req.headers.set).toHaveBeenCalledTimes(3);
    expect(setSpy.calls.argsFor(0)).toEqual(['Cache-Control', 'no-cache']);
    expect(setSpy.calls.argsFor(1)).toEqual(['Pragma', 'no-cache']);
    expect(setSpy.calls.argsFor(2)).toEqual(['Expires', 'Sat, 01 Jan 2000 00:00:00 GMT']);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should NOT set no-cache headers on non-GET requests', () => {
    const interceptor = new NoCacheInterceptor(true);

    const req = new MockRequest();
    req.method = 'POST';

    const next = {
      handle: jasmine.createSpy()
    };

    const setSpy = spyOn(req.headers, 'set').and.callThrough();

    spyOn(req, 'clone');

    interceptor.intercept(req as any, next as any);

    expect(setSpy).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalled();
  });

  it('should NOT set no-cache headers on non-IE11 browsers', () => {
    const interceptor = new NoCacheInterceptor(false);

    const req = new MockRequest();
    req.method = 'POST';

    const next = {
      handle: jasmine.createSpy()
    };

    const setSpy = spyOn(req.headers, 'set').and.callThrough();

    spyOn(req, 'clone');

    interceptor.intercept(req as any, next as any);

    expect(setSpy).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalled();
  });
});
