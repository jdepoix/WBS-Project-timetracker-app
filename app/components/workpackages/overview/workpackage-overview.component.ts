import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular/index';

import {FilterListByStringPipe} from '../../../pipes/filter-list-by-string.pipe';

import {Workpackage} from '../../../models/workpackage/workpackage';

import {WorkpackageService} from '../../../services/workpackages/workpackage.service';
import {SessionService} from '../../../services/session/session.service';

import {WorkpackageDetailComponent} from '../detail/workpackage-detail.component';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Translations} from "../../../multilanguage/translations";
import {CreateBookingComponent} from '../../bookings/create/create-booking.component';

/**
 * describes the context in which the WorkpackageOverviewComponent is used
 */
export enum WorkpackageOverviewContext {
  WORKPAKAGE_OVERVIEW,
  BOOKING_WORKPACKAGE_SELECTION
}

/**
 * renders a list of all workpackages belonging to a user, which are not finished yet
 */
@Component({
  templateUrl: 'build/components/workpackages/overview/workpackage-overview.component.html',
  pipes: [FilterListByStringPipe, TranslatePipe]
})
export class WorkpackageOverviewComponent {
  /**
   * list of all relevant workpackages
   */
  private _workpackages: Array<Workpackage>;
  private _translations: typeof Translations = Translations;

  /**
   * the string which the list of workpackages is filtered by
   */
  private _workpackagesSearchString: string = '';

  /**
   * reference to the WorkpackageOverviewContext enum, to be able to access it in the template
   *
   * @type {WorkpackageOverviewContext}
   */
  private _contextEnum: typeof WorkpackageOverviewContext = WorkpackageOverviewContext;

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
      this._workpackages = workpackages.filter((workpackage: Workpackage): boolean => {
        return workpackage.etc > 0.0;
      });
    });
  }

  /**
   * opens the WorkpackageDetailComponent and parses a workpackage whoms details should be shown
   *
   * @param workpackage
   */
  public selectWorkpackage(workpackage: Workpackage): void {
    this._navController.push(
      (this._context === WorkpackageOverviewContext.WORKPAKAGE_OVERVIEW)
        ? WorkpackageDetailComponent : CreateBookingComponent, {
      workpackage: workpackage
    });
  }
}
