import {Http, Response, Headers} from '@angular/http';

import {Observable, Subject} from 'rxjs/Rx';
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
    return this.getWithFullUrl(this.getPathUrl(path));
  }

  public getWithFullUrl(url: Url): Observable<Array<Object>> {
    return this._http.get(
      url.toString(),
      this.getOptions()
    ).map(this.formatArrayResponse);
  }

  /**
   * performs a post request to the API
   *
   * @param path
   * @param data
   */
  public post(path: string, data: Object): Observable<Object> {
    return this.postWithFullUrl(this.getPathUrl(path), data);
  }

  public postWithFullUrl(url: Url, data: Object): Observable<Object> {
    return this._http.post(
      url.toString(),
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
    return this.patchWithFullUrl(this.getPathUrl(path), data);
  }

  public patchWithFullUrl(url: Url, data: Object): Observable<Object> {
    return this._http.patch(
      url.toString(),
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
    return this.putWithFullUrl(this.getPathUrl(path), data);
  }

  public putWithFullUrl(url: Url, data: Object): Observable<Object> {
    return this._http.put(
      url.toString(),
      data,
      this.getOptions()
    ).map(this.formatResponse);
  }

  /**
   * performs a delete request to the API
   *
   * @param path
   */
  public delete(path: string): Observable<Response> {
    return this.deleteWithFullUrl(this.getPathUrl(path));
  }

  public deleteWithFullUrl(url: Url): Observable<Response> {
    return this._http.delete(
      url.toString(),
      this.getOptions()
    );
  }

  /**
   * generates a string url for the given path
   *
   * @param path
   * @returns {String}
   */
  public getPathUrl(path: string): Url {
    return this.getBaseUrl().getRelativeUrl(path);
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
   * brings a response of a single ressource in the desired format
   *
   * @param response
   * @returns {any|{}[]}
   */
  public formatResponse(response: Response): Object {
    try {
      return response.json() || {};
    }
    catch(exception) {
      return {};
    }
  }

  /**
   * brings a responses for multiple ressources in the desired format
   *
   * @param response
   * @returns {any|{}[]}
   */
  public formatArrayResponse(response: Response): Array<Object> {
    try {
      return response.json() || [{}]
    }
    catch(exception) {
      return [{}];
    }
  }

  /**
   * returns the apis base url
   */
  public abstract getBaseUrl(): Url;
}
