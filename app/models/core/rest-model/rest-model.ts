import {Url} from '../../../core/url/url';

export abstract class RestModel {
  public self: Url;

  public equals(other: Object): boolean {
    if (!(other instanceof RestModel)) {
      return false;
    }

    return this.self.equals((<RestModel> other).self);
  }
}
