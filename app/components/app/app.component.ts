import {Component, ViewChild} from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {BookingOverviewComponent} from '../booking/overview/booking-overview.component';
import {WorkpackageOverviewComponent} from '../workpackage/overview/workpackage-overview.component';


@Component({
  templateUrl: 'build/components/app/app.component.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = BookingOverviewComponent;
  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Bookings', component: BookingOverviewComponent },
      { title: 'Workpackages', component: WorkpackageOverviewComponent }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
