import {HTTP_PROVIDERS, Http} from '@angular/http';

import {ionicBootstrap} from 'ionic-angular';

import {AppComponent} from './components/app/app.component'
import {TimetrackerApiReuqestService} from './services/api/timetracker/timetracker-api-request.service';
import {SessionService} from './services/session/session.service';
import {WorkpackageService} from './services/workpackages/workpackage.service';
import {ProjectService} from './services/projects/project.service';
import {BookingService} from './services/bookings/booking.service';
import {SessionAuthenticationService} from './services/session/session-authentication.service';
import {BookingSessionService} from './services/bookings/booking-session.service';
import {TranslateLoader, TranslateStaticLoader, TranslateService} from "ng2-translate/ng2-translate";
import {provide} from "@angular/core";

ionicBootstrap(
  AppComponent, [
      HTTP_PROVIDERS,
      provide(TranslateLoader, {
          useFactory: (http:Http) => new TranslateStaticLoader(http, 'assets/translations', '.json'),
          deps: [Http]
      }),
      SessionService,
      TimetrackerApiReuqestService,
      SessionAuthenticationService,
      BookingService,
      WorkpackageService,
      ProjectService,
      BookingSessionService,
      TranslateService
  ]);
