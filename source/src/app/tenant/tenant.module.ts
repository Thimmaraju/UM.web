import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { FormsModule } from '@angular/forms';

// containers

// components
import { TenantDetailsComponent } from './components/tenant-details/tenant-details.component';

@NgModule({
  imports: [SharedModule, FormsModule],
  declarations: [TenantDetailsComponent],
  providers: [],
  exports: [TenantDetailsComponent]
})
export class TenantModule {}
