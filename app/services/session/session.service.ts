import {Injectable, EventEmitter} from '@angular/core';

import {SqlStorage, Storage} from 'ionic-angular/index';

import {Url} from '../../core/url/url';

import {Project} from '../../models/project/project';
import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {ProjectDeserializer} from '../../models/project/project-serializers';

/**
 * takes care of holding, saving and loading data, regarding the current session
 */
@Injectable()
export class SessionService {
  private _timetrackerApiService: TimetrackerApiReuqestService;

  // TODO remove assignments, only for testing purposes
  private _apiUrl: Url = new Url('http://localhost:8000');

  private _authenticationKey: string = '7b92d4f75aa4b149967d338d754f56101a330cf6';

  private _selectedProject: Project = {
    self: new Url('http://localhost:8000/api/projects/21/'),
    db: 'myProject'
  };

  private _storage: Storage;

  constructor() {
    // this._storage = new Storage(SqlStorage);

    // this._loadStoredVariables();
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

  set timetrackerApiService(value: TimetrackerApiReuqestService) {
    this._timetrackerApiService = value;
  }

  public get apiUrl(): Url {
    return this._apiUrl;
  }

  public set apiUrl(value: Url) {
    this._apiUrl = value;
    this._storage.set('apiUrl', this._apiUrl);
  }

  public get authenticationKey(): string {
    return this._authenticationKey;
  }

  public set authenticationKey(value: string) {
    this._authenticationKey = value;
    this._storage.set('authenticationKey', this._authenticationKey);
  }

  public get selectedProject(): Project {
    return this._selectedProject;
  }

  public set selectedProject(value: Project) {
    this._selectedProject = value;
    this._storage.setJson('selectedProject', {
      self: this._selectedProject.self.toString(),
      db: this._selectedProject.db
    });
  }

  public get subProjetUrl(): Url {
    return this._selectedProject.self;
  }

  private _loadApiUrl(): Promise<Url> {
    return new Promise<Url>((resolve) => {
      this._storage.get('apiUrl').then((apiUrl) => {
        this._apiUrl = apiUrl != null ? new Url(apiUrl) : null;
        resolve(this._apiUrl);
      });
    });
  }

  private _loadAuthenticationKey(): Promise<string> {
    return new Promise<string>((resolve) => {
      this._storage.get('authenticationKey').then((authenticationKey) => {
        this._authenticationKey = authenticationKey != null ? authenticationKey : null;
        resolve(this._authenticationKey);
      });
    });
  }

  // TODO consider using EventEmitter
  private _loadSelectedProject(): Promise<Project> {
    return new Promise<Project>((resolve) => {
      this._storage.getJson('selectedProject').then((selectedProject) => {
        this._selectedProject =
          selectedProject != null ? new ProjectDeserializer(selectedProject).deserialize() : null;
        resolve(this._selectedProject);
      });
    });
  }

  private _loadStoredVariables(): Promise<void> {
    return new Promise<void>((resolve) => {
      let variablesToLoad: number = 3;
      let variablesLoaded: number = 0;

      let checkIfLoaded: () => void = () => {
        if (++variablesLoaded >= variablesToLoad) resolve();
      };

      this._loadApiUrl().then(checkIfLoaded);
      this._loadAuthenticationKey().then(checkIfLoaded);
      this._loadSelectedProject().then(checkIfLoaded);
    });
  }
}