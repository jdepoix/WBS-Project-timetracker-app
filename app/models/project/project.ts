import {RestModel} from '../core/rest-model/rest-model';

/**
 * represents a Project or DbIdentifier as it is called in the Database Model.
 */
export class Project extends RestModel {
  public db: string;
}
