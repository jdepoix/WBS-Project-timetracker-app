import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs/Rx';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from './session.service';


@Injectable()
export class SessionAuthenticationService {
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  public login(username: string, password: string): Observable<string> {
    let responseSubject: Subject<string> = new Subject<string>();

    this._timetrackerApiService.post('login', {
      username: username,
      password: password
    }).subscribe((plainObject: any) => {
      this._sessionService.authenticationKey = plainObject.token || null;
      responseSubject.next(this._sessionService.authenticationKey);
    });

    return Observable.from(responseSubject);
  }

  public logout(): void {
    this._sessionService.authenticationKey = null;
  }
}