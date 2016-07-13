import {RestModel} from './core/rest-model/rest-model';
import {RestModelDeserializerField, StringDeserializerField} from './core/rest-model/serializer-fields';

export class Project extends RestModel {
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new StringDeserializerField('db')
  ];

  constructor(plainObject: Object) {
    super(plainObject);
    this._deserialize(plainObject);
  }
}