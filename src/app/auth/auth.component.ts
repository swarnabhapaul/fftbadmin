import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { Helpers } from '../helpers';

declare let $: any;
declare let mUtil: any;


@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    model: any = {};

    modelSignup: any = {
        email: null,
        password: null,
        name: null,
        company: null,
        vat: null,
        address: {
            premisis: null,
            postCode: null,
            city: null
        },
        description: null,
        remember: true
    };

    signupRules: Object = {
        email: {
            required: true,
            email: true,
            maxlength: 255
        }, password: {
            required: true,
            maxlength: 20
        },
        name: {
            required: true,
            maxlength: 100
        },
        company: {
            required: true,
            maxlength: 255
        },
        vat: {
            required: true,
            maxlength: 255
        },
        'address[premisis]': {
            required: true,
            maxlength: 255
        }, 'address[postCode]': {
            required: true,
            maxlength: 8
        }, 'address[city]': {
            required: true,
            maxlength: 50
        },
        description: {
            required: true,
            maxlength: 2000
        },
        remember: true
    }

    loading = false;
    returnUrl: string;
    option: any;
    selectedOption:any;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {

        this.model.role = ""

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handleFormSwitch();
                this.handleSignInFormSubmit();
                // this.handleSignUpFormSubmit();
                // this.handleSignUpFormcompany();
                this.handleForgetPasswordFormSubmit();
                // this.handleSignUpadditionalForm();

                this.handleSignupForm();
            });
    }

    /**
     * method to validate signup form
     */
    handleSignupForm() {
        let form = $('#brewery_signup_form');

        // impose validation rules
        form.validate({ rules: this.signupRules });

        // validate step-1
        document.getElementById('m_brewery_signup_step1').addEventListener('click', (e) => {
            // validate for step1
            if (!form.valid() && (!$.trim(this.modelSignup.email) || !$.trim(this.modelSignup.password) || !$.trim(this.modelSignup.name))) {
                e.preventDefault();
                return;
            }

            $('#nav-home-tab, #nav-profile-tab, #nav-contact-tab, #nav-home, #nav-profile, #nav-contact').removeClass('active show');
            $('#nav-home-tab, #nav-profile-tab, #nav-contact-tab').prop('aria-selected', false);
            $('#nav-profile-tab, #nav-profile').addClass('active show');
            $('#nav-profile-tab').prop('aria-selected', true);
        });

        // validate step-2
        document.getElementById('m_signup_step2_submit').addEventListener('click', (e) => {

            // validate for step1
            if (!form.valid() && (!$.trim(this.modelSignup.company) || !$.trim(this.modelSignup.vat) || !$.trim(this.modelSignup.address.premisis) || !$.trim(this.modelSignup.address.postCode) || !$.trim(this.modelSignup.address.city))) {
                e.preventDefault();
                return;
            }

            $('#nav-home-tab, #nav-profile-tab, #nav-contact-tab, #nav-home, #nav-profile, #nav-contact').removeClass('active show');
            $('#nav-home-tab, #nav-profile-tab, #nav-contact-tab').prop('aria-selected', false);
            $('#nav-contact-tab, #nav-contact').addClass('active show');
            $('#nav-contact-tab').prop('aria-selected', true);
        });

        // validate step-3
        document.getElementById('m_signup_step3_submit').addEventListener('click', (e) => {

            // validate for step1
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.signupBrewery()
        });
    }

    signin() {
        // console.log('------------------------------------>')
        // console.log(this.model)
        this.loading = true;
        this._authService.login(this.model.role, this.model.email, this.model.password).subscribe(
            data => {

                // get login user detail after login
                this._userService.getLoginUser().subscribe(data => {
                    // store loginh user information
                    localStorage.setItem('userDetail', JSON.stringify(data.data));

                    // redirect user to return Url
                    this._router.navigate([this.returnUrl]);
                });
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }

    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(data.message, true);
                this.loading = false;
                this.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }


    handleSignInFormSubmit() {
        $('#m_login_signin_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true,
                    },
                    role: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    displaySignUpForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--forget-password');
        mUtil.removeClass(login, 'm-login--signin');
        try {
            $('form').data('validator').resetForm();
        } catch (e) {
        }
        mUtil.addClass(login, 'm-login--signup');
        mUtil.animateClass(login.getElementsByClassName('m-login__signup')[0], 'flipInX animated');
    }

    displaySignInForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--forget-password');
        mUtil.removeClass(login, 'm-login--signup');
        try {
            $('form').data('validator').resetForm();
        } catch (e) {
        }

        mUtil.addClass(login, 'm-login--signin');
        mUtil.animateClass(login.getElementsByClassName('m-login__signin')[0], 'flipInX animated');
    }

    displayForgetPasswordForm() {
        let login = document.getElementById('m_login');
        mUtil.removeClass(login, 'm-login--signin');
        mUtil.removeClass(login, 'm-login--signup');

        mUtil.addClass(login, 'm-login--forget-password');
        mUtil.animateClass(login.getElementsByClassName('m-login__forget-password')[0], 'flipInX animated');
    }

    handleFormSwitch() {
        document.getElementById('m_login_forget_password').addEventListener('click', (e) => {
            e.preventDefault();
            this.displayForgetPasswordForm();
        });

        document.getElementById('m_login_forget_password_cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignInForm();
        });

        document.getElementById('m_login_signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignUpForm();
        });
        document.getElementById('m_login_signup_cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.displaySignInForm();
        });


    }

    /* Ends Here */

    handleForgetPasswordFormSubmit() {
        document.getElementById('m_login_forgetpassword_submit').addEventListener('click', (e) => {
            let btn = $(e.target);
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }
        });
    }

    /* Login-2(Brewery Form) */

    signupBrewery() {
        this.loading = true;

        this._userService.signupBrewery(this.modelSignup).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(data.message, true);
                this.loading = false;
                this.displaySignInForm();
            },
            error => {
                this.showAlert('alertSignup');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }
}