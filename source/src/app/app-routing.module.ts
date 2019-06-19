import { NgModule } from '@angular/core';
import { CanLoad, RouterModule, Routes } from '@angular/router';

import { CanLoadAuthorizedGuard } from '@app/core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: 'login',
    redirectTo: '/login',
  },
  {
    path: 'newpasswordnew',
    redirectTo: '/newpasswordnew',
  },
  {
    path: 'users',
    redirectTo: '/user-list',
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
