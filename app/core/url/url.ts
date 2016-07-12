/**
 * simple wrapper for url strings to take care of beginning and trailing slashes
 */
export class Url {
  private _stringUrl: String;

  /**
   * @param stringUrl
   */
  constructor(stringUrl: String) {
    this._stringUrl = this._formatUrlString(stringUrl);
  }

  /**
   * creates a new Url object from a given base url and path relative to the base Url
   *
   * @param baseUrl
   * @param path
   */
  constructor(baseUrl: Url, path: String) {
    this(baseUrl.toString() + new Url(path).toString());
  }

  public toString(): String {
    return this._stringUrl;
  }

  /**
   * removes the slashes at the beginning of the given string
   *
   * @param stringUrl
   * @returns {string}
   * @private
   */
  private _removeBeginningSlashes(stringUrl: String): String {
    return stringUrl.replace(/^\/+/g, '');
  }

  /**
   * adds a trailing slash to the url if there is none
   *
   * @param stringUrl
   * @returns {string}
   * @private
   */
  private _addTrailingSlashes(stringUrl: String): String {
    return stringUrl.charAt(stringUrl.length - 1) == '/' ? stringUrl : stringUrl + '/';
  }

  /**
   * formats the given url string
   *
   * @param stringUrl
   * @returns {String}
   * @private
   */
  private _formatUrlString(stringUrl: String): String {
    return this._addTrailingSlashes(this._removeBeginningSlashes(stringUrl));
  }
}