import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {KanbanComponent} from './components/kanban/kanban.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {AuthorizationComponent} from './components/authorization/authorization.component';
import {BoardComponent} from './components/board/board.component';
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'kanban', canActivate: [AuthGuard], component: KanbanComponent},
  {path: 'signup', component: RegistrationComponent},
  {path: 'signin', component: AuthorizationComponent},
  {path: 'board/:id', canActivate: [AuthGuard], component: BoardComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
