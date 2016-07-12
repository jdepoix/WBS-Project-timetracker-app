/**
 * simple wrapper for url strings to take care of beginning and trailing slashes
 */
export class Url {
  private _stringUrl: string;

  /**
   * @param stringUrl
   */
  constructor(stringUrl: string) {
    this._stringUrl = this._formatUrlString(stringUrl);
  }

  /**
   * creates a new Url object, from a path relative to this Url
   *
   * @param path
   * @returns {Url}
   */
  public getRelativeUrl(path: string): Url {
    return new Url(this._stringUrl + this._formatUrlString(path));
  }

  public toString(): string {
    return this._stringUrl;
  }

  /**
   * removes the slashes at the beginning of the given string
   *
   * @param stringUrl
   * @returns {string}
   * @private
   */
  private _removeBeginningSlashes(stringUrl: string): string {
    return stringUrl.replace(/^\/+/g, '');
  }

  /**
   * adds a trailing slash to the url if there is none
   *
   * @param stringUrl
   * @returns {string}
   * @private
   */
  private _addTrailingSlashes(stringUrl: string): string {
    return stringUrl.charAt(stringUrl.length - 1) == '/' ? stringUrl : stringUrl + '/';
  }

  /**
   * formats the given url string
   *
   * @param stringUrl
   * @returns {String}
   * @private
   */
  private _formatUrlString(stringUrl: string): string {
    return this._addTrailingSlashes(this._removeBeginningSlashes(stringUrl));
  }
}