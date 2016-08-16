import {Injectable} from '@angular/core';

import {Toast, ToastController} from 'ionic-angular/index';

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