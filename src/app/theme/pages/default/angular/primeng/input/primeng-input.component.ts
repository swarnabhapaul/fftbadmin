import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { UserService } from '../../../../../../auth/_services/user.service';

import { UserProfile } from '../../../../../_models/UserProfile';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services/alert.service';

@Component({
    selector: "app-primeng-input",
    templateUrl: "./primeng-input.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PrimeNgInputComponent implements OnInit, AfterViewInit {

    loading = false;

    model: any = {
        password: null,
        confPassword: null,
        oldpassword: null
    }

    constructor(
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver
    ) { }

    @ViewChild('alertUpdatePassword',
        { read: ViewContainerRef }) alertUpdatePassword: ViewContainerRef;

    ngOnInit() {
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-wizard-wizard-1',
            ['assets/demo/default/custom/crud/wizard/wizard.js'], true).then(() => {
                Helpers.setLoading(false);
                this.handlePasswordFormSubmit();
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    handlePasswordFormSubmit() {
        $('#m_form_password_update_submit').click((e) => {
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    password: {
                        required: true,
                    },
                    oldpassword: {
                        required: true,
                    }, confPassword: {
                        required: true,
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.submitPasswordUpdate();
        });
    }

    submitPasswordUpdate() {
        this.loading = true;

        // update signup fields
        this._userService.changeLoginUserPassword(this.model.oldpassword, this.model.password).subscribe(
            data => {
                this.showAlert('alertUpdatePassword');
                this._alertService.success(data.message, true);
                this.loading = false;
            },
            error => {
                this.showAlert('alertUpdatePassword');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                this.loading = false;
            });
    }

}