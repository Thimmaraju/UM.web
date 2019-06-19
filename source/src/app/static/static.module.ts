import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

@NgModule({
  imports: [CommonModule, StaticRoutingModule],
  declarations: [PageNotFoundComponent, NotAuthorizedComponent]
})
export class StaticModule {}
