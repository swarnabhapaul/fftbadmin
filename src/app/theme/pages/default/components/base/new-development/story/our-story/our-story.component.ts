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
    selector: 'app-our-story',
    templateUrl: './our-story.component.html',
    styles: []
})
export class OurStoryComponent implements OnInit {


    private subdomainID: number;
    private userDetail: any;
    private storyData: any;
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
        this._brewery.getOurStoryList(this.subdomainID).subscribe(
            res => {
                this.storyData = res.data;
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );
    }

    deleteStory(id) {

        this._brewery.deleteOurStoryById(id).subscribe(
            res => {
                this.ngOnInit();
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

    }


}
