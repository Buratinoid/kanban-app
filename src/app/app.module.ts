import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'kanban', component: KanbanComponent},
  { path: 'signup', component: RegistrationComponent},
  { path: 'signin', component: AutorizationComponent},
  { path: 'board/:id', component: BoardComponent}
];

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AutorizationComponent } from './components/autorization/autorization.component';
import { HeaderComponent } from './components/header/header.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { BoardComponent } from './components/board/board.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/task/task.component';

import { RequestService } from './services/request.service';
import { BoardService } from './services/board.service';
import { ColumnService } from './services/column.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';



@NgModule({
  declarations: [									
      AppComponent,
      RegistrationComponent,
      AutorizationComponent,
      HeaderComponent,
      KanbanComponent,
      HomeComponent,
      BoardComponent,
      ColumnComponent,
      TaskComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    RequestService,
    BoardService,
    ColumnService,
    TaskService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

