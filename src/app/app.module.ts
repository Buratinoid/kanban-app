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

import { BoardModalComponent } from './modals/board-modal/board-modal.component';

import { RequestService } from './services/request.service';
import { BoardService } from './services/board.service';
import { ColumnService } from './services/column.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
      TaskComponent,
      BoardModalComponent
      
   ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule 
  ],
  providers: [
    RequestService,
    BoardService,
    ColumnService,
    TaskService,
    UserService,
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: []}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BoardModalComponent
  ]
})
export class AppModule { }

