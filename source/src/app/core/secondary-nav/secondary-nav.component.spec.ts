import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@app/shared';
import { Observable, of } from 'rxjs';

// services
import { CustomerContextService, AuthService } from '@app/core';

// models
import { CustomerContext } from '@app/core';

// components
import { SecondaryNavComponent } from './secondary-nav.component';
import { TenantDetailsComponent } from '@app/tenant';

const customerContext = {} as CustomerContext;
export class CustomerContextServiceStub {
  public getCustomerContext(): Observable<CustomerContext> {
    return of(customerContext);
  }
  public setCustomerContext(value: CustomerContext): void {}
}

export class LocalStorageServiceStub {
  public getItem(key: string): string {
    return 'foo';
  }
  public setItem(key: string, value: any): void {}
}

export class AuthDataStub {
  getCustomer(): string {
    return 'foo';
  }
  setCustomer(value: string): void {}
}

let customerContextService: CustomerContextServiceStub;
let authService: AuthDataStub;

describe('Secondary Navigation Component', () => {
  let component: SecondaryNavComponent;
  let fixture: ComponentFixture<SecondaryNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SharedModule],
      declarations: [SecondaryNavComponent, TenantDetailsComponent],
      providers: [
        { provide: CustomerContextService, useClass: CustomerContextServiceStub },
        { provide: AuthService, useClass: AuthDataStub }
      ]
    });

    fixture = TestBed.createComponent(SecondaryNavComponent);
    component = fixture.componentInstance;
    customerContextService = fixture.debugElement.injector.get(CustomerContextService);
    authService = fixture.debugElement.injector.get(AuthService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should on set selection disabled', () => {
    const result = component.setSelectionDisabled({ customerFilter: true });
    expect(component.isDisabled).toBeTruthy();
  });

  it('should check if tenant is selected', () => {
    spyOn(localStorage, 'getItem').and.returnValue('foo');
    spyOn(component, 'setTenantId');
    component.checkIfTenantSelected();
    expect(component.setTenantId).toHaveBeenCalled();
  });

  it('set tenant id', () => {
    component.setTenantId('foo');
    expect(component.selectedId).toBe('foo');
  });
});
