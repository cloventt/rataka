import { Component, OnInit } from '@angular/core';
import { faTrash, faSearch } from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

fontawesome.library.add(faTrash, faSearch);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rataka-ui';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.authService.authenticate(code);
    }
  }

}
