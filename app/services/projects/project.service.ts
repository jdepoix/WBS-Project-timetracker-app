import {Injectable} from '@angular/core';

import {SessionService} from '../session/session.service';
import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';

@Injectable()
class WorkpackageService {
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }
}