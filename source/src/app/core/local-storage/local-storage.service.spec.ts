import { LocalStorageService } from './local-storage.service';

describe('Local Storage Service', () => {
  const mockLocalStorage = {
    setItem: (k, v) => { },
    getItem: K => null
  } as Storage;

  let sut: LocalStorageService;

  beforeEach(() => {
    sut = new LocalStorageService(mockLocalStorage);
  });

  it('set to local storage', () => {
    spyOn(mockLocalStorage, 'setItem').and.callFake(() => { });

    sut.setItem('foo', 'bar');

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('get from local storage', () => {
    spyOn(mockLocalStorage, 'getItem').and.callFake(() => {
      return JSON.stringify('foo');
    });

    spyOn(JSON, 'parse').and.callThrough();

    sut.getItem('foo');

    expect(mockLocalStorage.getItem).toHaveBeenCalled();
  });
});
