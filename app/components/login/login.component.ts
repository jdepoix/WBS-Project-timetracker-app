import {Component, EventEmitter} from '@angular/core';
import {FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';
import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";
import {Url} from "../../core/url/url";
import {NavController, Alert, Loading} from "ionic-angular/index";
import {BookingOverviewComponent} from "../bookings/overview/booking-overview.component";

@Component({
    templateUrl: 'build/components/login/login.component.html'
})
export class LoginComponent {

    server_address: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    authForm: ControlGroup;
    serverColor: string;
    usernameColor: string;
    passwordColor: string;

    constructor(private fb: FormBuilder,
                private auth: SessionAuthenticationService,
                private session: SessionService,
                private nav: NavController) {
        this.authForm = fb.group({
            'server_address': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });

        this.server_address = this.authForm.controls['server_address'];
        this.username = this.authForm.controls['username'];
        this.password = this.authForm.controls['password'];
    }


    onSubmit(form){
        if(this.checkFieldsSet()) {
            this.session.apiUrl = new Url(this.authForm.value.server_address);
            let event:EventEmitter<string> = this.auth.login(this.authForm.value.username, this.authForm.value.password);

            var token:string = '';

            event.subscribe((authToken:string) => {
                token = authToken;
            });

            setTimeout(() => {
                if(token == ''){
                    let alert = Alert.create({
                        title: 'Falsche Eingabe',
                        subTitle: 'Benutzername oder Passwort ist falsch!',
                        buttons: ['OK']
                    });
                    this.nav.present(alert);
                }
                else{
                    this.nav.setRoot(BookingOverviewComponent);
                }
            }, 1000);

            let loading = Loading.create({
                content: "Please wait...",
                duration: 900
            });
            this.nav.present(loading);
        }
    }

    checkFieldsSet(): boolean{
        if(this.authForm.value.server_address == ''){
            this.serverColor = "red";
        }
        else{
            this.serverColor = "grey";
        }

        if(this.authForm.value.username == ''){
            this.usernameColor = "red";
        }
        else{
            this.usernameColor = "grey";
        }

        if(this.authForm.value.password == ''){
            this.passwordColor = "red";
        }
        else{
            this.passwordColor = "grey";
        }
        return this.authForm.value.server_address != '' &&
            this.authForm.value.username != '' &&
            this.authForm.value.password != '';
    }
}

