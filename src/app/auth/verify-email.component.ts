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
    templateUrl: './templates/verify-email.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class VerifyEmailComponent implements OnInit {

    @ViewChild('alertVerifyEmail',
        { read: ViewContainerRef }) alertVerifyEmail: ViewContainerRef;

    constructor(
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

        this.verifyEmail(this._route.snapshot.params.token);
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    verifyEmail(token: string) {
        Helpers.setLoading(true)
        this._userService.verifyEmail(token).subscribe(
            data => {
                this.showAlert('alertVerifyEmail');
                this._alertService.success(data.message, true);
                Helpers.setLoading(false)
            },
            error => {
                this.showAlert('alertVerifyEmail');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
                Helpers.setLoading(false)
            });
    }
}