import {RestModelDeserializer} from '../core/rest-model/serializers';

import {
  RestModelDeserializerField,
  StringDeserializerField,
  BooleanDeserializerField,
  FloatDeserializerField,
  UrlDeserializerField
} from '../core/rest-model/serializer-fields';

import {Workpackage} from './workpackage';

export class WorkpackageDeserializer extends RestModelDeserializer<Workpackage> {
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self'),
    new StringDeserializerField('stringId'),
    new StringDeserializerField('name'),
    new StringDeserializerField('description'),
    new BooleanDeserializerField('isToplevelWp'),
    new BooleanDeserializerField('isInactive'),
    new FloatDeserializerField('etc'),
    new FloatDeserializerField('bac'),
    new FloatDeserializerField('ac'),
    new FloatDeserializerField('ev'),
    new FloatDeserializerField('eac'),
    new FloatDeserializerField('cpi'),
  ];

  createInstance(): Workpackage {
    return new Workpackage();
  }
}