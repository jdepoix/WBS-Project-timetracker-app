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
  /**
   * the URL to the Timetracker REST API
   */
  private _apiUrl: Url;

  /**
   * the key for API request authentication
   */
  private _authenticationKey: string;

  /**
   * the currently selected project
   */
  private _selectedProject: Project;

  /**
   * handler to the storage object
   */
  private _storage: Storage;

  private _onSessionLoadedSubject: Subject<void> = new Subject<void>();
  /**
   * Observable which emits when the session is loaded from memory
   */
  public onSessionLoaded: Observable<void> = Observable.from(this._onSessionLoadedSubject);

  private _onProjectSelectedSubject: Subject<Project> = new Subject<Project>();
  /**
   * Observable which emits when a Project is selected
   */
  public onProjectSelected: Observable<Project> = Observable.from(this._onProjectSelectedSubject);

  constructor() {
    this._storage = new Storage(SqlStorage);

    this._loadStoredVariables().then(() => this._onSessionLoadedSubject.next(null));
  }

  public get apiUrl(): Url {
    return this._apiUrl;
  }

  /**
   * sets the api URL and saves it to the local Storage
   * @param value
   */
  public set apiUrl(value: Url) {
    this._apiUrl = value;
    this._storage.set('apiUrl', this._apiUrl);
  }

  public get authenticationKey(): string {
    return this._authenticationKey;
  }

  /**
   * sets the authentication key and saves it to the local Storage
   * @param value
   */
  public set authenticationKey(value: string) {
    this._authenticationKey = value;
    this._storage.set('authenticationKey', this._authenticationKey);
  }

  public get selectedProject(): Project {
    return this._selectedProject;
  }

  /**
   * sets the selected project and saves it to the local Storage
   * @param value
   */
  public set selectedProject(value: Project) {
    this._selectedProject = value;
    this._storage.setJson(
      'selectedProject',
      this._selectedProject != null ? {
        self: this._selectedProject.self.toString(),
        db: this._selectedProject.db
      } : null
    );

    if (value != null) {
      this._onProjectSelectedSubject.next(this._selectedProject);
    }
  }

  /**
   * returns an URL relative to the currently selected project
   *
   * @returns {Url}
   */
  public get subProjetUrl(): Url {
    return this._selectedProject.self;
  }

  /**
   * loads the API Url from the Local Storage
   *
   * @returns {Promise<Url>}
   * @private
   */
  private _loadApiUrl(): Promise<Url> {
    return new Promise<Url>((resolve) => {
      this._storage.get('apiUrl').then((apiUrl) => {
        this._apiUrl = apiUrl != null ? new Url(apiUrl) : null;
        resolve(this._apiUrl);
      }).catch(() => {
        this._apiUrl = null;
        resolve(this._apiUrl);
      });
    });
  }

  /**
   * loads the authenticaion key from the Local Storage
   *
   * @returns {Promise<string>}
   * @private
   */
  private _loadAuthenticationKey(): Promise<string> {
    return new Promise<string>((resolve) => {
      this._storage.get('authenticationKey').then((authenticationKey) => {
        this._authenticationKey = authenticationKey != null ? authenticationKey : null;
        resolve(this._authenticationKey);
      }).catch(() => {
        this._authenticationKey = null;
        resolve(this._authenticationKey);
      });
    });
  }

  /**
   * loads the selected project from the Local Storage
   *
   * @returns {Promise<Project>}
   * @private
   */
  private _loadSelectedProject(): Promise<Project> {
    return new Promise<Project>((resolve) => {
      this._storage.getJson('selectedProject').then((selectedProject) => {
        this._selectedProject =
          selectedProject != null ? new ProjectDeserializer(selectedProject).deserialize() : null;
        resolve(this._selectedProject);
      }).catch(() => {
        this._selectedProject = null;
        resolve(this._selectedProject);
      });
    });
  }

  /**
   * loads all data from the Local Storage
   *
   * @returns {Promise<void>} resolves when all data has been loaded
   * @private
   */
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