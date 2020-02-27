//import { Component, OnInit } from '@angular/core';
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
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: []
})

// @Component({
//   selector: 'app-banner',
//   template: '/banner.component.html',
//   encapsulation: ViewEncapsulation.None,
//   styles: []
// })
export class BannerComponent implements OnInit {

    private breweryID: number;
    private userDetail: any;
    private bannerData: any;
    private message: any;


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
        this.breweryID = this.userDetail.brewery.id;

        this._brewery.getBannerById(this.breweryID).subscribe(
            res => {
                console.log('>>>>>>>>>>>>>>>>>>>>', res.data);
                this.bannerData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

    deleteBanner(id) {

        this._brewery.deleteOurBannerById(id).subscribe(
            res => {
                this.ngOnInit();
                //console.log('>>>>>>>>>>>>>>>>>>>>',res.data);
                //this.processData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

    }


}
