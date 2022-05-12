import { Component, OnInit } from '@angular/core';
import { faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GithubService } from './github.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rataka-ui';

  constructor(private authService: GithubService) {
  }

  ngOnInit(): void {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.authService.authenticate(code);
    }
  }

}
