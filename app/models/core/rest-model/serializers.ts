import {RestModel} from './rest-model';
import {RestModelDeserializerField, UrlDeserializerField} from './serializer-fields';

export abstract class RestModelDeserializer<Model extends RestModel> {
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self')
  ];

  constructor(protected _plainObject: Object) {
  }

  public deserialize(): Model {
    let modelInstance: Model = this.createInstance();

    this._deserializerFields.forEach((deserializerField) => {
      modelInstance[deserializerField.fieldName] = deserializerField.deserialize(this._plainObject);
    });

    return modelInstance;
  }

  public abstract createInstance(): Model;
}

export class RestModelListDeserializer<Model extends RestModel> {
  constructor(
    protected _plainObjects: Array<Object>,
    protected _deserializiationFunction: (plainObject: Object) => Model) {
  }

  public deserialize(): Array<Model> {
    let modelInstances: Array<Model> = [];

    this._plainObjects.forEach((plainObject: Object) => {
      modelInstances.push(this._deserializiationFunction(plainObject));
    });

    return modelInstances
  }
}