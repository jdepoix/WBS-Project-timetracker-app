/**
 * Created by morit on 31.07.2016.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'hoursToWorkdays'})
export class HoursToWorkdaysPipe implements PipeTransform {
  transform(hourString: String): number {

    let hrs = hourString.substring(0, hourString.indexOf(":")-1);
    let mins = hourString.substr(hourString.indexOf(":")+1);
    let res :number =  +hrs / 8 + +mins / 60 / 8;

    return res;
  }
}