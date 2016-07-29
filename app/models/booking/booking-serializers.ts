import {RestModelDeserializer} from '../core/rest-model/serializers';
import {
  UrlDeserializerField,
  StringDeserializerField,
  DateDeserializerField,
  RestModelDeserializerField,
  FloatDeserializerField, RelatedModelField
} from '../core/rest-model/serializer-fields';

import {WorkpackageDeserializer} from '../workpackage/workpackage-serializers';

import {Booking, BookingSession} from './booking';
import {Workpackage} from '../workpackage/workpackage';

export class BookingDeserializer extends RestModelDeserializer<Booking> {
  protected _deserializerFields: Array<RestModelDeserializerField<any>> = [
    new UrlDeserializerField('self'),
    new FloatDeserializerField('effort'),
    new StringDeserializerField('description'),
    new DateDeserializerField('date'),
    new RelatedModelField<Workpackage>(WorkpackageDeserializer, 'workpackage')
  ];

  createInstance(): Booking {
    return new Booking();
  }
}

export class BookingSessionDeserializer extends RestModelDeserializer<BookingSession> {
  protected _deserializerFields: Array<RestModelDeserializerField<any>> = [
    new UrlDeserializerField('self'),
    new DateDeserializerField('startTime'),
    new RelatedModelField<Workpackage>(WorkpackageDeserializer, 'workpackage')
  ];

  createInstance(): BookingSession {
    return new BookingSession();
  }
}