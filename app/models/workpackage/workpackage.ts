import {RestModel} from '../core/rest-model/rest-model';
import {Updateable} from '../core/rest-model/model-operations';

export class Workpackage extends RestModel implements Updateable {
  public stringId: string;
  public name: string;
  public description: string;
  public isToplevelWp: boolean;
  public isInactive: boolean;
  public etc: number;
  public bac: number;
  public ac: number;
  public ev: number;
  public eac: number;
  public cpi: number;

  getUpdateRequestData(): Object {
    return {
      etc: this.etc
    };
  }
}