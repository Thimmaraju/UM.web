import { Component, OnInit, Output, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, forkJoin, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ToastService, PopupDialogProperties, PopupDialogType, PopupDialogService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UserinformationComponent, UserAuditLogComponent } from '@app/users';
import { environment as env } from '@env/environment';

// service
import { EditUserService, UserSharedService } from '@app/users';

// Model
import {
  UserRole,
  Group,
  GroupProfile,
  OktaUser,
  User,
  OktaUserProfile,
  UserSiteAssociation,
  Site,
  UserLabels,
  OktaStatus,
  UserAuditLog,
} from '@app/users';
import { UserroleComponent, UserSiteAssociationComponent, EditUserHeaderComponent } from '@app/users';

@Component({
  selector: 'pc-edit-user-form',
  styleUrls: ['./edit-user-form.component.scss'],
  template: `
    <div id="userDetail" class="flex flex-1 column">
      <oc-toast>
        <div class="notification-container" *ngIf="displayToast" style="display: block; visibility: visible;">
          <div class="notification hide success" id="notification">
            <div class="notification-icon"></div>
            <div class="notification-msg"></div>
          </div>
        </div>
      </oc-toast>
      <div class="header-area">
        <pc-edit-user-header
          #userinformationheader
          [userName]="username"
          [firstName]="firstname"
          [lastName]="lastname"
        ></pc-edit-user-header>
      </div>
      <ng-container class="ocwindowcontent">
        <!-- Popup Window content should go here -->
        <div class="extramarginbottom">
          <mat-tab-group [selectedIndex]="selectedTab" #usertabGroup>
            <mat-tab>
              <ng-template mat-tab-label>
                User Information
                <span class="status-badge image-pending" *ngIf="pendingUserInformationTab"></span>
                <span class="status-badge image-warning" *ngIf="warningUserInformationTab"></span>
              </ng-template>
              <!--<mat-tab label="User Information">
            <img [src]="usersBackButton" />-->
              <pc-userinformation
                #userinformationtab
                [isNonOkta]="isADUser"
                [isActive]="isActiveUser"
                [isSuspendedUser]="isSuspended"
                [currentuserId]="userId"
                [status]="status"
                (changestatus)="statusChanged($event)"
                (resetPassword)="onPasswordReset()"
              ></pc-userinformation>
            </mat-tab>
            <!--[firstname]='firstname'
      [lastname]='lastname' [username]='username' [email]='email'-->
            <mat-tab>
              <ng-template mat-tab-label>
                Roles
                <span class="status-badge image-pending" *ngIf="pendingRolesTab"></span>
                <span class="status-badge image-warning" *ngIf="warningRolesTab"></span>
              </ng-template>
              <pc-userrole
                #rolesTab
                [currentuserId]="userId"
                [userRoles]="oktaRoles"
                [isADUser]="isADUser"
                (changeRole)="roleChanged($event)"
              ></pc-userrole>
            </mat-tab>
            <mat-tab>
              <ng-template mat-tab-label>
                Site Association
                <span class="status-badge image-pending" *ngIf="pendingSiteAssociationTab"></span>
                <span class="status-badge image-warning" *ngIf="warningSiteAssociationTab"></span>
              </ng-template>
              <pc-user-site-association
                #siteAssociationTab
                [userSites]="userSites"
                (associateSite)="siteAssociated($event)"
              ></pc-user-site-association>
            </mat-tab>
            <mat-tab label="Audit Log">
              <pc-user-audit-log [currentuserId]="userId"> </pc-user-audit-log>
            </mat-tab>
          </mat-tab-group>
        </div>
      </ng-container>
      <oc-footer>
        <div class="ocrightalign">
          <oc-button-action
            buttonText="Save"
            #SaveButton
            [disabled]="isSaveButtonDisabled"
            (click)="updateUser()"
          ></oc-button-action>
        </div>
      </oc-footer>
    </div>
  `,
})
export class EditUserFormComponent implements OnInit, OnDestroy {
  userInformationOptions = [
    { name: 'User Profile', displayField: 'Profile', valueField: 'P', showChanges: false, showWarning: false },
    { name: 'User Credentials', displayField: 'Credentials', valueField: 'C', showChanges: false, showWarning: false },
  ];
  selectedItem = 'P';
  data: any;
  labels = new UserLabels();
  displayToast = false;
  editUserForm: FormGroup;
  users: User[];
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  status: string;
  isPharmAdmin = false;
  isPharmTechnician = false;
  isUserAdmin = false;
  oktaRoles: UserRole[] = [];
  userAssignedgroups: Group[] = [];
  isADUser = false;
  isActiveUser = false;
  isSuspended = false;
  userSites: UserSiteAssociation[] = [];
  userAssociatedSitesID: any[] = [];
  isSaveButtonDisabled = true;
  // for tabs
  selectedTab: number;
  pendingUserInformationTab = false;
  warningUserInformationTab = false;
  pendingRolesTab = false;
  warningRolesTab = false;
  pendingSiteAssociationTab = false;
  warningSiteAssociationTab = false;
  userId: string;
  subDomain: string; // customer short form
  unsubscribe$ = new Subject();

