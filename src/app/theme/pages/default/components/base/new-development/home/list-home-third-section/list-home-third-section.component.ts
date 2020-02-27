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

@Component({
    selector: 'app-list-home-third-section',
    templateUrl: './list-home-third-section.component.html',
    styles: []
})
export class ListHomeThirdSectionComponent implements OnInit {


    private subdomain: string;
    private userDetail: any;
    private homethirdsectionData: any = '';
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
        this._brewery.getHomeThirdSectionBySubdomain(this.subdomain).subscribe(
            res => {
                this.homethirdsectionData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

    deleteHomeThirdSectionById(id) {

        this._brewery.deleteHomeThirdSectionById(id).subscribe(
            res => {
                this.ngOnInit();
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

    }


}
