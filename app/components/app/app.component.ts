import {Component, ViewChild, Injectable} from '@angular/core';

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
  shownProjects: boolean;
  selectedProject: string;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private authService: SessionAuthenticationService,
    private sessionService: SessionService,
    private projectService: ProjectService
  ) {
    this.initializeApp();
    // set our app's pages
    this.pages = [
      { title: 'Bookings', component: BookingOverviewComponent },
      { title: 'Workpackages', component: WorkpackageOverviewComponent },
      { title: 'Logout', component: LoginComponent}
    ];

    this.shownProjects = false;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // TODO find a more generic way to do this, using the variables specified in app.vairables.scss
      StatusBar.backgroundColorByHexString('#00796B');
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    if(page.title == 'Logout'){
      this.authService.logout();
      this.selectedProject = '';
      this.shownProjects = false;
      this.projects = null;
    }

    if(this.sessionService.authenticationKey != '') {
      this.projectService.get().subscribe((tmp: Array<Project>) => {
        this.projects = tmp;
      });
    }

    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  toggleProjects(){
    this.shownProjects = !this.shownProjects;
  }

  isProjectsShown(): boolean{
    return this.shownProjects;
  }

  selectProject(project: Project){
    if(this.selectedProject == project.db){
      this.selectedProject = '';
      this.sessionService.selectedProject = null;
    }
    else {
      this.selectedProject = project.db;
      this.sessionService.selectedProject = project;
    }
  }

  getProjectSelected(): string{
    return this.selectedProject;
  }
}
