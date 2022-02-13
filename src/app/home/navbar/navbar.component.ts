import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faGithub = faGithub;

  loginUri: string;

  constructor(public authService: AuthService) {
    const loginUriBuilder = new URL('https://github.com/login/oauth/authorize');
    loginUriBuilder.searchParams.append('client_id', authService.githubApiClientId);
    loginUriBuilder.searchParams.append('redirect_uri', window.location.href);
    // loginUriBuilder.searchParams.append('state', authervice.sessionStateToken);

    this.loginUri = loginUriBuilder.toString();
   }

  ngOnInit(): void {
  }

}
