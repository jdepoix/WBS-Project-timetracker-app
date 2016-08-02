import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';

import {NavParams, NavController} from 'ionic-angular/index';

import {Workpackage} from '../../../models/workpackage/workpackage';
import {Booking} from '../../../models/booking/booking';

import {BookingService} from '../../../services/bookings/booking.service';

import {BookingComponent} from '../../bookings/booking/booking.component';
import {CreateBookingComponent} from "../../bookings/create/create-booking.component";

@Component({
  templateUrl: 'build/components/workpackages/detail/workpackage-detail.component.html',
  directives: [BookingComponent]
})
export class WorkpackageDetailComponent {
  private _workpackage: Workpackage;
  private _dateGroupedBookings: Map<string, Array<Booking>>;
  private _sortedDateGroups: Array<string> = [];

  constructor(navParams: NavParams, private _bookingsService: BookingService, private _navController: NavController) {
    this._workpackage = navParams.get('workpackage');
      this._bookingsService
      .get(null, this._workpackage)
      .subscribe((bookings: Array<Booking>) => this._groupBookingsByDate(bookings));
  }

  private _groupBookingsByDate(bookings: Array<Booking>) {
    let dateGroupedBookings: Map<string, Array<Booking>> = new Map<string, Array<Booking>>();
    let sortedDateGroups: Array<string> = new Array<string>();

    bookings.forEach((booking: Booking) => {
      let date: string = new DatePipe().transform(booking.date, 'dd.MM.yyyy');

      if (dateGroupedBookings.has(date)) {
        dateGroupedBookings.get(date).push(booking);
      } else {
        sortedDateGroups.push(date);
        dateGroupedBookings.set(date, [booking]);
      }
    });

    this._dateGroupedBookings = dateGroupedBookings;
    this._sortedDateGroups = sortedDateGroups;
  }

  public createBooking(workpackage: Workpackage):void {
    this._navController.push(CreateBookingComponent, {
      workpackage: this._workpackage
    });
  }
}
