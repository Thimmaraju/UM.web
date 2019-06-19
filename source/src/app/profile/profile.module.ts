import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { AuthModule } from '@app/auth';
import { SharedModule } from '@app/shared';

import { ProfileRoutingModule } from './profile-routing.module';
// Containers
import { ProfileViewerComponent } from './containers/profile-viewer.component';

// Components
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileChangePasswordComponent } from './components/profile-changepassword/profile-changepassword.component';

// Service
import { ProfileService } from './shared/profile.service';

@NgModule({
  declarations: [ProfileViewerComponent, ProfileHeaderComponent, ProfileChangePasswordComponent],
  imports: [
    ProfileRoutingModule,
    //    AuthModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ProfileService],
  exports: [ProfileViewerComponent],
})
export class ProfileModule {}
