import {Injectable} from '@angular/core';

import {SessionService} from '../session/session.service';


/**
 * takes care of handling HTTP requests to the timetracker backend. It set's authentication and headers.
 */
@Injectable()
export class TimetrackerApiReuqest {
    constructor(private sessionService: SessionService) {
    }
}