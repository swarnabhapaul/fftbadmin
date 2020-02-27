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
    selector: 'app-our-process',
    templateUrl: './our-process.component.html',
    styles: []
})
export class OurProcessComponent implements OnInit {

    private subdomainID: number;
    private userDetail: any;
    private processData: any;
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
        this.subdomainID = this.userDetail.brewery.id;
        console.log(this.subdomainID);
        this._brewery.getOurProcessList(this.subdomainID, 0).subscribe(
            res => {
                console.log('>>>>>>>>>>>>>>>>>>>>', res.data);
                this.processData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

    deleteProcess(id) {

        this._brewery.deleteOurProcessById(id).subscribe(
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
