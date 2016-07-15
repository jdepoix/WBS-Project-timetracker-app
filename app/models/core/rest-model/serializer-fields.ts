import {Url} from '../../../core/url/url';

/**
 * this is the ABC for deserializer fields. Serializer fields are needed, to describe the structure of an RestModel. This
 * allows deserializing Models without implementing serialization for every Model.
 */
export abstract class RestModelDeserializerField<FieldType> {
  /**
   * @param _fieldName the name of the field
   * @param _sourceObjectFieldName optionally the name of this field in the source plain object. Will be the same as
   * fieldName if not provided
   */
  constructor(private _fieldName: string, private _sourceObjectFieldName?: string) {
  }

  get fieldName(): string {
    return this._fieldName;
  }

  get sourceObjectFieldName(): string {
    return this._sourceObjectFieldName || this._fieldName;
  }

  /**
   * deserializes ths field from the given object and returns it
   *
   * @param plainObject
   * @returns {FieldType}
   */
  public deserialize(plainObject: Object): FieldType {
    return plainObject[this.sourceObjectFieldName] === null || plainObject[this.sourceObjectFieldName] === undefined ?
      null : this.deserializeField(plainObject[this.sourceObjectFieldName]);
  }

  /**
   * deserializes the field from the given field and returns it
   *
   * @param plainObjectField
   */
  public abstract deserializeField(plainObjectField: any): FieldType;
}

/**
 * deserializer for Integers
 */
export class IntegerDeserializerField extends RestModelDeserializerField<number> {
  deserializeField(plainObjectField: any): number {
    return Number.parseInt(plainObjectField);
  }
}

/**
 * deserializer for Floats
 */
export class FloatDeserializerField extends RestModelDeserializerField<number> {
  deserializeField(plainObjectField: any): number {
    return Number.parseFloat(plainObjectField);
  }
}

/**
 * deserializer for string
 */
export class StringDeserializerField extends RestModelDeserializerField<string> {
  deserializeField(plainObjectField: any): string {
    return plainObjectField.toString();
  }
}

/**
 * deserializer for booleans
 */
export class BooleanDeserializerField extends RestModelDeserializerField<boolean> {
  deserializeField(plainObjectField: any): boolean {
    return <boolean> plainObjectField;
  }
}

/**
 * deserializer for Urls
 */
export class UrlDeserializerField extends RestModelDeserializerField<Url> {
  deserializeField(plainObjectField: any): Url {
    return new Url(plainObjectField.toString());
  }
}

/**
 * deserializer for dates. Excpect to receive dates as a string in the YYYY-MM-DD format.
 */
export class DateDeserializerField extends RestModelDeserializerField<Date> {
  deserializeField(plainObjectField: any): Date {
    let date: Date = new Date(plainObjectField);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
