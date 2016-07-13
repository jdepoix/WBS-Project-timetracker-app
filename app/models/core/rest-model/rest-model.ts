import {Url} from '../../../core/url/url';

import {RestModelDeserializerField, UrlDeserializerField} from './serializer-fields';

export abstract class RestModel {
  public self: Url;

  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self')
  ];

  constructor(plainObject: Object) {
    this._deserialize(plainObject);
  }

  public _deserialize(plainObject: Object): void {
    this._deserializerFields.forEach((deserializerField) => {
      this[deserializerField.fieldName] = deserializerField.deserialize(plainObject);
    })
  }
}
