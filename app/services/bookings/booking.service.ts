import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {Url} from '../../core/url/url';

import {Booking} from '../../models/booking/booking';
import {BookingDeserializer} from '../../models/booking/booking-serializers';
import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {GetOperation, CreateOperation, UpdateOperation, DeleteOperation} from '../api/core/crud-operations';
import {SessionService} from '../session/session.service';

@Injectable()
export class BookingService implements
  GetOperation<Booking>,
  CreateOperation<Booking>,
  UpdateOperation<Booking>,
  DeleteOperation<Booking>
{
  private _endpoint: Url;

  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
    this._endpoint = this._sessionService.subProjetUrl.getRelativeUrl('workpackages');
  }

  public get(isToplevelWorkpackage?: boolean): Observable<Array<Booking>> {
    let url: Url = this._endpoint;

    if (isToplevelWorkpackage != null) {
      url = url.clone().addParam('toplevel_wp', isToplevelWorkpackage);
    }

    return this._timetrackerApiService.getWithFullUrl(url).map((plainObjects) => {
      return new RestModelListDeserializer<Booking>(plainObjects, (plainObject: Object): Booking => {
        return new BookingDeserializer(plainObject).deserialize();
      }).deserialize();
    });
  }

  public update(element: Booking): Observable<Booking> {
    return this._timetrackerApiService.patchWithFullUrl(element.self, element.getUpdateRequestData())
      .map((plainObject) => {
        return new BookingDeserializer(plainObject).deserialize();
      });
  }

  create(element: Booking): Observable<Booking> {
    return this._timetrackerApiService.postWithFullUrl(element.self, element.getCreateRequestData())
      .map((plainObject) => {
        return new BookingDeserializer(plainObject).deserialize();
      });
  }

  delete(element: Booking): Observable<Booking> {
    return undefined;
  }
}