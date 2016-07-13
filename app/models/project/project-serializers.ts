import {RestModelDeserializer} from '../core/rest-model/serializers';
import {
  RestModelDeserializerField,
  UrlDeserializerField,
  StringDeserializerField
} from '../core/rest-model/serializer-fields';

import {Project} from './project';

export class ProjectDeserializer extends RestModelDeserializer<Project> {
  protected _deserializerFields: Array<RestModelDeserializerField<Object>> = [
    new UrlDeserializerField('self'),
    new StringDeserializerField('db')
  ];

  createInstance(): Project {
    return new Project();
  }
}
