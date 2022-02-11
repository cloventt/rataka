import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogListComponent } from './log-list/log-list.component';
import { DataService } from './data.service';
import { LogListRowComponent } from './log-list/log-list-row/log-list-row.component';
import { FormModalComponent } from './new/form-modal/form-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LogListComponent,
    LogListRowComponent,
    FormModalComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
