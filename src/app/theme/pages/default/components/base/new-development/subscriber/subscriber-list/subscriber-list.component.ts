import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { BreweryService } from '../../../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { componentFactoryName } from '@angular/compiler';

declare let $: any;

@Component({
    selector: 'app-subscriber-list',
    templateUrl: './subscriber-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: []
})
export class SubscriberListComponent implements OnInit {

    private subdomainID: number;
    private userDetail: any;
    private subscriberData: any;
    private message: any;
    private flag: any;


    constructor(
        private _script: ScriptLoaderService,
        private _brewery: BreweryService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private _common: CommonService,
        private _route: ActivatedRoute,
        private _router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit() {

        this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
        this.subdomainID = this.userDetail.brewery.id;
        console.log(this.subdomainID);
        this._brewery.getSubscriberList(this.subdomainID).subscribe(
            res => {
                console.log('>>>>>>>>>>>>>>>>>>>>', res.data);
                this.subscriberData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

    changeStatus(id) {
        //alert(id);
        this._brewery.updateSubscriber(id).subscribe(
            res => {
                this.message = res['message'];
                this.flag = 'primary';
                this.ngOnInit();
            }, err => {
                this.flag = 'danger';
                this.message = err['message'];
            }
        );
    }


}
