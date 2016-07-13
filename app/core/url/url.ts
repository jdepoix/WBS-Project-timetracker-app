/**
 * simple wrapper for url strings to take care of beginning and trailing slashes
 */
export class Url {
  private _stringUrl: string;
  private _params: Map<string, Object> = new Map<string, Object>();

  /**
   * @param stringUrl
   * @param params url params
   */
  constructor(stringUrl: string, params?: Map<string, Object>) {
    this._stringUrl = this._formatUrlString(stringUrl);
    if (params != null) {
      this.addParams(params);
    }
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
    return this._stringUrl + this._paramsToString();
  }

  /**
   * add a set of url params
   *
   * @param params
   */
  public addParams(params: Map<string, Object>): Url {
    params.forEach((item: Object, key: string) => {
      this.addParam(key, item);
    });

    return this;
  }

  /**
   * add one url param
   *
   * @param key
   * @param value
   */
  public addParam(key: string, value: Object): Url {
    this._params.set(key, value);

    return this;
  }

  /**
   * converts URL params to string
   * @private
   */
  private _paramsToString(): string {
    if (this._params.size) {
      let paramString: string = '?';

      this._params.forEach((item: Object, key: string) => {
        paramString += `${key}=${item.toString()}&`
      });

      return paramString.slice(0, -1);
    }

    return '';
  }

  public clone(): Url {
    return new Url(this.toString(), this._params);
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
   * removes params from a url
   *
   * @param stringUrl
   * @private
   */
  private _removeParams(stringUrl: string): string {
    return stringUrl.split('?')[0];
  }

  /**
   * formats the given url string
   *
   * @param stringUrl
   * @returns {String}
   * @private
   */
  private _formatUrlString(stringUrl: string): string {
    return this._addTrailingSlashes(this._removeBeginningSlashes(this._removeParams(stringUrl)));
  }
}