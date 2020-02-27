import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { AlertService } from '../../../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../../../auth/_directives/alert.component';

import { BreweryService } from '../../../../../../../services/brewery.service';
import { AdminService } from '../../../../../../../services/admin.service';

import { CommonService } from '../../../../../../../services/common.service';

import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';

@Component({
    selector: "app-add-brewery",
    templateUrl: "./add-brewery.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddBreweryComponent implements OnInit, AfterViewInit {

    loading = false;
    lists: any;

    @ViewChild('alertProduct',
        { read: ViewContainerRef }) alertProduct: ViewContainerRef;

    @ViewChild('alertImage',
        { read: ViewContainerRef }) alertImage: ViewContainerRef;

    constructor(
        private _brewery: BreweryService,
        private _admin: AdminService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private common: CommonService,
        private _route: ActivatedRoute,
        private http: Http,
    ) { }

    ngOnInit() {

    }


    ngAfterViewInit() {

    }



    /*    updateModel() {
            this.model.name = this.productInfo.name;
            this.model.price = this.productInfo.price;
            this.model.description = this.productInfo.description;
            this.productLogo = this.productInfo.picture;
            this.model.currentStock = this.productInfo.stock;
            this.model.type = this.productInfo.type;
            this.model.alcohol_content = this.productInfo.alcohol_content;
            this.model.size = this.productInfo.size;
            this.model.other_info = this.productInfo.other_info;
            this.model.brewery_id = this.productInfo.brewery_id;
        }
    */
    model: any = {
        name: null,
        email: null,
        password: null,
        vat: null,
        company: null,
        premisis: null,
        city: null,
        postCode: null
    };

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }


    addBrewery() {

        this.loading = true;
        let values = {
            'name': this.model.name,
            'email': this.model.email,
            'password': this.model.password,
            'vat': this.model.vat,
            'company': this.model.company,
            'address': {
                'premisis': this.model.premisis,
                'city': this.model.city,
                'postCode': this.model.postCode
            }
        };
        //Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);
        let addbrewery = null;
        console.log(values);
        addbrewery = this._brewery.addBrewery(values);
        addbrewery.subscribe(
            data => {
                this.loading = false;
                this.showAlert('alertProduct');
                this._alertService.success(data.message, true);
                console.log('---------------', data);
            },
            error => {
                this.loading = false;
                this.showAlert('alertProduct');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            }
        );
    }


}