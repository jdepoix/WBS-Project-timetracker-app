import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {Url} from '../../core/url/url';

import {Workpackage} from '../../models/workpackage';

import {GetOperation, UpdateOperation} from '../api/core/crud-operations';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {SessionService} from '../session/session.service';

@Injectable()
export class WorkpackageService implements GetOperation<Workpackage>, UpdateOperation<Workpackage> {
  private _endpoint: Url;

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
    this._endpoint = this._sessionService.subProjetUrl.getRelativeUrl('workpackages');
  }

  public get(): Observable<Array<Workpackage>> {
    return this._timetrackerApiService.getWithFullUrl(this._endpoint).map((elements) => {
      let workpackages: Array<Workpackage> = [];

      elements.forEach((element) => {
        workpackages.push(new Workpackage(element));
      });

      return workpackages;
    });
  }

  public update(element: Workpackage): Observable<Workpackage> {
    return undefined;
  }
}