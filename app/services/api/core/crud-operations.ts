import {Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {RestModel} from '../../../models/core/rest-model/rest-model';
import {Createable, Updateable} from '../../../models/core/rest-model/model-operations';

/**
 * tags an API Service which is able to get a set of resources
 */
export interface GetOperation<Model extends RestModel> {
  /**
   * returns a list of resources
   */
  get(): Observable<Array<Model>>;
}

/**
 * tags an API Service which is retrieve a specific resource
 */
export interface RetrieveOperation<Model extends RestModel> {
  /**
   * retrieves a single resource
   */
  retrieve(): Observable<Model>;
}

/**
 * tags an API Service which is able to create a resource
 */
export interface CreateOperation<Model extends RestModel & Createable> {
  /**
   * takes a Model and creates the given Model using this API
   *
   * @param element the Model to create
   */
  create(element: Model): Observable<Model>;
}

/**
 * tags an API Service which is able to update a resource
 */
export interface UpdateOperation<Model extends RestModel & Updateable> {
  /**
   * updates the values of a given Model a backend using this API
   *
   * @param element the model to update
   */
  update(element: Model): Observable<Model>;
}

/**
 * tags an API Service which is able to delete a resources
 */
export interface DeleteOperation<Model extends RestModel> {
  /**
   * deletes the given Model in the backend this API is connected to
   *
   * @param element the Model to delete
   */
  delete(element: Model): Observable<Response>;
}
