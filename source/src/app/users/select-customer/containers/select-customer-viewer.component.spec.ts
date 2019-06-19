import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SharedModule } from '@app/shared';
import { Observable, of } from 'rxjs';

// services
import { CustomerContextService, LocalStorageService, AuthService } from '@app/core';

// models
import { CustomerContext } from '@app/core';

// components
import { SelectCustomerViewerComponent } from './select-customer-viewer.component';

// interface
import { UserRoles } from '@app/core/guards/user-token.interface';

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

  getUserRole(): Observable<UserRoles[]> {
    // return of(JSON.parse('bar'));
    return of([UserRoles.Strategist]);
  }
  isRefreshTokenExpired(): boolean {
    return false;
  }
  isCurrentCustomerContextSet(): boolean {
    return true;
  }
  initUser(): void {}
  switchCustomer(customerId: string): void {}
}

let customerContextService: CustomerContextServiceStub;
let localStorageService: LocalStorageServiceStub;
let authService: AuthDataStub;
let routerInstance: Router;

describe('Select customer viewer', () => {
  let component: SelectCustomerViewerComponent;
  let fixture: ComponentFixture<SelectCustomerViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SharedModule],
      declarations: [SelectCustomerViewerComponent],
      providers: [
        { provide: CustomerContextService, useClass: CustomerContextServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: AuthService, useClass: AuthDataStub },
      ],
    });

    fixture = TestBed.createComponent(SelectCustomerViewerComponent);
    component = fixture.componentInstance;
    customerContextService = fixture.debugElement.injector.get(CustomerContextService);
    localStorageService = fixture.debugElement.injector.get(LocalStorageService);
    authService = fixture.debugElement.injector.get(AuthService);
    routerInstance = fixture.debugElement.injector.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if tenant is selected - without tenant selected', () => {
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(false);
    spyOn(authService, 'isCurrentCustomerContextSet').and.returnValue(false);
    spyOn(authService, 'initUser');
    spyOn(component, 'loadTenants');
    component.checkIfTenantSelected();
    expect(authService.isRefreshTokenExpired).toHaveBeenCalled();
    expect(authService.isCurrentCustomerContextSet).toHaveBeenCalled();
    expect(component.loadTenants).toHaveBeenCalled();
    expect(authService.initUser).not.toHaveBeenCalled();
  });

  it('should check if tenant is selected - with tenant selected', () => {
    spyOn(authService, 'isRefreshTokenExpired').and.returnValue(false);
    spyOn(authService, 'isCurrentCustomerContextSet').and.returnValue(true);
    spyOn(authService, 'initUser');
    spyOn(component, 'loadTenants');
    component.checkIfTenantSelected();
    expect(authService.isRefreshTokenExpired).toHaveBeenCalled();
    expect(authService.isCurrentCustomerContextSet).toHaveBeenCalled();
    expect(authService.initUser).toHaveBeenCalled();
  });

  xit('should handle tenant selected', () => {
    spyOn(authService, 'switchCustomer');
    const custContext = {} as CustomerContext;
    spyOn(customerContextService, 'getCustomerContext').and.returnValue(of(custContext));
    component.handleTenantSelected('foo');
    expect(authService.switchCustomer).toHaveBeenCalled();
    expect(customerContextService.getCustomerContext).toHaveBeenCalled();
  });

  it('should navigate to dashboard', () => {
    spyOn(routerInstance, 'navigate');
    component.navigateToDashboard();
    expect(routerInstance.navigate).toHaveBeenCalled();
  });
  xit('should unsubscribe', () => {
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
