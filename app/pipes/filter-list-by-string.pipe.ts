import { Pipe, PipeTransform } from '@angular/core';

/**
 * filters a list of Objects by a given string, on the given properties
 */
@Pipe({name: 'filterListByString'})
export class FilterListByStringPipe implements PipeTransform {
  /**
   * filters a list of Objects by a given string, on the given properties
   *
   * @param elements Array of elements
   * @param filterString the string you want to filter by
   * @param propertiesToFilterBy optional array of properties. If this is set, it will be looked in all properties in
   * each element. If this isn't set, it is assumed, that the list only contains strings and it will be filtered on the
   * elements them self.
   * @returns {Array<any>}
   */
  transform(elements: Array<any>, filterString: string, propertiesToFilterBy?: Array<string>): Array<any> {
    if (filterString) {
      let elementContainsFilterString: (element: any) => boolean = (element: any): boolean => {
        return element.toLowerCase().includes(filterString.toLowerCase());
      };

      return elements.filter((element: any): boolean => {
        if (propertiesToFilterBy) {
          return propertiesToFilterBy.some((property: string): boolean => {
            if (element.hasOwnProperty(property)) {
              return elementContainsFilterString(element[property]);
            }
            return false;
          });
        } else {
          return elementContainsFilterString(element);
        }
      });
    }

    return elements;
  }
}