import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {KanbanComponent} from './components/kanban-components/kanban/kanban.component';
import {RegistrationComponent} from './components/user-components/registration/registration.component';
import {AuthorizationComponent} from './components/user-components/authorization/authorization.component';
import {ProfileComponent} from './components/user-components/profile/profile.component';
import {BoardComponent} from './components/kanban-components/board/board.component';
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'kanban', canActivate: [AuthGuard], component: KanbanComponent},
  {path: 'signup', component: RegistrationComponent},
  {path: 'signin', component: AuthorizationComponent},
  {path: 'profile', canActivate: [AuthGuard], component: ProfileComponent},
  {path: 'board/:id', canActivate: [AuthGuard], component: BoardComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