  @ViewChild('userinformationtab') userinformationtab: UserinformationComponent;
  @ViewChild('rolesTab') rolesTab: UserroleComponent;
  @ViewChild('siteAssociationTab') siteAssociationTab: UserSiteAssociationComponent;
  @ViewChild('userinformationheader') userinformationheader: EditUserHeaderComponent;

  @ViewChild('SaveButton') saveButton;

  toasterTimeout = env.toasterTimeout;
  constructor(
    private route: ActivatedRoute,
    private _editUserService: EditUserService,
    private _toastservice: ToastService,
    private router: Router,
    private dialogService: PopupDialogService,
    private _userSharedService: UserSharedService
  ) {}

  ngOnInit() {
    this.selectedItem = 'P';
    this.selectedTab = 0;
    this.users = [];
    this.route.params
      .pipe(
        switchMap((params: any) =>
          forkJoin(
            this._editUserService.getUserDetails(params['id']),
            this._editUserService.getUserRoles(params['id']),
            this._editUserService.getOktaRoles(),
            (this.userId = params['id'])
          )
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.getUserDetails(data[0]);
        this.getUserRoles(data[1]);
        this.getOktaRoles(data[2]);
      });
  }

  displayDialog(title: string, message: string, listOfItems: string[], popupType: PopupDialogType): void {
    const properties = new PopupDialogProperties('Role-Status-Warning');
    properties.titleElementText = title;
    properties.primaryButtonText = 'Ok';
    properties.showSecondaryButton = false;
    properties.dialogDisplayType = popupType;
    properties.listOfItems = listOfItems;
    properties.timeoutLength = 200;
    this.dialogService.showOnce(properties);
  }

  getUserDetails(data) {
    if (data) {
      const userProfile = data['profile'];
      this.firstname = userProfile.firstName;
      this.lastname = userProfile.lastName;
      this.email = userProfile.email;
      this.username = userProfile.login;
      this.status = this._userSharedService.getCustomStatusMappedtoOkta(data['status']);
      if (data['profile'].sites) {
        this.userAssociatedSitesID = data['profile'].sites;
      }
      if (data['status'] === this.labels.ACTIVE_USER_STATUS) {
        this.isActiveUser = true;
      } else if (data['status'] === this.labels.SUSPENDED_USER_STATUS) {
        this.isSuspended = true;
      }
      if (data['credentials']) {
        if (data['credentials'].provider.name !== this.labels.OKTAPROVIDER) {
          this.isADUser = true;
          const listOfItems = [this.labels.ADUSER_MESSAGE];
          this.displayDialog('Information', '', listOfItems, PopupDialogType.Info);
          /*this._toastservice.info('information', this.labels.ADUserSelectedInfo, {
            timeout: 5000,
            pauseOnHover: true,
          });*/
        }
      }
      this.userinformationtab.editUserForm.setValue({
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
      });

      this.userinformationheader.firstName = this.firstname;
      this.userinformationheader.lastName = this.lastname;
      this.userinformationheader.userName = this.username;

      this.checkUserInfoChanged();
    }
  }

