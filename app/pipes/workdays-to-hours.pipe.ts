import { Pipe, PipeTransform } from '@angular/core';

/**
 * transforms a Float representing a fraction of a workday (8 hours each) into a more readable format: HH:MM
 */
@Pipe({name: 'workdaysToHours'})
export class WorkdaysToHoursPipe implements PipeTransform {
  transform(workdays: number): string {
    let workdaysInHours: number = workdays * 8;
    let hours: number = parseInt(workdaysInHours.toString());
    let minutesString: string = parseInt((Math.abs(workdaysInHours - hours) * 60).toString()).toString();

    while (minutesString.length < 2) {
      minutesString = '0' + minutesString;
    }

    return hours.toString() + ':' + minutesString;
  }
}