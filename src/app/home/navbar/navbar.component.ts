import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { GithubService } from 'src/app/github.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faGithub = faGithub;

  loginUri: string;

  constructor(
    public githubService: GithubService
  ) {
    const loginUriBuilder = new URL('https://github.com/login/oauth/authorize');
    loginUriBuilder.searchParams.append('client_id', githubService.githubApiClientId);
    loginUriBuilder.searchParams.append('redirect_uri', window.location.href);
    // loginUriBuilder.searchParams.append('state', authervice.sessionStateToken);

    this.loginUri = loginUriBuilder.toString();
  }

  ngOnInit(): void {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          if ($target != null) {
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
          }
        });
      });
    }
  }

}
