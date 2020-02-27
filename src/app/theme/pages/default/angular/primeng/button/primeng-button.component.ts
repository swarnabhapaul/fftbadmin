import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { UserService } from '../../../../../../auth/_services/user.service';

import { UserProfile } from '../../../../../_models/UserProfile';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services/alert.service';

declare let $: any;

@Component({
    selector: "app-primeng-button",
    templateUrl: "./primeng-button.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PrimeNgButtonComponent implements OnInit, AfterViewInit {

    @ViewChild('alertUpdatePayment',
        { read: ViewContainerRef }) alertUpdatePayment: ViewContainerRef;

    private model: any = {
        creditCard: {
            number: null,
            expirationDate: null,
            cvv: null,
        },
        address: {
            premisis: null,
            city: null,
            postCode: null,
            type: 'billing'
        }
    };

    loading = false;

    private userData: UserProfile;
    datepicker: any;
    constructor(
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        this._script.loadScripts('app-widgets-bootstrap-datepicker',
            ['assets/demo/default/custom/crud/forms/widgets/bootstrap-datepicker.js'], true).then(() => {
                Helpers.setLoading(false);
                this.manageDatePicker();
            });
        if (localStorage.getItem('userDetail')) {
            let userDetail = JSON.parse(localStorage.getItem('userDetail'));
            this.userData = userDetail;

            // set model values
            this.updateModel();
        }
    }


    ngAfterViewInit() {
        this.submitPaymentCard();
    }

    submitPaymentCard() {
        $('#m_payment_update_submit').click((e) => {
            let form = $(e.target).closest('form');
            this.model.creditCard.expirationDate = $.trim($('#m_datepicker_expiry_date').val()) || null;

            form.validate({
                rules: {
                    'creditCard[number]': {
                        required: true,
                        number: true,
                        maxlength: 20
                    },
                    'creditCard[expirationDate]': {
                        required: true,
                        maxlength: 7
                    },
                    'creditCard[cvv]': {
                        required: true,
                        maxlength: 4,
                        number: true
                    },
                    'address[premisis]': {
                        required: true,
                        maxlength: 255
                    },
                    'address[city]': {
                        required: true,
                        maxlength: 50,
                    },
                    'address[postCode]': {
                        required: true,
                        maxlength: 8
                    }
                }
            });

            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.submitPayment();
        })
    }

    submitPayment() {
        this.loading = true;
        // save user card information
        this._userService.saveCard({ creditCard: this.model.creditCard }).subscribe(data => {
            this.showAlert('alertUpdatePayment');
            this._alertService.success(data.message, true);
            this.loading = false;
            this.getLoginUser();
        }, error => {
            this.showAlert('alertUpdatePayment');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            this.loading = false;
        })

        // save user address 
        this._userService.update({ address: [this.model.address] }).subscribe(data => {
            this.getLoginUser();
        });
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


    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    updateModel() {
        this.model.creditCard.number = this.userData.profile.card.maskedNumber;
        this.model.creditCard.expirationDate = this.userData.profile.card.expirationDate;

        // check for billing address
        for (let a in this.userData.address) {
            if (this.userData.address[a].type === 'billing') {
                this.model.address.premisis = this.userData.address[a]['address'].premisis;
                this.model.address.postCode = this.userData.address[a]['address'].postCode;
                this.model.address.city = this.userData.address[a]['address'].city;
            }
        }
    }

    /**
     * Method to get user profile information
     */
    getLoginUser() {
        this._userService.getLoginUser().subscribe(data => {
            // update user detail localStorage
            localStorage.removeItem('userDetail');
            localStorage.setItem('userDetail', JSON.stringify(data.data));
            this.userData = data.data;
        }, err => {

        });
    }
}