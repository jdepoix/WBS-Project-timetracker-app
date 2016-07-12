import 'rxjs/add/operator/toPromise';

import {Http, Response, Headers} from '@angular/http';

import {Url} from '../../../core/url/url';


/**
 * ABC which wraps the http module for actions specific to one API. Extend this and overwrite getApiBaseUrl() to make
 * this specific for a API module.
 */
export abstract class ApiRequest {
  constructor(private _http: Http) {
  }

  /**
   * performs a get request to the API
   *
   * @param path
   * @returns {Promise<Response>}
   */
  public get(path: String): Promise<Response> {
    return this._http.get(
      this.getUrlString(path),
      this.getOptions()
    ).toPromise();
  }

  /**
   * performs a post request to the API
   *
   * @param path
   * @param data
   * @returns {Promise<Response>}
   */
  public post(path: String, data: Object): Promise<Response> {
    return this._http.post(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).toPromise();
  }

  /**
   * performs a patch request to the API
   *
   * @param path
   * @param data
   * @returns {Promise<Response>}
   */
  public patch(path: String, data: Object): Promise<Response> {
    return this._http.patch(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).toPromise();
  }

  /**
   * performs a put request to the API
   *
   * @param path
   * @param data
   * @returns {Promise<Response>}
   */
  public put(path: String, data: Object): Promise<Response> {
    return this._http.put(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).toPromise();
  }

  /**
   * performs a delete request to the API
   *
   * @param path
   * @returns {Promise<Response>}
   */
  public delete(path: String): Promise<Response> {
    return this._http.delete(
      this.getUrlString(path),
      this.getOptions()
    ).toPromise();
  }

  /**
   * generates a string url for the given path
   *
   * @param path
   * @returns {String}
   */
  public getUrlString(path: String): String {
    return new Url(this.getBaseUrl(), path).toString();
  }

  /**
   * gets the headers
   *
   * @returns {Headers}
   */
  public getHeaders(): Headers {
    return new Headers();
  }

  /**
   * gets the options object used for the requests
   *
   * @returns {{headers: Headers}}
   */
  public getOptions(): Object {
    return {
      headers: this.getHeaders()
    }
  }

  /**
   * returns the apis base url
   */
  public abstract getBaseUrl(): Url;
}
