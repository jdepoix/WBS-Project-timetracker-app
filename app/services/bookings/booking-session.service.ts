import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {BookingSession} from '../../models/booking/booking';

import {CreateOperation, RetrieveOperation, DeleteOperation} from '../api/core/crud-operations';

import {TimetrackerApiReuqestService} from '../api/timetracker/timetracker-api-request.service';
import {BookingSessionDeserializer} from '../../models/booking/booking-serializers';

/**
 * takes care of handling requests to the BookingSession API
 */
@Injectable()
export class BookingSessionService implements
  RetrieveOperation<BookingSession>,
  CreateOperation<BookingSession>,
  DeleteOperation<BookingSession>
{
  private _endpointPath: string;
  constructor(private _timetrackerApiService: TimetrackerApiReuqestService) {
    this._endpointPath = 'booking-sessions';
  }

  public retrieve(): Observable<BookingSession> {
    return this._timetrackerApiService.get(this._endpointPath).map((plainObjects: Array<Object>): BookingSession => {
      if (plainObjects.length >= 1) {
        return new BookingSessionDeserializer(plainObjects[0]).deserialize();
      }

      return null;
    });
  }

  public create(element: BookingSession): Observable<BookingSession> {
    return this._timetrackerApiService.post(this._endpointPath, element.getCreateRequestData())
      .map((plainObject: Object): BookingSession => {
        return new BookingSessionDeserializer(plainObject).deserialize()
      });
  }

  public delete(element: BookingSession): Observable<Response> {
    return this._timetrackerApiService.deleteWithFullUrl(element.self);
  }
}
