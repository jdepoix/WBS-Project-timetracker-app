import {Component} from '@angular/core';

import {ProjectService} from '../../../services/projects/project.service';
import {SessionService} from '../../../services/session/session.service';
import {SessionAuthenticationService} from '../../../services/session/session-authentication.service';
import {Url} from '../../../core/url/url';
import {Project} from '../../../models/project/project';

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html'
})
export class BookingOverviewComponent {
  public projects: Array<Project>;

  constructor(private _projectService: ProjectService, private _sessionService: SessionService, private _authenticationService: SessionAuthenticationService) {
  }

  public testLogin() {
    this._sessionService.apiUrl = new Url('http://143.93.91.93');
    this._sessionService.selectedProject = {
      self: new Url('http://143.93.91.93/api/projects/1/'),
      db: 'wbs_tool'
    };
    this._authenticationService.login('jdepoix', 'GGVxevgfKr3DnRQ6rpTox44wmLrJQTsT');
  }

  public testClick() {
    this._projectService.get().subscribe((elem: Array<Project>) => {
      this.projects = elem;
      console.log(this.projects);
    })
  }
}
