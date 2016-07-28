import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {Url, RessourceUrl} from '../../core/url/url';

import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';
import {Booking} from '../../models/booking/booking';
import {Workpackage} from '../../models/workpackage/workpackage';
import {BookingDeserializer} from '../../models/booking/booking-serializers';

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
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  public get(date?: Date, workpackage?: Workpackage): Observable<Array<Booking>> {
    let url: Url = this._endpoint;

    if (date != null) {
      url = url.clone().addParam('date', new Date(date.toISOString()).toJSON().split('T')[0]);
    }
    if (workpackage != null) {
      url = url.clone().addParam('workpackage_id', RessourceUrl.getPrimaryKey(workpackage.self));
    }

    return this._timetrackerApiService.getWithFullUrl(url).map((plainObjects) => {
      return new RestModelListDeserializer<Booking>(plainObjects, (plainObject: Object): Booking => {
        return new BookingDeserializer(plainObject).deserialize();
      }).deserialize();
    });
  }

  public update(element: Booking): Observable<Booking> {
    return this._timetrackerApiService.patchWithFullUrl(element.self, element.getUpdateRequestData())
      .map(this._deserializePlainObject);
  }

  create(element: Booking): Observable<Booking> {
    return this._timetrackerApiService.postWithFullUrl(element.self, element.getCreateRequestData())
      .map(this._deserializePlainObject);
  }

  delete(element: Booking): Observable<Response> {
    return this._timetrackerApiService.deleteWithFullUrl(element.self);
  }

  private _deserializePlainObject(plainObject: Object): Booking {
    return new BookingDeserializer(plainObject).deserialize();
  }

  private get _endpoint(): Url {
    return this._sessionService.subProjetUrl.getRelativeUrl('bookings');
  }
}