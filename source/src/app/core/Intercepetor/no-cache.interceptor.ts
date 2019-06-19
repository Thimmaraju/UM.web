import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';

import { IE11_BROWSER_AGENT } from '@app/constants';

export class NoCacheInterceptor implements HttpInterceptor {
  constructor(@Inject(IE11_BROWSER_AGENT) private IE11_AGENT: boolean) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.IE11_AGENT && req.method === 'GET') {
      const headers = req.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache') // might be needed for IE11
        .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT'); // in the past so content is not cached

      const ieNoCacheRequest = req.clone({
        headers
      });

      return next.handle(ieNoCacheRequest);
    }

    return next.handle(req);
  }
}
