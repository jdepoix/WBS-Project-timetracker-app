import {RestModelDeserializer} from '../core/rest-model/serializers';
import {
  UrlDeserializerField,
  StringDeserializerField,
  DateDeserializerField,
  RestModelDeserializerField,
  FloatDeserializerField
} from '../core/rest-model/serializer-fields';

import {Booking} from './booking';

export class BookingDeserializer extends RestModelDeserializer<Booking> {
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self'),
    new FloatDeserializerField('effort'),
    new StringDeserializerField('description'),
    new DateDeserializerField('date'),
    new UrlDeserializerField('workpackage')
  ];

  createInstance(): Booking {
    return new Booking();
  }
}