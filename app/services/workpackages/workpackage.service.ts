import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {Url} from '../../core/url/url';

import {Workpackage} from '../../models/workpackage/workpackage';

import {GetOperation, UpdateOperation} from '../api/core/crud-operations';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from '../session/session.service';
import {WorkpackageDeserializer} from '../../models/workpackage/workpackage-serializers';
import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';

@Injectable()
export class WorkpackageService implements GetOperation<Workpackage>, UpdateOperation<Workpackage> {
  private _endpoint: Url;

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
    this._endpoint = this._sessionService.subProjetUrl.getRelativeUrl('workpackages');
  }

  public get(params?: Map<string, Object>): Observable<Array<Workpackage>> {
    let url: Url = params == null ? this._endpoint : this._endpoint.clone().addParams(params);

    return this._timetrackerApiService.getWithFullUrl(url).map((plainObjects) => {
      return new RestModelListDeserializer<Workpackage>(plainObjects, (plainObject: Object): Workpackage => {
        return new WorkpackageDeserializer(plainObject).deserialize();
      }).deserialize();
    });
  }

  public update(element: Workpackage): Observable<Workpackage> {
    return this._timetrackerApiService.patchWithFullUrl(element.self, element.getUpdateRequestData())
      .map((plainObject) => {
        return new WorkpackageDeserializer(plainObject).deserialize();
      });
  }
}
