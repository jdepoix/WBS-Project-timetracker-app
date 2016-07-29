import {RestModel} from '../core/rest-model/rest-model';
import {Url} from '../../core/url/url';
import {Updateable, Createable} from '../core/rest-model/model-operations';

export class Booking extends RestModel implements Updateable, Createable{
  public effort: number;
  public description: string;
  public date: Date;
  public workpackage: Url;

  getUpdateRequestData(): Object {
    return {
      efhefort: this.effort,
      description: this.description,
      date: this.date,
      workpackage: this.workpackage
    };
  }

  getCreateRequestData(): Object {
    return {
      effort: this.effort,
      description: this.description,
      date: this.date,
      workpackage: this.workpackage
    };
  }
}