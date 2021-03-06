import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {SessionService} from '../../session/session.service';

import {ApiRequest} from '../core/api-request';
import {Url} from '../../../core/url/url';


/**
 * takes care of handling HTTP requests to the timetracker backend. It set's authentication and headers.
 */
@Injectable()
export class TimetrackerApiReuqestService extends ApiRequest {
  constructor(_http: Http, private _sessionService: SessionService) {
    super(_http);
  }

  public getBaseUrl(): Url {
    return this.sessionService.apiUrl.getRelativeUrl('api');
  }

  public getHeaders(): Headers {
    let headers: Headers = super.getHeaders();

    if (this.sessionService.authenticationKey) {
      headers.append('Authorization', `Token ${this.sessionService.authenticationKey}`);
    }

    return headers
  }

  get sessionService(): SessionService {
    return this._sessionService;
  }
}
