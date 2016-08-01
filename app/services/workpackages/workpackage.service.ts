import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {Url} from '../../core/url/url';

import {Workpackage} from '../../models/workpackage/workpackage';

import {GetOperation, UpdateOperation} from '../api/core/crud-operations';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from '../session/session.service';
import {WorkpackageDeserializer} from '../../models/workpackage/workpackage-serializers';
import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';

/**
 * takes care of handling requests to the Workpackage API
 */
@Injectable()
export class WorkpackageService implements GetOperation<Workpackage>, UpdateOperation<Workpackage> {
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  public get(isToplevelWorkpackage?: boolean): Observable<Array<Workpackage>> {
    let url: Url = this._endpoint;

    if (isToplevelWorkpackage != null) {
      url = url.clone().addParam('toplevel_wp', isToplevelWorkpackage);
    }

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

  private get _endpoint(): Url {
    return this._sessionService.subProjetUrl.getRelativeUrl('workpackages');
  }
}
