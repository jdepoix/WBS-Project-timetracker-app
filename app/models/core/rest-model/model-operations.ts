/**
 * tags a Model which can be updated by an API
 */
export interface Updateable {
  /**
   * returns the JSON Object which is used by the update request
   */
  getUpdateRequestData(): Object;
}

/**
 * tags a Model which can be created by an API
 */
export interface Createable {
  /**
   * returns the JSON Object which is used by the create request
   */
  getCreateRequestData(): Object;
}
