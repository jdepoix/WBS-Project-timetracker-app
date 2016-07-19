import {Component, EventEmitter} from '@angular/core';
import {FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';
import {SessionAuthenticationService} from "../../services/session/session-authentication.service";
import {SessionService} from "../../services/session/session.service";
import {Url} from "../../core/url/url";
import {NavController, Alert} from "ionic-angular/index";
import {BookingOverviewComponent} from "../booking/overview/booking-overview.component";



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

        this.session.apiUrl = new Url("http://localhost:8000");
        let event: EventEmitter<string> = this.auth.login(this.authForm.value.username, this.authForm.value.password);

        var token: string = '';

        event.subscribe((authToken: string) => {
            token = authToken;
        });

        this.nav.setRoot(BookingOverviewComponent);
    }
}

