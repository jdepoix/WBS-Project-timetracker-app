import {Injectable} from '@angular/core';

import {Url} from '../../core/url/url';


/**
 * takes care of holding, saving and loading data, regarding the current session
 */
@Injectable()
export class SessionService {
  // TODO remove assignment, only for testing purposes
  private _apiUrl: Url = new Url('http://localhost:8000');
  // TODO remove assignment, only for testing purposes
  private _authenticationKey: string = '7b92d4f75aa4b149967d338d754f56101a330cf6';

  get apiUrl(): Url {
    return this._apiUrl;
  }

  set apiUrl(value: Url) {
    this._apiUrl = value;
  }

  get authenticationKey(): string {
    return this._authenticationKey;
  }

  set authenticationKey(value: string) {
    this._authenticationKey = value;
  }
}