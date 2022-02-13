import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  githubApiClientId = 'Iv1.83e311d8821e9075';

  githubApiToken: string | undefined;

  githubRefreshToken: string | undefined;

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router
  ) {

    if (this.isAuthenticated) {
      this.githubApiToken = this.cookieService.get("githubApiToken");
    }
    if (this.hasRefreshToken) {
      this.githubRefreshToken = this.cookieService.get("githubRefreshToken");
      if (this.githubApiToken == null) {
        this.refresh();
      }
    }


  }

  authenticate(temporaryAccessCode: string) {
    console.debug('Issuing token request to gatekeeper');
    this.httpClient
      .get<GithubAppApiResponse>(`https://rataku-github-oauth.herokuapp.com/authenticate/${temporaryAccessCode}`)
      .subscribe(this.handleResponse.bind(this))
  }

  refresh() {
    console.debug('Issuing token refresh request to gatekeeper');
    this.httpClient
      .get<GithubAppApiResponse>(`https://rataku-github-oauth.herokuapp.com/refresh/${this.githubRefreshToken}`)
      .subscribe(this.handleResponse.bind(this))
  }

  private handleResponse(response: GithubAppApiResponse) {
    console.debug('Received response from Gatekeeper', response);
    if (response.access_token != null) {
      this.githubApiToken = response.access_token;
      this.cookieService.set(
        'githubApiToken',
        response.access_token,
        {
          expires: new Date(new Date().getTime() + (+response.expires_in * 1000)),
          sameSite: 'Strict'
        }
      );
    }

    if (response.refresh_token != null) {
      this.githubRefreshToken = response.refresh_token;
      this.cookieService.set(
        'githubRefreshToken',
        response.refresh_token,
        {
          expires: new Date(new Date().getTime() + (+response.refresh_token_expires_in * 1000)),
          sameSite: 'Strict'
        }
      );
    }
    this.router.navigate(['/']);  // clear the code from the page URL
  }

  logOut() {
    this.cookieService.deleteAll();
  }

  get isAuthenticated() {
    return this.cookieService.check('githubApiToken');
  }

  get hasRefreshToken() {
    return this.cookieService.check('githubRefreshToken');
  }


}

type GithubAppApiResponse = {
  access_token: string;
  expires_in: string;
  refresh_token: string,
  refresh_token_expires_in: string,
  scope: string,
  token_type: string,
}