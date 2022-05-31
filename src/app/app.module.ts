import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import {HomeComponent} from './components/home/home.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {AuthorizationComponent} from './components/authorization/authorization.component';
import {HeaderComponent} from './components/header/header.component';
import {KanbanComponent} from './components/kanban/kanban.component';
import {BoardComponent} from './components/board/board.component';
import {ColumnComponent} from './components/column/column.component';
import {TaskComponent} from './components/task/task.component';

import {BoardAddComponent} from 'src/app/modals/board-add/board-add.component';
import {BoardUpdateComponent} from './modals/board-update/board-update.component';
import {ColumnAddComponent} from './modals/column-add/column-add.component';

import {RequestService} from './services/request.service';
import {BoardService} from './services/board.service';
import {ColumnService} from './services/column.service';
import {TaskService} from './services/task.service';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    AuthorizationComponent,
    HeaderComponent,
    KanbanComponent,
    HomeComponent,
    BoardComponent,
    ColumnComponent,
    TaskComponent,

    BoardAddComponent,
    BoardUpdateComponent,
    ColumnAddComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
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
    AuthService,
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: []}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    BoardAddComponent,
    BoardUpdateComponent,
    ColumnAddComponent
  ]
})
export class AppModule {
}

