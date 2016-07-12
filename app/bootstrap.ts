import {HTTP_PROVIDERS} from '@angular/http';

import {ionicBootstrap} from 'ionic-angular';

import {AppComponent} from './components/app/app.component'

ionicBootstrap(
    AppComponent, [
        HTTP_PROVIDERS
    ]);
