import {Component} from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';
import {BookingOverviewComponent} from "../booking/overview/booking-overview.component";
import {NavController} from "ionic-angular/index";



@Component({
    templateUrl: 'build/components/login/login.component.html',
})
export class LoginComponent {

    server_address: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    authForm: ControlGroup;
    serverColor: string;
    usernameColor: string;
    passwordColor: string;

    constructor(private fb: FormBuilder, private nav: NavController) {
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

        this.nav.setRoot(BookingOverviewComponent);
    }
}

