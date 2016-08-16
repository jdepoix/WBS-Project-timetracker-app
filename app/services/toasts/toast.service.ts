import {Injectable} from '@angular/core';

import {Toast, ToastController} from 'ionic-angular/index';

/**
 * Manages Toasts to make sure there is only one instance of a Toast alive at any given time, which can be dismissed.
 * This is needed to avoid the bug which occurs, when the ion-datetime is opened while a Toast is still displayed.
 */
@Injectable()
export class ToastService {
  private _toast: Toast = null;

  constructor(private _toastController: ToastController) {
  }

  public showToast(message: string): void {
    if (this._toast != null) {
      this._toast.dismiss();
    }

    this._toast = this._toastController.create({
      message: message,
      duration: 1800,
      position: 'bottom'
    });
    this._toast.onDidDismiss(() => this._toast = null);

    this._toast.present();
  }

  public dismiss(): void {
    if (this._toast != null) {
      this._toast.dismiss();
    }
  }
}