import moment = require('moment');
import Moment = moment.Moment;

import {RestModel} from '../core/rest-model/rest-model';
import {Updateable, Createable} from '../core/rest-model/model-operations';

import {Url} from '../../core/url/url';
import {Workpackage} from '../workpackage/workpackage';

/**
 * represents a Booking or a WorkEffort as it is called in the Database Model
 */
export class Booking extends RestModel implements Updateable, Createable{
  public effort: number;
  public description: string;
  public date: Moment;
  public workpackage: Workpackage;

  public getUpdateRequestData(): Object {
    return this._getRelevantData();
  }

  public getCreateRequestData(): Object {
    return this._getRelevantData();
  }

  private _getRelevantData(): Object {
    return {
      workpackage: this.workpackage.self.toString(),
      date: this.date.format('YYYY-MM-DD'),
      effort: this.effort,
      description: this.description
    }
  }
}

/**
 * represents a BookingSession
 */
export class BookingSession extends RestModel implements Createable {
  /**
   * unix timestamp of the start time
   */
  public startTime: number;
  public workpackage: Workpackage;

  public getProjectUrl(): Url {
    return this.workpackage.getProjectUrl();
  }

  public getCreateRequestData(): Object {
    return {
      workpackage: this.workpackage.self.toString()
    }
  }
}