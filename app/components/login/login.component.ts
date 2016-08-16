import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import {Loading, LoadingController} from "ionic-angular/index";

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {Url} from "../../core/url/url";

import {Translations} from "../../multilanguage/translations";

import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";
import {ToastService} from '../../services/toasts/toast.service';

@Component({
  templateUrl: 'build/components/login/login.component.html',
  pipes: [TranslatePipe],
})
export class LoginComponent {
  serverAddress: AbstractControl;
  username: AbstractControl;
  password: AbstractControl;
  authForm: FormGroup;
  serverColor: string;
  usernameColor: string;
  passwordColor: string;
  private _translations: typeof Translations = Translations;

  constructor(private _formBuilder: FormBuilder,
              private _authenticationSerivce: SessionAuthenticationService,
              private _sessionSerivce: SessionService,
              private _toastService: ToastService,
              private _loadingController: LoadingController,
              private _translate: TranslateService) {
    this.authForm = _formBuilder.group({
      'serverAddress': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.serverAddress = this.authForm.controls['serverAddress'];
    this.username = this.authForm.controls['username'];
    this.password = this.authForm.controls['password'];
  }

  onSubmit() {
    if (this.checkFieldsSet()) {
      let loading: Loading = this._loadingController.create({
        content: "Please wait..."
      });

      loading.present();

      this._sessionSerivce.apiUrl = new Url(this.authForm.value.serverAddress);

      this._authenticationSerivce.login(this.authForm.value.username, this.authForm.value.password).subscribe((authToken: string) => {
        loading.dismiss();

        if (!authToken) {
          this._toastService.showToast(this._translate.instant(this._translations.USER_PASSWORD_ERROR));
        }
      });
    }
  }

  checkFieldsSet(): boolean {
    if (this.authForm.value.serverAddress == '') {
      this.serverColor = "red";
    }
    else {
      this.serverColor = "grey";
    }

    if (this.authForm.value.username == '') {
      this.usernameColor = "red";
    }
    else {
      this.usernameColor = "grey";
    }

    if (this.authForm.value.password == '') {
      this.passwordColor = "red";
    }
    else {
      this.passwordColor = "grey";
    }
    return this.authForm.value.serverAddress != '' &&
      this.authForm.value.username != '' &&
      this.authForm.value.password != '';
  }
}

