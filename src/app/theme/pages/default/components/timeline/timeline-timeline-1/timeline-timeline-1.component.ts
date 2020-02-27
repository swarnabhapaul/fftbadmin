import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';

import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { UserService } from '../../../../../../auth/_services/user.service';

import { UserProfile } from '../../../../../_models/UserProfile';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services/alert.service';


@Component({
    selector: "app-timeline-timeline-1",
    templateUrl: "./timeline-timeline-1.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TimelineTimeline1Component implements OnInit, AfterViewInit {


    @ViewChild('alertUpdateProfile',
        { read: ViewContainerRef }) alertUpdateProfile: ViewContainerRef;

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
            this.userData = JSON.parse(localStorage.getItem('userDetail'));
        }
    }


    ngAfterViewInit() {
        this._script.loadScripts('app-wizard-wizard-1',
            ['assets/demo/default/custom/crud/wizard/wizard.js'], true).then(() => {
                Helpers.setLoading(false);
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

}