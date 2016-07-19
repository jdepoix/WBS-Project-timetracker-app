import {Injectable, EventEmitter} from '@angular/core';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from './session.service';

@Injectable()
export class SessionAuthenticationService {
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  public login(username: string, password: string): EventEmitter<string> {
    let response: EventEmitter<string> = new EventEmitter<string>();

    this._timetrackerApiService.post('login', {
      username: username,
      password: password
    }).subscribe((plainObject: any) => {
      this._sessionService.authenticationKey = plainObject.token || null;
      response.emit(this._sessionService.authenticationKey);
    });

    return response;
  }

  public logout(): void {
    this._sessionService.authenticationKey = null;
  }
}