  checkUserInfoChanged() {
    this.userinformationtab.editUserForm.valueChanges.subscribe((value) => {
      if (this.userinformationtab.editUserForm.invalid) {
        this.warningUserInformationTab = true;
        this.pendingUserInformationTab = false;
        this.userinformationtab.userInformationOptions[0].showWarning = true;
        this.userinformationtab.userInformationOptions[0].showChanges = false;
        this.isSaveButtonDisabled = true;
      } else if (value.firstname !== this.firstname || value.lastname !== this.lastname || value.email !== this.email) {
        this.pendingUserInformationTab = true;
        this.isSaveButtonDisabled = false;
        this.warningUserInformationTab = false;
        this.userinformationtab.userInformationOptions[0].showWarning = false;
        this.userinformationtab.userInformationOptions[0].showChanges = true;
      } else {
        this.isSaveButtonDisabled = true;
        this.pendingUserInformationTab = false;
        this.warningUserInformationTab = false;
        this.userinformationtab.userInformationOptions[0].showWarning = false;
        this.userinformationtab.userInformationOptions[0].showChanges = false;
      }
    });
  }

  roleChanged(role: any) {
    if (role) {
      const isPendingRolesSaved = this.rolesTab.userRoles.find((x) => x.isPending);
      if (isPendingRolesSaved) {
        this.pendingRolesTab = true;
        this.isSaveButtonDisabled = false;
      } else {
        this.pendingRolesTab = false;
        this.isSaveButtonDisabled = true;
      }

      if (role.rolename === this.labels.ROLE_USERADMIN && role.userAssigned) {
        this.isUserAdmin = true;
      } else if (role.rolename === this.labels.ROLE_PHARMACYADMIN && role.userAssigned) {
        this.isPharmAdmin = true;
      } else if (role.rolename === this.labels.ROLE_PHARMACYTECHNICIAN && role.userAssigned) {
        this.isPharmTechnician = true;
      } else if (role.rolename === this.labels.ROLE_USERADMIN && !role.userAssigned) {
        this.isUserAdmin = false;
      } else if (role.rolename === this.labels.ROLE_PHARMACYADMIN && !role.userAssigned) {
        this.isPharmAdmin = false;
      } else if (role.rolename === this.labels.ROLE_PHARMACYTECHNICIAN && !role.userAssigned) {
        this.isPharmTechnician = false;
      }
    }
  }

  statusChanged(isStatusChanged: boolean) {
    if (isStatusChanged) {
      this.pendingUserInformationTab = true;
      this.userinformationtab.userInformationOptions[1].showChanges = true;
      this.isSaveButtonDisabled = false;
    } else {
      this.pendingUserInformationTab = false;
      this.userinformationtab.userInformationOptions[1].showChanges = false;
      this.isSaveButtonDisabled = true;
    }
  }

  siteAssociated(site: any) {
    if (site) {
      const isPendingSitesSaved = this.siteAssociationTab.userSites.find((x) => x.isPending);
      if (isPendingSitesSaved) {
        this.pendingSiteAssociationTab = true;
        this.isSaveButtonDisabled = false;
      } else {
        this.pendingSiteAssociationTab = false;
        this.isSaveButtonDisabled = true;
      }

      if (this.userAssociatedSitesID.indexOf(site.id) < 0 && site.userAssociated) {
        this.userAssociatedSitesID.push(site.id);
        this.saveButton.disabled = false;
      } else if (this.userAssociatedSitesID.indexOf(site.id) >= 0 && !site.userAssociated) {
        const index: number = this.userAssociatedSitesID.indexOf(site.id);
        this.userAssociatedSitesID.splice(index, 1);
        this.saveButton.disabled = false;
      }
    }
  }

