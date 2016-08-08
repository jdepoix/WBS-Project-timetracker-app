import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular/index';

import {Workpackage} from '../../../models/workpackage/workpackage';

import {WorkpackageService} from '../../../services/workpackages/workpackage.service';
import {SessionService} from '../../../services/session/session.service';

import {WorkpackageDetailComponent} from '../detail/workpackage-detail.component';

/**
 * describes the context in which the WorkpackageOverviewComponent is used
 */
export enum WorkpackageOverviewContext {
  WORKPAKAGE_OVERVIEW,
  BOOKING_WORKPACKAGE_SELECTION
}

/**
 * renders a list of all workpackages belonging to a user
 */
@Component({
  templateUrl: 'build/components/workpackages/overview/workpackage-overview.component.html'
})
export class WorkpackageOverviewComponent {
  private _workpackages: Array<Workpackage>;

  /**
   * describes the context in which this component is used, to be rendered accordingly
   */
  private _context: WorkpackageOverviewContext;

  constructor(
    navParams: NavParams,
    private _workpackageService: WorkpackageService,
    private _navController: NavController,
    private _sessionService: SessionService
  ) {
    this._context = navParams.get('context') || WorkpackageOverviewContext.WORKPAKAGE_OVERVIEW;

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
  public selectWorkpackage(workpackage: Workpackage): void {
    if (this._context === WorkpackageOverviewContext.WORKPAKAGE_OVERVIEW) {
      this._navController.push(WorkpackageDetailComponent, {
        workpackage: workpackage
      });
    } else {
      // TODO
    }
  }
}
