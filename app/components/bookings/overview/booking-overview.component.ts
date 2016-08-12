import {Component} from '@angular/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Translations} from "../../../multilanguage/translations";

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  pipes: [TranslatePipe]
})
export class BookingOverviewComponent {
  
  private _translations: typeof Translations = Translations;

  constructor() {
  }
}
