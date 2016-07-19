import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {GetOperation} from '../api/core/crud-operations';

import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';
import {Project} from '../../models/project/project';
import {ProjectDeserializer} from '../../models/project/project-serializers';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';

@Injectable()
export class ProjectService implements GetOperation<Project> {
  private _endpointPath: string;

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService) {
    this._endpointPath = 'projects';
  }

  public get(): Observable<Array<Project>> {
    return this._timetrackerApiService.get(this._endpointPath).map((plainObjects) => {
      return new RestModelListDeserializer<Project>(plainObjects, (plainObject: Object): Project => {
        return new ProjectDeserializer(plainObject).deserialize();
      }).deserialize();
    });
  }
}
