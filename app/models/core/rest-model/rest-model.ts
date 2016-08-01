import {Url} from '../../../core/url/url';

/**
 * Base class for all Models used by an REST API
 */
export abstract class RestModel {
  /**
   * resource URL identifying itself
   */
  public self: Url;

  public equals(other: Object): boolean {
    if (!(other instanceof RestModel)) {
      return false;
    }

    return this.self.equals((<RestModel> other).self);
  }
}
