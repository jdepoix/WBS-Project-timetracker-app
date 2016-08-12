import {Component} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';

import {NavController, Alert, Loading} from "ionic-angular/index";

import {Url} from "../../core/url/url";

import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Translations} from "../../multilanguage/translations";


@Component({
  templateUrl: 'build/components/login/login.component.html',
  pipes: [TranslatePipe]
})
export class LoginComponent {
  serverAddress: AbstractControl;
  username: AbstractControl;
  password: AbstractControl;
  authForm: ControlGroup;
  serverColor: string;
  usernameColor: string;
  passwordColor: string;
  private _translations: typeof Translations = Translations;

  constructor(private _formBuilder: FormBuilder,
              private _authenticationSerivce: SessionAuthenticationService,
              private _sessionSerivce: SessionService,
              private _nav: NavController,
              private _translate: TranslateService) {
    this.authForm = _formBuilder.group({
      "serverAddress": ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });

    this.serverAddress = this.authForm.controls['serverAddress'];
    this.username = this.authForm.controls['username'];
    this.password = this.authForm.controls['password'];
  }

  onSubmit() {
    if (this.checkFieldsSet()) {
      let loading = Loading.create({
        content: "Please wait..."
      });

      this._nav.present(loading);

      this._sessionSerivce.apiUrl = new Url(this.authForm.value.serverAddress);

      this._authenticationSerivce.login(this.authForm.value.username, this.authForm.value.password).subscribe((authToken: string) => {
        loading.destroy();

        if (!authToken) {
          let alert = Alert.create({
            title: 'Falsche Eingabe',
            subTitle: 'Benutzername oder Passwort ist falsch!',
            buttons: ['OK']
          });
          this._nav.present(alert);
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

