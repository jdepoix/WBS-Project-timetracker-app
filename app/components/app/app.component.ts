import {Component, ViewChild} from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Project} from "../../models/project/project";

import {ProjectService} from "../../services/projects/project.service";
import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";

import {LoginComponent} from "../login/login.component";
import {BookingOverviewComponent} from '../bookings/overview/booking-overview.component';
import {WorkpackageOverviewComponent} from '../workpackages/overview/workpackage-overview.component';

import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {Translations} from "../../multilanguage/translations";

/**
 * Entry point for the App. Holds the Menu and handles which View should be rendered
 */
@Component({
  templateUrl: 'build/components/app/app.component.html',
  pipes: [TranslatePipe]
})

export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = BookingOverviewComponent;
  pages: Array<{title: string, component: any}>;
  projects: Array<Project> = [];
  showProjects: boolean;
  private _translations: typeof Translations = Translations;

  constructor(
    private _platform: Platform,
    private _menu: MenuController,
    private _authService: SessionAuthenticationService,
    private _sessionService: SessionService,
    private _projectService: ProjectService,
    private _translate: TranslateService
  ) {
    this.initializeApp();

    this.pages = [
      { title: _translate.instant(this._translations.BOOKINGS) , component: BookingOverviewComponent },
      { title: _translate.instant(this._translations.WORKPACKAGES), component: WorkpackageOverviewComponent },
    ];

    this.showProjects = false;

    this._authService.onLogIn.subscribe(() => {
      this._loadProjects();
      this.openPage(this.rootPage);
    });

    this._authService.onLogOut.subscribe(() => {
      this.projects = [];
      this.openPage(LoginComponent);
    });

    this._sessionService.onSessionLoaded.subscribe(() => {
      if (this._authService.isAuthenticated) {
        this._loadProjects();
        this.openPage(this.rootPage);
      } else {
        this.openPage(LoginComponent);
      }
    });

    this._translateConfig();
  }

  public initializeApp() {
    this._platform.ready().then(() => {
      StatusBar.styleDefault();

      if (this._platform.is('android')) {
        // TODO find a more generic way to do this, using the variables specified in app.vairables.scss
        StatusBar.backgroundColorByHexString('#00796B');
      }
    });
  }

  /**
   * takes a Component and renders it as the MainView
   *
   * @param component Component to render
   */
  public openPage(component: any) {
    if (this._menu.isOpen()) this._menu.close();

    this.nav.setRoot(component);
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

      if (this._sessionService.selectedProject == null) {
        this._sessionService.selectedProject = this.projects[0];
      }
    });
  }

  private _translateConfig() {
    let userLang = navigator.language.split('-')[0];
    userLang = /(de|en)/.test(userLang) ? userLang : 'en';

    this._translate.setDefaultLang('en');

    this._translate.use(userLang);
  }
}

