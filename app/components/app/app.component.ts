import {Component, ViewChild, Injectable, OnInit} from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Project} from "../../models/project/project";

import {ProjectService} from "../../services/projects/project.service";
import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";

import {LoginComponent} from "../login/login.component";
import {BookingOverviewComponent} from '../bookings/overview/booking-overview.component';
import {WorkpackageOverviewComponent} from '../workpackages/overview/workpackage-overview.component';

@Component({
  templateUrl: 'build/components/app/app.component.html',
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = LoginComponent;
  pages: Array<{title: string, component: any}>;
  projects: Array<Project>;
  showProjects: boolean;

  constructor(
    private _platform: Platform,
    private _menu: MenuController,
    private _authService: SessionAuthenticationService,
    private _sessionService: SessionService,
    private _projectService: ProjectService
  ) {
    this.initializeApp();
    // set our app's pages
    this.pages = [
      { title: 'Bookings', component: BookingOverviewComponent },
      { title: 'Workpackages', component: WorkpackageOverviewComponent },
    ];

    this.showProjects = false;

    if (this._authService.isAuthenticated) {
      this._loadProjects();
    }

    this._authService.onLogIn.subscribe(() => this._loadProjects());
  }

  public initializeApp() {
    this._platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // TODO find a more generic way to do this, using the variables specified in app.vairables.scss
      StatusBar.backgroundColorByHexString('#00796B');
    });
  }

  public openPage(page) {
    // close the menu when clicking a link from the menu
    this._menu.close();

    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  public toggleProjects() {
    this.showProjects = !this.showProjects;
  }

  public areProjectsShown(): boolean {
    return this.showProjects;
  }

  public selectProject(project: Project) {
    this._sessionService.selectedProject = project;
  }

  private _loadProjects() {
    this._projectService.get().subscribe((projects: Array<Project>) => {
      this.projects = projects;
    });
  }
}