  getUserRoles(userRoles) {
    if (userRoles) {
      userRoles.forEach((userRole) => {
        switch (userRole['profile'].name) {
          case 'Role:' + this.labels.ROLE_PHARMACYADMIN:
            this.isPharmAdmin = true;
            break;

          case 'Role:' + this.labels.ROLE_USERADMIN:
            this.isUserAdmin = true;
            break;

          case 'Role:' + this.labels.ROLE_PHARMACYTECHNICIAN:
            this.isPharmTechnician = true;
            break;

          default:
            break;
        }
      });
    }
  }

  getOktaRoles(data) {
    if (data) {
      const rolesforOkta = data;

      rolesforOkta.forEach((oktaRole) => {
        const roles: UserRole = { id: '', rolename: '', roledescription: '', userAssigned: false };
        const profile: GroupProfile = { name: '', description: '' };
        const usergroup: Group = { id: '', profile: profile };

        switch (oktaRole['profile'].name) {
          case 'Role:' + this.labels.ROLE_USERADMIN:
            roles.id = oktaRole['id'];
            roles.rolename = oktaRole['profile'].name.substring(
              oktaRole['profile'].name.indexOf(':') + 1,
              oktaRole['profile'].name.length
            );
            roles.roledescription = oktaRole['profile'].description;
            if (this.isUserAdmin) {
              roles.userAssigned = true;
            }
            break;

          case 'Role:' + this.labels.ROLE_PHARMACYADMIN:
            roles.id = oktaRole['id'];
            roles.rolename = oktaRole['profile'].name.substring(
              oktaRole['profile'].name.indexOf(':') + 1,
              oktaRole['profile'].name.length
            );
            roles.roledescription = oktaRole['profile'].description;
            if (this.isPharmAdmin) {
              roles.userAssigned = true;
            }
            break;

          case 'Role:' + this.labels.ROLE_PHARMACYTECHNICIAN:
            roles.id = oktaRole['id'];
            roles.rolename = oktaRole['profile'].name.substring(
              oktaRole['profile'].name.indexOf(':') + 1,
              oktaRole['profile'].name.length
            );
            roles.roledescription = oktaRole['profile'].description;
            if (this.isPharmTechnician) {
              roles.userAssigned = true;
            }
            break;

          default:
            roles.id = oktaRole['id'];
            roles.rolename = oktaRole['profile'].name.substring(
              oktaRole['profile'].name.indexOf(':') + 1,
              oktaRole['profile'].name.length
            );
            roles.roledescription = oktaRole['profile'].description;
            roles.userAssigned = false;
            break;
        }

        if (roles.id !== '' || roles.rolename !== '' || roles.roledescription !== '') {
          roles.isPending = false;
          this.oktaRoles.push(roles);
        }
      });
    }
    this.getCustomerSites();
  }

  getCustomerSites() {
    this._editUserService.getCustomerSites().subscribe((associatedSites) => {
      if (associatedSites) {
        let facilities: Site[] = [];
        this.userSites = [];
        facilities = associatedSites;
        if (facilities) {
          facilities.forEach((facility) => {
            const userFacility: UserSiteAssociation = { id: 0, name: '', description: '', userAssociated: false };
            userFacility.id = facility.facilityId;
            userFacility.name = facility.facilityName;
            userFacility.description = facility.facilityDescription;
            if (this.userAssociatedSitesID.indexOf(facility.facilityId) >= 0) {
              userFacility.userAssociated = true;
            } else {
              userFacility.userAssociated = false;
            }

            if (userFacility.id !== null || userFacility.name !== '' || userFacility.description !== '') {
              userFacility.isPending = false;
              this.userSites.push(userFacility);
            }
          });
        }
      }
    });
  }

