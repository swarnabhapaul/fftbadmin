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
    templateUrl: './templates/complete-registration.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class CompleteRegistrationComponent implements OnInit {
    public model: any = {
        firstName: null,
        lastName: null,
        address: {
            premisis: null,
            postCode: null,
            city: null,
            type: 'shipping'
        },
        creditCard: {
            number: null,
            expirationDate: null,
            cvv: null
        },
        token: null
    };

    public rules: any = {
        firstName: {
            required: true,
            maxlength: 100
        }, lastName: {
            required: true,
            maxlength: 100
        }, 'address[premisis]': {
            required: true,
            maxlength: 255
        }, 'address[postCode]': {
            required: true,
            maxlength: 8
        }, 'address[city]': {
            required: true,
            maxlength: 50
        }, 'creditCard[number]': {
            required: true,
            maxlength: 20
        }, 'creditCard[expirationDate]': {
            required: true,
            maxlength: 7
        }, 'creditCard[cvv]': {
            required: true,
            maxlength: 4
        }
    };

    loading = false;
    REDIRECT_USER_IN_MS: number = 2000;

    @ViewChild('alertCompleteRegistration',
        { read: ViewContainerRef }) alertCompleteRegistration: ViewContainerRef;

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
            'assets/demo/default/base/scripts.bundle.js',
            'assets/demo/default/custom/crud/forms/widgets/bootstrap-datepicker.js'], true).then(() => {
                Helpers.setLoading(false);
                this.manageDatePicker();

                this.clickOnCompleteRegistration();
            });


        // fetch token value
        this.model['token'] = this._route.snapshot.params.token;
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    manageDatePicker() {
        $('#m_datepicker_expiry_date').datepicker({
            format: 'mm/yyyy',
            startDate: 'd',
            autoclose: true,
            minViewMode: 1,
            todayHighlight: true
        })
    }

    clickOnCompleteRegistration() {
        let form = $('#complete_registration_form');

        form.validate({
            rules: this.rules
        });

        document.getElementById('m_complete_registration_submit_step1').addEventListener('click', (e) => {

            // check for the first-step form validation
            if (!form.valid() && (!this.model.firstName || !this.model.lastName)) {
                e.preventDefault();
                return;
            }

            $('#nav-basic-info-tab, #nav-address-tab, #nav-billing-tab, #nav-basic-info, #nav-address, #nav-billing').removeClass('active show');
            $('#nav-basic-info-tab, #nav-address-tab, #nav-billing-tab').prop('aria-selected', false);
            $('#nav-address-tab, #nav-address').addClass('active show');
            $('#nav-address-tab').prop('aria-selected', true);
        });

        // validate step 2
        document.getElementById('m_complete_registration_submit_step2').addEventListener('click', (e) => {
            // check for the second-step form validation
            if (!form.valid() && (!$.trim(this.model.address['premisis']) || !$.trim(this.model.address['postCode']) || !$.trim(this.model.address['city']))) {
                e.preventDefault();
                return;
            }

            $('#nav-basic-info-tab, #nav-address-tab, #nav-billing-tab, #nav-basic-info, #nav-address, #nav-billing').removeClass('active show');
            $('#nav-basic-info-tab, #nav-address-tab, #nav-billing-tab').prop('aria-selected', false);
            $('#nav-billing-tab, #nav-billing').addClass('active show');
            $('#nav-billing-tab').prop('aria-selected', true);
        });

        // validate step 2
        document.getElementById('m_complete_registration_submit_step3').addEventListener('click', (e) => {
            this.model.creditCard.expirationDate = $.trim($('#m_datepicker_expiry_date').val()) || null;

            // check for the second-step form validation
            if (!form.valid() && (!$.trim(this.model.creditCard['number']) || !$.trim(this.model.creditCard['cvv']) || !$.trim(this.model.creditCard['expirationDate']))) {
                e.preventDefault();
                return;
            }

            this.submitCompleteRegistration();
        });
    }

    submitCompleteRegistration() {
        this.loading = true;
        // update model as address
        this.model.address = [this.model.address];

        this._userService.completeRegistration(this.model).subscribe(
            data => {
                this.showAlert('alertCompleteRegistration');
                this._alertService.success(data.message, true);

                // redirect user after two second
                setTimeout(() => {
                    this._router.navigate(['/login'], { queryParams: { returnUrl: 'index' } });
                }, this.REDIRECT_USER_IN_MS)
            },
            error => {
                this.showAlert('alertCompleteRegistration');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }
}