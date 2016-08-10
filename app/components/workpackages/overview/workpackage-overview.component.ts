import {Component} from '@angular/core';

import {NavController} from 'ionic-angular/index';

import {Workpackage} from '../../../models/workpackage/workpackage';

import {WorkpackageService} from '../../../services/workpackages/workpackage.service';
import {SessionService} from '../../../services/session/session.service';

import {WorkpackageDetailComponent} from '../detail/workpackage-detail.component';
import {TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * renders a list of all workpackages belonging to a user
 */
@Component({
  templateUrl: 'build/components/workpackages/overview/workpackage-overview.component.html',
  pipes: [TranslatePipe]
})
export class WorkpackageOverviewComponent {
  private _workpackages: Array<Workpackage>;

  constructor(
    private _workpackageService: WorkpackageService,
    private _navController: NavController,
    private _sessionService: SessionService
  ) {
    this._loadWorkpackages();

    this._sessionService.onProjectSelected.subscribe(() => this._loadWorkpackages());
  }

  /**
   * load all workpackages
   *
   * @private
   */
  private _loadWorkpackages(): void {
    this._workpackageService.get(false).subscribe((workpackages: Array<Workpackage>) => {
      this._workpackages = workpackages;
    });
  }

  /**
   * opens the WorkpackageDetailComponent and parses a workpackage whoms details should be shown
   *
   * @param workpackage
   */
  public openWorkpackageDetailComponent(workpackage: Workpackage): void {
    this._navController.push(WorkpackageDetailComponent, {
      workpackage: workpackage
    });
  }
}
