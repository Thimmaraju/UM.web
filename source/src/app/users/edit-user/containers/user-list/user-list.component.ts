import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ViewChildren } from '@angular/core';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { CustomerContext, CustomerContextService } from '@app/core';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { switchMap, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { PopupAdduserComponent } from '@app/users';
import { ToastService, SearchBoxComponent, PopupWindowService, PopupWindowProperties } from '@app/shared';
// Service
import { EditUserService, UserSharedService } from '@app/users';

// Model
import { UserRoles } from '@app/core';
import { User, OktaUserProfile, UserProfile, OktaStatus, UserLabels } from '@app/users';

@Component({
  selector: 'pc-user-list',
  styleUrls: ['./user-list.component.scss'],
  template: `
    <div class="row UserHeaderSearch">
      <div class="col-md-9">
        <oc-button-action
          mode="secondary"
          [buttonText]="'Add User'"
          [buttonIcon]="'add'"
          (click)="openAddUser()"
        ></oc-button-action>
      </div>
      <div class="col-md-3"><oc-search-box #searchBox placeHolderText="Search"></oc-search-box></div>
    </div>

    <div *ngIf="!stillLoading; else loading" class="userlistouterdiv">
      <oc-toast>
        <div class="notification-container" *ngIf="!userProfile.length" style="display: block; visibility: visible;">
          <div class="notification hide success" id="notification">
            <div class="notification-icon"></div>
            <div class="notification-msg"></div>
          </div>
        </div>
      </oc-toast>
      <div class="container mat-elevation-z8">
        <oc-grid #ocgrid ocgridfilter="false" style="height:100%">
          <ng-container class="ocgridheader">
            <div class="first"></div>
            <div class="col width-username nowrap">User Name</div>
            <div class="col width-email nowrap">Email</div>
            <div class="col width-firstname nowrap">First Name</div>
            <div class="col width-lastname nowrap">Last Name</div>
            <div class="col width-status nowrap appstatus">Status</div>
          </ng-container>
          <ng-container class="ocgridbody">
            <div
              class="row"
              *ngFor="let user of userProfile; trackBy: trackByFn"
              (click)="onRowClick(user)"
              style="cursor:hand"
            >
              <div class="first"></div>
              <div class="col" [attr.data-title]="'userId'" style="display:none">{{ user.id }}</div>
              <div class="col width-username nowrap" ocGridColwrap [attr.data-title]="'username'">
                {{ user.login }}
                <!--span *ngFor="let prof of user.profile">
        <span>{{prof.firstName}}</span></span>-->
              </div>
              <div class="col width-email nowrap" ocGridColwrap [attr.data-title]="'email'">{{ user.email }}</div>
              <div class="col width-firstname nowrap" [attr.data-title]="'firstname'">{{ user.firstName }}</div>
              <div class="col width-lastname nowrap" [attr.data-title]="'lastname'">
                {{ user.lastName }}
              </div>
              <div class="col width-status nowrap appstatus" ocGridColwrap [attr.data-title]="'status'">
                {{ user.status }}
              </div>
            </div>
          </ng-container>
        </oc-grid>
        <!-- Table to bind the data-->
      </div>
    </div>
    <ng-template #loading>
      <div div fxLayout="column" class="container">
        <div fxLayout="row" fxLayoutAlign="center center" style="padding: 2em 2em 0px 2em;">
          <div class="message">Loading Users...</div>
        </div>
      </div>
    </ng-template>
  `,
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  navigation: any[];
  isLoggedIn: Observable<boolean>;
  userName: Observable<string>;
  userRole$: string;
  customerName: string;
  oktaGroupName: string;
  displayToast = false;
  stillLoading = false;
  users: any[] = [];
  usersforfilter: any[] = [];
  popWindowLayout: any;
  userProfile: OktaUserProfile[] = [];
  labels = new UserLabels();
  unsubscribe$ = new Subject();

  @ViewChild('searchBox') searchElement: SearchBoxComponent;
  toasterTimeout = env.toasterTimeout;
  constructor(
    private _edituserService: EditUserService,
    private router: Router,
    private _popupWindow: PopupWindowService,
    private _toastservice: ToastService,
    private _customerContext: CustomerContextService,
    private _usersharedService: UserSharedService
  ) {}

  ngOnInit() {
    this.stillLoading = true;
    this._toastservice.dismiss();
    this._customerContext
      .getCustomerContext()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((_) => {
        this.loadData();
      });
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  ngAfterViewInit() {
    this.searchElement.searchOutput$
      .pipe(debounceTime(250))
      .pipe(
        switchMap((searchData: string) => {
          return of(searchData);
        })
      )
      .subscribe((data) => {
        this.checkSearchkeyword(data);
      });
  }

  // Validate search parameter and search user
  checkSearchkeyword(data: string) {
    if (data !== '') {
      this.searchUser(data);
    } else {
      this.userProfile = [];
      this.userProfile = this.usersforfilter;
    }
  }

  setProfileObject(): UserProfile {
    let profile: UserProfile;
    profile = { id: '', firstName: '', lastName: '', email: '', login: '', status: '' };
    return profile;
  }

  // Search User
  searchUser(data: string) {
    this.userProfile = [];
    this._edituserService.searchUser(data).subscribe(
      (userdata) => {
        if (userdata.length > 0) {
          this.users = userdata as User[];
          this.userProfile = [];
          this.mapProfile(this.users, false);
        } else {
          this._toastservice.warning('information', this.labels.NO_USER_FOUND, { timeout: 5000, pauseOnHover: true });
        }
      },
      (error) => this._toastservice.success('error', this.labels.ERROR_OCCURED, { timeout: 5000, pauseOnHover: true })
    );
  }

  mapProfile(userProfile: any, isLoadUser: boolean) {
    let profile: UserProfile;
    userProfile.forEach((user) => {
      profile = this.setProfileObject();
      profile.id = user['id'];
      profile.firstName = user['profile'].firstName;
      profile.lastName = user['profile'].lastName;
      profile.email = user['profile'].email;
      profile.login = user['profile'].login;
      profile.status = this._usersharedService.getCustomStatusMappedtoOkta(user['status']);
      if (
        profile.id !== '' ||
        profile.firstName !== '' ||
        profile.lastName !== '' ||
        profile.email !== '' ||
        profile.login !== '' ||
        profile.status !== ''
      ) {
        this.userProfile.push(profile);
      }

      if (isLoadUser) {
        this.usersforfilter = [];
        this.usersforfilter = this.userProfile;
      }
    });
  }
  // Load data
  loadData() {
    this.userProfile = [];
    this._edituserService.getOktaGroupmembers().subscribe(
      (data) => {
        this.users = data as User[];
        this.mapProfile(this.users, true);
      },
      (error) => this._toastservice.success('error', this.labels.ERROR_OCCURED, { timeout: 5000, pauseOnHover: true })
    );
    this.stillLoading = false;
  }

  onRowClick(row: any) {
    const userId = row['id'];
    this.router.navigate(['/edit-user-form/' + userId]);
  }

  openAddUser() {
    this.popWindowLayout = { info: false, filter: false, footer: false };
    const properties = new PopupWindowProperties();
    properties.data = {
      windowLayout: this.popWindowLayout,
    };
    this._popupWindow.show(PopupAdduserComponent, properties);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
