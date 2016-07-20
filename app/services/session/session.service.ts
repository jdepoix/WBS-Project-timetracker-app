import {Injectable} from '@angular/core';

import {SqlStorage, Storage} from 'ionic-angular/index';

import {Url} from '../../core/url/url';

import {Project} from '../../models/project/project';
import {ProjectDeserializer} from '../../models/project/project-serializers';
import {Observable, Subject} from 'rxjs/Rx';

/**
 * takes care of holding, saving and loading data, regarding the current session
 */
@Injectable()
export class SessionService {
  private _apiUrl: Url;

  private _authenticationKey: string;

  private _selectedProject: Project;

  private _storage: Storage;

  private _onSessionLoadedSubject: Subject<void> = new Subject<void>();
  public onSessionLoaded: Observable<void> = Observable.from(this._onSessionLoadedSubject);

  private _onProjectSelectedSubject: Subject<Project> = new Subject<Project>();
  public onProjectSelected: Observable<Project> = Observable.from(this._onProjectSelectedSubject);

  constructor() {
    this._storage = new Storage(SqlStorage);

    this._loadStoredVariables().then(() => this._onSessionLoadedSubject.next(null));
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
    this._storage.setJson(
      'selectedProject',
      this._selectedProject != null ? {
        self: this._selectedProject.self.toString(),
        db: this._selectedProject.db
      } : null
    );
    this._onProjectSelectedSubject.next(this._selectedProject);
  }

  public get subProjetUrl(): Url {
    return this._selectedProject.self;
  }

  private _loadApiUrl(): Promise<Url> {
    return new Promise<Url>((resolve) => {
      this._storage.get('apiUrl').then((apiUrl) => {
        this._apiUrl = apiUrl != null ? new Url(apiUrl) : null;
        resolve(this._apiUrl);
      }).catch(() => {
        this._apiUrl = null;
      });
    });
  }

  private _loadAuthenticationKey(): Promise<string> {
    return new Promise<string>((resolve) => {
      this._storage.get('authenticationKey').then((authenticationKey) => {
        this._authenticationKey = authenticationKey != null ? authenticationKey : null;
        resolve(this._authenticationKey);
      }).catch(() => {
        this._authenticationKey = null;
      });
    });
  }

  private _loadSelectedProject(): Promise<Project> {
    return new Promise<Project>((resolve) => {
      this._storage.getJson('selectedProject').then((selectedProject) => {
        this._selectedProject =
          selectedProject != null ? new ProjectDeserializer(selectedProject).deserialize() : null;
        resolve(this._selectedProject);
      }).catch(() => {
        this._selectedProject = null;
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