import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';

import { AlertComponent } from '../../../../../../auth/_directives/alert.component';

import { UserService } from '../../../../../../auth/_services/user.service';

import { UserProfile } from '../../../../../_models/UserProfile';
import { AlertService } from '../../../../../../auth/_services/alert.service';

import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';


@Component({
    selector: "app-primeng-panel",
    templateUrl: "./primeng-panel.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PrimeNgPanelComponent implements OnInit, AfterViewInit {

    @ViewChild('alertUpdateEmail',
        { read: ViewContainerRef }) alertUpdateEmail: ViewContainerRef;

    private loading: boolean = false;
    private userData: UserProfile;

    constructor(
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver
    ) { }

    ngAfterViewInit() {
        this._script.loadScripts('app-wizard-wizard-1',
            ['assets/demo/default/custom/crud/wizard/wizard.js'], true).then(() => {
                this.handleEmailFormSubmit();
            });
    }

    model: any = {
        password: String,
        confirmEmail: String,
        email: String
    };

    ngOnInit() {
        for (let m in this.model) {
            this.model[m] = null;
        }
    }

    handleEmailFormSubmit() {
        document.getElementById('m_email_update').addEventListener('click', (e) => {
            let btn = $(e.target);
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    password: {
                        required: true,
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    confirmEmail: {
                        required: true,
                        email: true
                    },
                },
            });
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.changeLoginUserEmail();

        });
    }

    changeLoginUserEmail() {
        this.loading = true;

        // update signup fields
        this._userService.changeLoginUserEmail(this.model.email, this.model.password).subscribe(
            data => {
                this.showAlert('alertUpdateEmail');
                this._alertService.success(data.message, true);
                this.loading = false;
            },
            error => {
                this.showAlert('alertUpdateEmail');
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
}