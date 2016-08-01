import {RestModel} from './rest-model';
import {RestModelDeserializerField, UrlDeserializerField} from './serializer-fields';

/**
 * ABC for all deserializers, which deserialize a RestModel. You can make a custom RestModelDeserializer by extending
 * this class and setting the _deserializerFields, as you want your RestModel to be deserialized.
 * For every property in your RestModel, which is set by data returned by an API, you should add an
 * RestModelDeserializerField for the specific type of the returned data, to the _deserializerFields property.
 */
export abstract class RestModelDeserializer<Model extends RestModel> {
  /**
   * Set this property in your extending class, to controll how the data retrieved by the API is deserialized.
   *
   * @type {UrlDeserializerField[]}
   * @private
   */
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self')
  ];

  /**
   * takes the plain Object which should be deserialized to the given RestModel. The plain Object will most likely be
   * retuned by some sort of API
   *
   * @param _plainObject data to be deserialized
   */
  constructor(protected _plainObject: Object) {
  }

  /**
   * deserializes the data, which was set in the constructor and returns the deserialized RestModel
   *
   * @returns {Model} the deserialized RestModel
   */
  public deserialize(): Model {
    let modelInstance: Model = this.createInstance();

    this._deserializerFields.forEach((deserializerField) => {
      modelInstance[deserializerField.fieldName] = deserializerField.deserialize(this._plainObject);
    });

    return modelInstance;
  }

  /**
   * Creates and returns an empty instance of this Deserializers RestModel. This is needed, since it is not possible to
   * instantiate a generic Type.
   */
  public abstract createInstance(): Model;
}

/**
 * takes care of deserializing an Array of plainObject
 */
export class RestModelListDeserializer<Model extends RestModel> {
  /**
   * takes an Array of plainObjects and an deserializer Function
   *
   * @param _plainObjects the plain Objects to deserialize
   * @param _deserializiationFunction the function which is called for each plain Object and returns a deserialized
   * Model
   */
  constructor(
    protected _plainObjects: Array<Object>,
    protected _deserializiationFunction: (plainObject: Object) => Model) {
  }

  /**
   * deserializes the data set in the constructor
   *
   * @returns {Array<Model>} Array of deserialized Models
   */
  public deserialize(): Array<Model> {
    let modelInstances: Array<Model> = [];

    this._plainObjects.forEach((plainObject: Object) => {
      modelInstances.push(this._deserializiationFunction(plainObject));
    });

    return modelInstances
  }
}