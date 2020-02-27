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
    selector: 'app-testimony',
    templateUrl: './testimony.component.html',
    styles: []
})
export class TestimonyComponent implements OnInit {

    private subdomain: number;
    private userDetail: any;
    private testimonialData: any;
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
        this.subdomain = this.userDetail.brewery.subdomain;
        console.log(this.subdomain);
        this._brewery.getOurTestimonialList(this.subdomain).subscribe(
            res => {
                console.log('>>>>>>>>>>>>>>>>>>>>', res.data);
                this.testimonialData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }


    deleteTestimonial(id) {
        this._brewery.deleteOurTestimonialById(id).subscribe(
            res => {
                this.ngOnInit();
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

}
