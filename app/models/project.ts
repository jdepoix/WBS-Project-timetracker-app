import {RestModel} from './core/rest-model/rest-model';
import {RestModelDeserializerField} from './core/rest-model/serializer-fields';

export class Project extends RestModel {
  getDeserializerFields(): Array<RestModelDeserializerField<Object>> {
    return this.deserializerFields;
  }
}