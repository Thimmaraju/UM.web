import { Component } from '@angular/core';
import { Location as Loc } from '@angular/common';
import { CanDeactivateGuard, CanComponentDeactivate } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Router, Routes, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

@Component({
  template: `
    Home
  `,
})
class MockHomeComponent implements CanComponentDeactivate {
  canDeactivate(): boolean | Observable<boolean> {
    return true;
  }
}

@Component({
  template: `
    test
  `,
})
class MockDeactivateComponent implements CanComponentDeactivate {
  canDeactivate(): boolean | Observable<boolean> {
    return true;
  }
}

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
})
class MockAppComponent implements CanComponentDeactivate {
  canDeactivate(): boolean | Observable<boolean> {
    return true;
  }
}

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;
  let fixture: ComponentFixture<MockAppComponent>;
  let route: Router;
  let location: Loc;

  const routes: Routes = [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: 'home',
      component: MockHomeComponent,
      canDeactivate: [CanDeactivateGuard],
    },
    {
      path: 'test',
      component: MockDeactivateComponent,
    },
    {
      path: 'logoff',
      component: MockAppComponent,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard],
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [MockHomeComponent, MockDeactivateComponent, MockAppComponent],
    });

    guard = TestBed.get(CanDeactivateGuard);
    route = TestBed.get(Router);
    location = TestBed.get(Loc);

    fixture = TestBed.createComponent(MockAppComponent);
    route.initialNavigation();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
    expect(route).toBeTruthy();
  });

  describe('canDeactivate', () => {
    xit('should not navigate to test', (done) => {
      spyOn(guard, 'canDeactivate').and.returnValue(true);
      expect(location.path()).toBe('');

      route.navigate(['/home']).then(navigateToTest, navigateRejected);

      function navigateToTest(res) {
        // should navigate here.
        route.navigate(['/test']).then(responseGood, responseBad);
      }

      function navigateRejected(res) {
        done();
      }

      function responseGood(res) {
        expect(guard.canDeactivate).toHaveBeenCalledTimes(1);
        done();
      }

      function responseBad(res) {
        done();
      }
    });
  });
});
