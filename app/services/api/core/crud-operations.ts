import {Observable} from 'rxjs/Rx';

import {RestModel} from '../../../models/core/rest-model/rest-model';
import {Createable, Updateable} from '../../../models/core/rest-model/model-operations';


export interface GetOperation<Model extends RestModel> {
  get(): Observable<Array<Model>>;
}

export interface CreateOperation<Model extends RestModel & Createable> {
  create(element: Model): Observable<Model>;
}

export interface UpdateOperation<Model extends RestModel & Updateable> {
  update(element: Model): Observable<Model>;
}

export interface DeleteOperation<Model extends RestModel> {
  delete(element: Model): Observable<Model>;
}
