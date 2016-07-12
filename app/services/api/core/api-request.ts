import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'

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
   */
  public get(path: string): Observable<Array<Object>> {
    return this._http.get(
      this.getUrlString(path),
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a post request to the API
   *
   * @param path
   * @param data
   */
  public post(path: string, data: Object): Observable<Object> {
    return this._http.post(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a patch request to the API
   *
   * @param path
   * @param data
   */
  public patch(path: string, data: Object): Observable<Object> {
    return this._http.patch(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a put request to the API
   *
   * @param path
   * @param data
   */
  public put(path: string, data: Object): Observable<Object> {
    return this._http.put(
      this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a delete request to the API
   *
   * @param path
   */
  public delete(path: string): Observable<Object> {
    return this._http.delete(
      this.getUrlString(path),
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * generates a string url for the given path
   *
   * @param path
   * @returns {String}
   */
  public getUrlString(path: string): string {
    return this.getBaseUrl().getRelativeUrl(path).toString();
  }

  /**
   * gets the headers
   *
   * @returns {Headers}
   */
  public getHeaders(): Headers {
    return new Headers({
      'Content-Type': 'application/json'
    });
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
   * brings the responses in the desired format
   *
   * @param response
   * @returns {any|{}[]}
   */
  public formatResponse(response: Response): Array<Object> {
    return response.json() || [{}]
  }

  /**
   * returns the apis base url
   */
  public abstract getBaseUrl(): Url;
}
