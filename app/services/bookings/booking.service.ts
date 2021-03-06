import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import moment = require('moment');
import Moment = moment.Moment;

import {Url, RessourceUrl} from '../../core/url/url';

import {RestModelListDeserializer} from '../../models/core/rest-model/serializers';

import {Workpackage} from '../../models/workpackage/workpackage';
import {BookingDeserializer} from '../../models/booking/booking-serializers';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {GetOperation, CreateOperation, UpdateOperation, DeleteOperation} from '../api/core/crud-operations';
import {SessionService} from '../session/session.service';
import {Booking} from "../../models/booking/booking";

/**
 * takes care of handling requests to the Booking API
 */
@Injectable()
export class BookingService implements
  GetOperation<Booking>,
  CreateOperation<Booking>,
  UpdateOperation<Booking>,
  DeleteOperation<Booking>
{
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService, private _sessionService: SessionService) {
  }

  /**
   * gets all Bookings belonging to the logged in User.
   *
   * @param date filter by this date
   * @param workpackage filter by this workpackage
   * @returns {Observable<Array<Booking>>}
   */
  public get(date?: Moment, workpackage?: Workpackage): Observable<Array<Booking>> {
    let url: Url = this._endpoint;

    if (date != null) {
      url = url.clone().addParam('date', date.format('YYYY-MM-DD'));
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

  public create(element: Booking, newEtc?: number): Observable<Booking> {
    let bookingCreateData = element.getCreateRequestData();

    if (newEtc != null) {
      bookingCreateData['newETC'] = newEtc;
    }

    return this._timetrackerApiService.postWithFullUrl(this._endpoint, bookingCreateData)
      .map(this._deserializePlainObject);
  }

  public delete(element: Booking): Observable<Response> {
    return this._timetrackerApiService.deleteWithFullUrl(element.self);
  }

  private _deserializePlainObject(plainObject: Object): Booking {
    return new BookingDeserializer(plainObject).deserialize();
  }

  private get _endpoint(): Url {
    return this._sessionService.subProjetUrl.getRelativeUrl('bookings');
  }
}