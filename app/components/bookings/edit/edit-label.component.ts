import {Component, Input} from '@angular/core';
import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES} from "ionic-angular/index";

@Component({
  selector: 'edit-label',
  directives: [IONIC_DIRECTIVES],
  templateUrl: 'build/components/bookings/edit/edit-label.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class EditLabel {

  @Input()
  public _text: String;


  constructor() {
    console.log(this._text);
  }



  /*
  * <preference name="KeyboardDisplayRequiresUserAction" value="false" />
  * to cordovas config.xml
  *
  * */

  focusInput(input) {
    //input.setFocus();
  }

  public editing_finished (): void{

    console.log("edit finished");

  }


  public editing_should_begin (): void{

    console.log(this._text);

  }

}


/**
 * Created by morit on 29.07.2016.
 */
