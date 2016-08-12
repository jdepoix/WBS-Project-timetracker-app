import {Component, Input, Output, OnInit} from '@angular/core';
import {EventEmitter} from "@angular/common/src/facade/async";

export class RevertableChange<T> {
  constructor(private _changedValue: T, public revert: () => T) {
  }

  public getChange(): T {
    return this._changedValue;
  }
}

@Component({
  selector: 'edit-label', templateUrl: 'build/components/edit/edit-label.component.html'
})
export class EditLabelComponent implements OnInit {
  private _isEditMode: boolean = false;
  private _initialValue: string = "";

  @Input()
  public value: string;

  @Output()
  public onSave = new EventEmitter<RevertableChange<string>>();

  ngOnInit(): any {
    this._initialValue = this.value || (this.value = '');
  }

  private _editingFinished(): void {
    if (this.value.length < 1) {
      this.value = this._initialValue;
    } else if (this._initialValue.trim() != this.value.trim()) {
      this.onSave.emit(
        new RevertableChange<string>(
          this.value,
          () => {
            return this.value = this._initialValue;
          }
        )
      );
    }
    this._isEditMode = false;
  }

  private _editingShouldBegin(): void {
    this._initialValue = this.value;
    this._isEditMode = true;
  }
}
