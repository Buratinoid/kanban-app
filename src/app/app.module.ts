import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'kanban', component: KanbanComponent},
  { path: 'signup', component: RegistrationComponent},
  { path: 'signin', component: AutorizationComponent}
];

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { AutorizationComponent } from './autorization/autorization.component';
import { HeaderComponent } from './header/header.component';
import { KanbanComponent } from './kanban/kanban.component';
import { HomeComponent } from './home/home.component';

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
      HomeComponent
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

