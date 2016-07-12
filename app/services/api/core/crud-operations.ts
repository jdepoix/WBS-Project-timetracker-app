import {RestModel} from '../../../models/core/rest-model/rest-model';
import {Observable} from 'rxjs/Rx';


export interface RetrieveRequest<Model extends RestModel> {
  retrieve(element: Model): Observable<Model>;
}

export interface ListRequest<Model extends RestModel> {
  list(): Observable<Array<Model>>;
}

export interface CreateRequest<Model extends RestModel> {
  create(element: Model): Observable<Model>;
}

export interface UpdateRequest<Model extends RestModel> {
  update(element: Model): Observable<Model>;
}
