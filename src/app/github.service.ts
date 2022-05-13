import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Octokit } from 'octokit';
import { DataService } from './data.service';

const DB_GIST_DESCRIPTION = 'Rataka Call Log Database';

const DB_GIST_FILE = 'rataka.db.json';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  githubApiClientId = 'Iv1.83e311d8821e9075';

  githubApiToken?: string;

  githubRefreshToken?: string;

  private octokitClient?: Octokit

  gistId?: string

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router,
    private dataService: DataService,
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
    this.sync();
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

  get githubClient() {
    if (!this.octokitClient) {
      if (this.isAuthenticated) {
        this.octokitClient = new Octokit({
          auth: this.githubApiToken,
        })
      } else {
        throw new Error("Cannot create a github client until the user authenticates");
      }
    }
    return this.octokitClient;
  }

  private async getDbGistId() {
    const apiResponse = await this.githubClient.request('GET /gists', {})
    console.debug('Received response to GET /gists');
    const matchingGists = apiResponse.data.filter(gistMeta => gistMeta.description == DB_GIST_DESCRIPTION)
    if (matchingGists.length == 0) {
      console.debug('No matching gists found, initiliasing one');
      return this.initGist();
    } else {
      this.gistId = matchingGists[0].id;
    }
    console.debug(`Using gist with id ${this.gistId}`);
    return this.gistId;
  }

  private async initGist() {
    console.debug('Initialising new gist with current DB contents');
    const currentDbBlob = await this.dataService.export();

    const currentDbText = await currentDbBlob.text()

    const apiResponse = await this.githubClient.request('POST /gists', {
      description: DB_GIST_DESCRIPTION,
      files: {
        'rataka.db.json': {
          content: currentDbText,
        }
      },
      public: false,
    })

    if (apiResponse.status > 400) {
      throw new Error(`Error creating new gist in github (status code: ${apiResponse.status})`)
    } else if (apiResponse.status > 300) {
      throw new Error(`Gist already exists in github (status code: ${apiResponse.status})`)
    } else {
      this.gistId = apiResponse.data.id;
      return this.gistId;
    }
  }

  private async retrieveGist() {
    if (!this.gistId) {
      await this.getDbGistId();
    }

    const getResponse = await this.githubClient.request(`GET /gists/${this.gistId}`, {
      gist_id: this.gistId
    })

    if (getResponse.status > 400) {
      throw new Error(`Failed to get gist details (id: ${this.gistId}, status code: ${getResponse.status})`)
    }

    const version = getResponse.data.version;
    const contentUrl = getResponse.data.url;

    const contentResponse = await this.githubClient.request(`GET ${contentUrl}`, {})

    console.debug(contentResponse);

    if (contentResponse.status > 400) {
      throw new Error(`Failed to get gist contents (url: ${contentUrl}, status code: ${contentResponse.status})`)
    }

    const gistData = {
      gistId: this.gistId,
      version: version,
      content: contentResponse.data.files['rataka.db.json'].content
    }

    return gistData;

  }

  public async sync() {
    if (this.isAuthenticated) {
      const currentGist = await this.retrieveGist();
      const currentDbText = await (await this.dataService.export()).text();

      const migrated = await this.dataService.migrate(currentGist.content);

      if (!migrated) {
        // pull in changes from remote
        await this.dataService.import(currentGist.content);
      }

      // merge local changes on top
      if (this.dataService.hasPendingChanges) {
        await this.dataService.import(currentDbText);
      }

      // store the merged result
      const mergedDbText = await (await this.dataService.export()).text();

      this.githubClient.request(`PATCH /gists/${currentGist.gistId}`, {
        files: {
          'rataka.db.json': {
            content: mergedDbText,
          }
        }
      })

      this.dataService.hasPendingChanges = false;
    }
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