import {RestModel} from '../core/rest-model/rest-model';
import {Updateable, Createable} from '../core/rest-model/model-operations';

import {Workpackage} from '../workpackage/workpackage';

export class Booking extends RestModel implements Updateable, Createable{
  public effort: number;
  public description: string;
  public date: Date;
  public workpackage: Workpackage;

  public getUpdateRequestData(): Object {
    // TODO
    return undefined;
  }

  public getCreateRequestData(): Object {
    // TODO
    return undefined;
  }
}

export class BookingSession extends RestModel implements Createable {
  /**
   * unix timestamp of the start time
   */
  public startTime: number;
  public workpackage: Workpackage;

  public getCreateRequestData(): Object {
    return undefined;
  }
}