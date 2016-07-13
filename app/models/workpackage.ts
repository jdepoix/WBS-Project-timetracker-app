import {RestModel} from './core/rest-model/rest-model';
import {Updateable} from './core/rest-model/model-operations';
import {
  RestModelDeserializerField,
  StringDeserializerField,
  BooleanDeserializerField,
  FloatDeserializerField
} from './core/rest-model/serializer-fields';

export class Workpackage extends RestModel implements Updateable {
  public stringId: string;
  public name: string;
  public description: string;
  public isToplevelWp: boolean;
  public isInactive: boolean;
  public etc: number;
  public bac: number;
  public ac: number;
  public ev: number;
  public eac: number;
  public cpi: number;

  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
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

  constructor(plainObject: Object) {
    super(plainObject);
    this._deserialize(plainObject);
  }

  getUpdateRequestData(): Object {
    return undefined;
  }
}