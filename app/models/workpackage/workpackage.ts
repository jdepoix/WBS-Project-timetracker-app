import {Url} from '../../core/url/url';

import {RestModel} from '../core/rest-model/rest-model';
import {Updateable} from '../core/rest-model/model-operations';

/**
 * represents a Workpackage
 */
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

  public getUpdateRequestData(): Object {
    return {
      etc: this.etc
    };
  }

  /**
   * returns the RessourceUrl of the Project, this workpackage belongs to
   *
   * @returns {Url}
   */
  public getProjectUrl(): Url {
    return new Url(this.self.stringUrl.split('workpackages')[0]);
  }
}