import { Injectable, Inject } from '@angular/core';

const APP_PREFIX = 'Omnicell-';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageServiceLib {
  constructor(@Inject('StorageRef') private localStorage: Storage) {}

  setItem(key: string, value: string): void {
    if (value !== '' && value.length > 0) {
      this.localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value).slice(1, -1));
    }
  }

  getItem(key: string): any {
    const returnValue = this.localStorage.getItem(`${APP_PREFIX}${key}`);

    if (returnValue === null) {
      return null;
    } else {
      return returnValue;
    }
  }

  removeItem(key: string): void {
    this.localStorage.removeItem(`${APP_PREFIX}${key}`);
  }
}
