import {Injectable} from '@angular/core';

import {Url} from '../../core/url/url';

import {Project} from '../../models/project/project';

/**
 * takes care of holding, saving and loading data, regarding the current session
 */
@Injectable()
export class SessionService {
  // TODO remove assignments, only for testing purposes
  private _apiUrl: Url = new Url('http://localhost:8000');
  private _authenticationKey: string = '7b92d4f75aa4b149967d338d754f56101a330cf6';
  private _selectedProject: Project = {
    self: new Url('http://localhost:8000/api/projects/21/'),
    db: 'myProject'
  };

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