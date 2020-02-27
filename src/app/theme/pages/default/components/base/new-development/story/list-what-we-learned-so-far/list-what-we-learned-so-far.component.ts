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
    selector: 'app-list-what-we-learned-so-far',
    templateUrl: './list-what-we-learned-so-far.component.html',
    styles: []
})
export class ListWhatWeLearnedSoFarComponent implements OnInit {

    private subdomain: string;
    private userDetail: any;
    private whatwelearnedData: any;
    private message: any;
    private xyz:any;

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

        this._brewery.getWhatWeLearnedDetails(this.subdomain).subscribe(
            res => {
                console.log('>>>>>>>>>>>>>>>>>>>>', res.data);
                this.whatwelearnedData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

    }

    deleteTeam(id) {

        this._brewery.deleteWhatWeLearned(id).subscribe(
            res => {
                this.ngOnInit();
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

    }

}
