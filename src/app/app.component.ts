import { Component } from '@angular/core';
import {faTrash, faSearch} from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';

fontawesome.library.add(faTrash, faSearch);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rataka-ui';
}
