import {Injectable} from '@angular/core';

import {Url} from '../../core/url/url';

import {SessionService} from '../session/session.service';
import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';

@Injectable()
export class ProjectService {
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }
}