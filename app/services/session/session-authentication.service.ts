import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs/Rx';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from './session.service';


@Injectable()
export class SessionAuthenticationService {
  private _onLogInSubject: Subject<void> = new Subject<void>();
  private _onLogOutSubject: Subject<void> = new Subject<void>();

  public onLogIn: Observable<void> = Observable.from(this._onLogInSubject);
  public onLogOut: Observable<void> = Observable.from(this._onLogOutSubject);

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  public login(username: string, password: string): Observable<string> {
    let responseSubject: Subject<string> = new Subject<string>();

    this._timetrackerApiService.post('login', {
      username: username,
      password: password
    }).subscribe((plainObject: any) => {
      this._sessionService.authenticationKey = plainObject.token || null;
      this._onLogInSubject.next(null);
      responseSubject.next(this._sessionService.authenticationKey);
    }, () => {
      this._sessionService.authenticationKey = null;
      responseSubject.next(null);
    });

    return Observable.from(responseSubject);
  }

  public logout(): void {
    this._sessionService.authenticationKey = null;
    this._sessionService.apiUrl = null;
    this._sessionService.selectedProject = null;

    this._onLogOutSubject.next(null);
  }

  public get isAuthenticated(): boolean {
    return this._sessionService.authenticationKey != null && this._sessionService.authenticationKey != '';
  }
}