  setRoles(): Group[] {
    const groupsAssigned: Group[] = [];
    this.oktaRoles.forEach((oktaRole) => {
      const profile: GroupProfile = { name: '', description: '' };
      const usergroup: Group = { id: '', profile: profile };
      if (oktaRole['rolename'] === this.labels.ROLE_USERADMIN && this.isUserAdmin) {
        usergroup.id = oktaRole['id'];
        profile.name = oktaRole['rolename'];
        profile.description = oktaRole['roledescription'];
        usergroup.profile = profile;
        if (usergroup) {
          groupsAssigned.push(usergroup);
        }
      } else if (oktaRole['rolename'] === this.labels.ROLE_PHARMACYTECHNICIAN && this.isPharmTechnician) {
        usergroup.id = oktaRole['id'];
        profile.name = oktaRole['rolename'];
        profile.description = oktaRole['roledescription'];
        usergroup.profile = profile;
        if (usergroup) {
          groupsAssigned.push(usergroup);
        }
      } else if (oktaRole['rolename'] === this.labels.ROLE_PHARMACYADMIN && this.isPharmAdmin) {
        usergroup.id = oktaRole['id'];
        profile.name = oktaRole['rolename'];
        profile.description = oktaRole['roledescription'];
        usergroup.profile = profile;
        if (usergroup) {
          groupsAssigned.push(usergroup);
        }
      }
    });
    return groupsAssigned;
  }

  setProfile(assignedGroup: Group[], tempProfile: any): OktaUser {
    const userProfile: OktaUserProfile = {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      sites: [],
    };

    const selectedUser: User = {
      id: '',
      status: '',
      profile: userProfile,
      credentials: null,
    };

    const oktacurrentUser: OktaUser = {
      User: selectedUser,
      Groups: assignedGroup,
      ResetPasswordOnNextLogin: false,
      ActivateUser: false,
      SuspendUser: false,
    };
    selectedUser.id = this.userId;
    selectedUser.status = 'ACTIVE';

    if (tempProfile) {
      userProfile.firstName = tempProfile.firstname;
      userProfile.lastName = tempProfile.lastname;
      userProfile.email = tempProfile.email;
      userProfile.login = tempProfile.username;
      if (this.userAssociatedSitesID.length > 0) {
        userProfile.sites = this.userAssociatedSitesID;
      }
    }
    selectedUser.profile = userProfile;
    selectedUser.credentials = null;
    oktacurrentUser.User = selectedUser;
    oktacurrentUser.Groups = assignedGroup;

    if (this.isActiveUser && !this.userinformationtab.isUserinActiveState) {
      oktacurrentUser.SuspendUser = true;
    } else if (!this.isActiveUser && this.userinformationtab.isUserinActiveState) {
      oktacurrentUser.ActivateUser = true;
    }

    return oktacurrentUser;
  }

  updateUser() {
    const groupsAssigned: Group[] = this.setRoles();
    const tempProfile: any = this.userinformationtab.editUserForm.getRawValue();
    const oktacurrentUser: OktaUser = this.setProfile(groupsAssigned, tempProfile);

    if (this.userinformationtab.editUserForm.valid) {
      if (this.email.toLowerCase() === tempProfile.email.toLowerCase()) {
        this.displayUserUpdateSuccess(oktacurrentUser);
      } else {
        this._editUserService.searchUser(oktacurrentUser.User.profile.email).subscribe(
          (data) => {
            if (data.length <= 0) {
              this.displayUserUpdateSuccess(oktacurrentUser);
            } else {
              this._toastservice.success('error', this.labels.EMAIL_ALREADY_EXISTS, {
                timeout: 5000,
                pauseOnHover: true,
              });
            }
          },
          (error) => {
            this._toastservice.success('error', this.labels.UPDATE_USER_ERROR, { timeout: 5000, pauseOnHover: true });
          }
        );
      }
    } else {
      this._toastservice.success('error', this.labels.VALIDATE_ERROR, { timeout: 5000, pauseOnHover: true });
    }
  }

