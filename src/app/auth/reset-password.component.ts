import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { Helpers } from '../helpers';

declare let $: any;
declare let mUtil: any;

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class ResetPasswordComponent implements OnInit {
    model: any = {};
    loading = false;
    readonly REDIRECT_USER_IN_MS: number = 2000;
    token: string;

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
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                // this.handleResetPassword();
            });

        this.token = this._route.snapshot.params.token;
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    /* Basic Info */
    handleResetPassword() {
        document.getElementById('m_profile_basic').addEventListener('click', (e) => {
            let btn = $(e.target);
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    password: {
                        required: true,
                    },
                    repassword: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.resetPassword();
        });
    }

    resetPassword() {
        this.loading = true;
        this._userService.resetPassword(this.token, this.model.password).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(data.message, true);

                // redirect user after two second
                setTimeout(() => {
                    this._router.navigate(['/login'], { queryParams: { returnUrl: 'index' } });
                }, this.REDIRECT_USER_IN_MS)
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }
}