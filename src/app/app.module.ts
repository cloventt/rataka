import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { LogListComponent } from './home/log-list/log-list.component';
import { DataService } from './data.service';
import { LogListRowComponent } from './home/log-list/log-list-row/log-list-row.component';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'add',
        outlet: 'modal',
        component: AddComponent
      }
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogListComponent,
    LogListRowComponent,
    HomeComponent,
    AddComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
