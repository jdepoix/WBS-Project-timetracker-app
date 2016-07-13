import {RestModel} from '../core/rest-model/rest-model';
import {Url} from '../../core/url/url';
import {Updateable, Createable} from '../core/rest-model/model-operations';

export class Booking extends RestModel implements Updateable, Createable{
  public effort: number;
  public description: string;
  public date: Date;
  public workpackage: Url;

  getUpdateRequestData(): Object {
    // TODO
    return undefined;
  }

  getCreateRequestData(): Object {
    // TODO
    return undefined;
  }
}