import {Component} from '@angular/core';

import {NavController} from 'ionic-angular/index';

import {WorkpackageService} from '../../../services/workpackages/workpackage.service';

import {Workpackage} from '../../../models/workpackage/workpackage';
import {WorkpackageDetailComponent} from '../detail/workpackage-detail.component';

@Component({
  templateUrl: 'build/components/workpackages/overview/workpackage-overview.component.html'
})
export class WorkpackageOverviewComponent {
  private _workpackages: Array<Workpackage>;

  constructor(private _workpackageService: WorkpackageService, private _navController: NavController) {
    this._workpackageService.get(false).subscribe((workpackages: Array<Workpackage>) => {
      this._workpackages = workpackages;
    });
  }

  public openWorkpackageDetailComponent(workpackage: Workpackage): void {
    this._navController.push(WorkpackageDetailComponent, {
      workpackage: workpackage
    });
  }
}
