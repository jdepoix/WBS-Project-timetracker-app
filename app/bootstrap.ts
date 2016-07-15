import {HTTP_PROVIDERS} from '@angular/http';

import {ionicBootstrap} from 'ionic-angular';

import {AppComponent} from './components/app/app.component'
import {TimetrackerApiReuqestService} from './services/api/timetracker/timetracker-api-request.service';
import {SessionService} from './services/session/session.service';
import {WorkpackageService} from './services/workpackages/workpackage.service';
import {ProjectService} from './services/projects/project.service';
import {BookingService} from './services/bookings/booking.service';

ionicBootstrap(
  AppComponent, [
    HTTP_PROVIDERS,
    SessionService,
    TimetrackerApiReuqestService,
    BookingService,
    WorkpackageService,
    ProjectService
  ]);
