import {Injectable, EventEmitter} from '@angular/core';

import {Url} from '../../core/url/url';

import {Project} from '../../models/project/project';
import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';

/**
 * takes care of holding, saving and loading data, regarding the current session
 */
@Injectable()
export class SessionService {
  // TODO remove assignments, only for testing purposes
  private _apiUrl: Url;
  private _authenticationKey: string;
  private _selectedProject: Project;

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService) {
    this._timetrackerApiService.sessionService = this;
  }

  public login(username: string, password: string): EventEmitter<string> {
    let response: EventEmitter<string> = new EventEmitter<string>();

    this._timetrackerApiService.post('login', {
      username: username,
      password: password
    }).subscribe((plainObject: any) => {
      this.authenticationKey = plainObject.token || null;
      response.emit(this.authenticationKey);
    });

    return response;
  }

  public logout(): void {
    this.authenticationKey = null;
  }

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

  get selectedProject(): Project {
    return this._selectedProject;
  }

  set selectedProject(value: Project) {
    this._selectedProject = value;
  }

  get subProjetUrl(): Url {
    return this._selectedProject.self;
  }
}