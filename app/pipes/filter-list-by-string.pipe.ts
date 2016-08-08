import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterListByString'})
export class FilterListByStringPipe implements PipeTransform {
  transform(elements: Array<any>, filterString: string, propertiesToFilterBy?: Array<string>): Array<any> {
    if (filterString) {
      let lowerCasedFilterString: string = filterString.toLowerCase();
      let elementContainsFilterString: (element: any) => boolean = (element: any): boolean => {
        return element.toLowerCase().includes(lowerCasedFilterString);
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