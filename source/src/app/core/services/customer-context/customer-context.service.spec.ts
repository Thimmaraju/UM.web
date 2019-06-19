import { TestBed } from '@angular/core/testing';
import { CustomerContextService, CustomerContext } from './customer-context.service';

describe('Customer context service', () => {
  let sut: CustomerContextService;

  beforeEach(() => {
    sut = new CustomerContextService();
  });

  it('should set customer context', () => {
    const customerContext = {} as CustomerContext;
    spyOn(sut.customerContext$, 'next');
    sut.setCustomerContext(customerContext);
    expect(sut.customerContext$.next).toHaveBeenCalled();
  });
});
