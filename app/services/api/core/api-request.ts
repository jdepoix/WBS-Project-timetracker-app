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
   * @param useFullPath if true the path is considered as a complete URL, if false it's relative to the base path
   * returned by the getBaseUrl() method
   */
  public get(path: string, useFullPath: boolean = false): Observable<Array<Object>> {
    return this._http.get(
      useFullPath ? path : this.getUrlString(path),
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a post request to the API
   *
   * @param path
   * @param data
   * @param useFullPath if true the path is considered as a complete URL, if false it's relative to the base path
   * returned by the getBaseUrl() method
   */
  public post(path: string, data: Object, useFullPath: boolean = false): Observable<Object> {
    return this._http.post(
      useFullPath ? path : this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a patch request to the API
   *
   * @param path
   * @param data
   * @param useFullPath if true the path is considered as a complete URL, if false it's relative to the base path
   * returned by the getBaseUrl() method
   */
  public patch(path: string, data: Object, useFullPath: boolean = false): Observable<Object> {
    return this._http.patch(
      useFullPath ? path : this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a put request to the API
   *
   * @param path
   * @param data
   * @param useFullPath if true the path is considered as a complete URL, if false it's relative to the base path
   * returned by the getBaseUrl() method
   */
  public put(path: string, data: Object, useFullPath: boolean = false): Observable<Object> {
    return this._http.put(
      useFullPath ? path : this.getUrlString(path),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a delete request to the API
   *
   * @param path
   * @param useFullPath if true the path is considered as a complete URL, if false it's relative to the base path
   * returned by the getBaseUrl() method
   */
  public delete(path: string, useFullPath: boolean = false): Observable<Object> {
    return this._http.delete(
      useFullPath ? path : this.getUrlString(path),
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
