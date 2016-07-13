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
  private _sessionService: SessionService;

  constructor(_http: Http) {
    super(_http);
  }

  set sessionService(value: SessionService) {
    this._sessionService = value;
  }

  public getBaseUrl(): Url {
    return this._sessionService.apiUrl.getRelativeUrl('api');
  }

  public getHeaders(): Headers {
    let headers: Headers = super.getHeaders();

    if (this._sessionService.authenticationKey) {
      headers.append('Authorization', `Token ${this._sessionService.authenticationKey}`);
    }

    return headers
  }
}