  updateHeaderInfo() {
    const tempProfile: any = this.userinformationtab.editUserForm.getRawValue();
    if (tempProfile) {
      this.userinformationheader.firstName = tempProfile.firstname;
      this.userinformationheader.lastName = tempProfile.lastname;
      this.firstname = tempProfile.firstname;
      this.lastname = tempProfile.lastname;
      this.email = tempProfile.email;
    }
  }

  resetValues() {
    this.pendingUserInformationTab = false;
    this.warningUserInformationTab = false;
    this.pendingRolesTab = false;
    this.warningRolesTab = false;
    this.pendingSiteAssociationTab = false;
    this.warningSiteAssociationTab = false;
    this.isSaveButtonDisabled = true;
    this.userinformationtab.userInformationOptions[0].showWarning = false;
    this.userinformationtab.userInformationOptions[0].showChanges = false;
    this.userinformationtab.userInformationOptions[1].showWarning = false;
    this.userinformationtab.userInformationOptions[1].showChanges = false;

    if (this.siteAssociationTab.userSites.find((x) => x.isPending)) {
      this.siteAssociationTab.userSites.forEach((userSite) => {
        userSite.isPending = false;
      });
    }

    if (this.rolesTab.userRoles.find((x) => x.isPending)) {
      this.rolesTab.userRoles.forEach((userRole) => {
        userRole.isPending = false;
      });
    }

    if (this.userinformationtab.isUserinActiveState !== this.isActiveUser && !this.isADUser) {
      if (!this.userinformationtab.isUserinActiveState) {
        this.userinformationtab.isActive = false;
        this.userinformationtab.isSuspendedUser = true;
        this.userinformationtab.status = this.labels.DEACTIVATED_USER_STATUS;
      } else if (this.userinformationtab.isUserinActiveState) {
        this.userinformationtab.isActive = true;
        this.userinformationtab.isSuspendedUser = false;
        this.userinformationtab.status = this.labels.ACTIVE_USER_STATUS;
      }
    }
  }

  displayUserUpdateSuccess(oktacurrentUser: OktaUser) {
    this._editUserService.updateUser(oktacurrentUser).subscribe(
      (data) => {
        this._toastservice.success('success', this.labels.USERUPDATESUCCESS, { timeout: 5000, pauseOnHover: true });
        this.resetValues();
        this.updateHeaderInfo();
      },
      (error) => this._toastservice.success('error', this.labels.ERROR_OCCURED, { timeout: 5000, pauseOnHover: true })
    );
  }

  onPasswordReset() {
    this._editUserService.resetPassword(this.userId).subscribe((data) => {
      const listOfItems = [this.labels.RESET_PASSWORD_LINK_POPUP_MESSAGE];
      this.displayDialog(this.labels.RESET_PASSWORD_LINK_POPUP_TITLE, '', listOfItems, PopupDialogType.Info);
      this.userinformationtab.status = this.labels.RESETPASSWORD_USER_STATUS;
      this.userinformationtab.isActive = false;
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (
      !this.isSaveButtonDisabled ||
      this.warningUserInformationTab ||
      this.warningSiteAssociationTab ||
      this.warningRolesTab
    ) {
      const properties = new PopupDialogProperties('Pending Changes');
      properties.titleElementText = this.labels.UNSAVED_CHANGES_TITLE;
      properties.messageElementText = this.labels.UNSAVED_CHANGES_MESSAGE;
      properties.primaryButtonText = this.labels.UNSAVED_CHANGES_CHOICE_OK; // Discard Changes
      properties.secondaryButtonText = this.labels.UNSAVED_CHANGES_CHOICE_DISCARD; // Go Back to Save
      properties.defaultTimeoutResponse = false;
      properties.dialogDisplayType = PopupDialogType.Warning;
      properties.timeoutLength = 500;

      const dialog = this.dialogService.showOnce(properties);

      if (dialog === undefined) {
        return false;
      }

      return dialog.response;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
