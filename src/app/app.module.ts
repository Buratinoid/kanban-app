import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import {HomeComponent} from './components/home/home.component';
import {RegistrationComponent} from './components/user-components/registration/registration.component';
import {AuthorizationComponent} from './components/user-components/authorization/authorization.component';
import {ProfileComponent} from './components/user-components/profile/profile.component';
import {HeaderComponent} from './components/header/header.component';
import {KanbanComponent} from './components/kanban-components/kanban/kanban.component';
import {BoardComponent} from './components/kanban-components/board/board.component';
import {ColumnComponent} from './components/kanban-components/column/column.component';
import {TaskComponent} from './components/kanban-components/task/task.component';

import {BoardAddComponent} from './modals/board-add/board-add.component';
import {BoardUpdateComponent} from './modals/board-update/board-update.component';
import {ColumnAddComponent} from './modals/column-add/column-add.component';
import {TaskAddComponent} from './modals/task-add/task-add.component';
import {TaskUpdateComponent} from './modals/task-update/task-update.component';
import {DeleteConfirmComponent} from './modals/delete-confirm/delete-confirm.component';

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
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    AuthorizationComponent,
    ProfileComponent,
    HeaderComponent,
    KanbanComponent,
    HomeComponent,
    BoardComponent,
    ColumnComponent,
    TaskComponent,

    BoardAddComponent,
    BoardUpdateComponent,
    ColumnAddComponent,
    TaskAddComponent,
    TaskUpdateComponent,
    DeleteConfirmComponent
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
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    DragDropModule

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
    ColumnAddComponent,
    TaskAddComponent,
    TaskUpdateComponent,
    DeleteConfirmComponent
  ]
})
export class AppModule {
}

