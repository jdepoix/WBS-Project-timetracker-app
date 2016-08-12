import {Component, Input, Output} from '@angular/core';
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
  selector: 'edit-label', templateUrl: 'build/components/bookings/edit/edit-label.component.html'
})

export class EditLabelComponent {
  private _isEditMode: boolean = false;
  private _rememberValue: string = "";

  @Input() public value: String;

  @Output() public onSave = new EventEmitter<string>();

  public focus(): void {
    // this Method is just here for the case that this Editlabel should be triggered
    // by a click instead of a longclick in the future
  }

  private _editingFinished(): void {
    if (this.value.length < 1) {
      this.value = this._rememberValue;
    } else if (this._rememberValue.trim() != this.value.trim()) {
      this.onSave.emit(this.value);
    }
    this._isEditMode = false;
  }

  private  _editingShouldBegin(): void {
    this._rememberValue = this.value;
    this._isEditMode = true;
  }
}
