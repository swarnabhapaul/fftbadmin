import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { UserService } from '../../../../../../auth/_services/user.service';

import { UserProfile } from '../../../../../_models/UserProfile';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services/alert.service';

@Component({
    selector: "app-wizard-wizard-1",
    templateUrl: "./wizard-wizard-1.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class WizardWizard1Component implements OnInit, AfterViewInit {

    @ViewChild('alertUpdateProfile',
        { read: ViewContainerRef }) alertUpdateProfile: ViewContainerRef;

    model: any = {
        firstName: null,
        lastName: null,
        email: null,
    }

    loading = false;

    userData: UserProfile;

    constructor(
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        // set model values
        if (localStorage.getItem('userDetail')) {
            let userDetail = JSON.parse(localStorage.getItem('userDetail'));

            // set model fields values
            this.model.firstName = userDetail.profile.firstName;
            this.model.lastName = userDetail.profile.lastName;
            this.model.email = userDetail.email;

            this.userData = userDetail;
        }
    }


    ngAfterViewInit() {
        this._script.loadScripts('app-wizard-wizard-1',
            ['assets/demo/default/custom/crud/wizard/wizard.js'], true).then(() => {
                Helpers.setLoading(false);
                // this.getLoginUser();
                this.handleProfileFormSubmit();
            });
    }

    handleProfileFormSubmit() {
        $('#m_profile_update_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    firstName: {
                        required: true,
                    },
                    lastName: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.submitProfileUpdate();
        });
    }

    submitProfileUpdate() {
        this.loading = true;

        // update signup fields
        this._userService.update({ firstName: this.model.firstName, lastName: this.model.lastName }).subscribe(
            data => {
                this.showAlert('alertUpdateProfile');
                this._alertService.success(data.message, true);
                this.loading = false;

                // update userDetail on localstorage
                this.getLoginUser();
            },
            error => {
                this.showAlert('alertUpdateProfile');
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

    /**
     * Method to get user profile information
     */
    getLoginUser() {
        this._userService.getLoginUser().subscribe(data => {
            localStorage.removeItem('userDetail');

            localStorage.setItem('userDetail', JSON.stringify(data.data));

            this.userData = data.data;
        });
    }

    /**
     * method to send Email verification link
     */
    resendVerification() {
        Helpers.setLoading(true);

        this._userService.verifyEmailRequest().subscribe(data => {
            Helpers.setLoading(false);

            this.showAlert('alertUpdateProfile');
            this._alertService.success(data.message, true);

        }, error => {
            Helpers.setLoading(false);

            this.showAlert('alertUpdateProfile');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        });
    }

    // seach user address
    searchUserAddress(address: Array<any>, type: string): Object {
        let selectedAddress = {};
        // check if address exists
        if (address && address.length) {
            for (let add of address) {
                // check for required type
                if (add.type === type) {
                    selectedAddress = add.address;
                    break;
                }
            }
        }

        return selectedAddress;
    }
}