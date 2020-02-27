import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';

import { BreweryService } from '../../../../../../../services/brewery.service';
import { AlertComponent } from '../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../auth/_services/alert.service';


@Component({
    selector: "app-basic-scrollable",
    templateUrl: "./basic-scrollable.component.html",
    styleUrls: ['./basic-scrollable.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class BasicScrollableComponent implements OnInit {

    @ViewChild('alertProduct',
        { read: ViewContainerRef }) alertProduct: ViewContainerRef;

    private currentPage: number;
    private totalItems: number;
    readonly pagination_limit: number = 10;

    products: any = [];

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    constructor(
        private _script: ScriptLoaderService,
        private _brewery: BreweryService,
        private cfr: ComponentFactoryResolver,
        private _alertService: AlertService
    ) { }

    ngOnInit() {
        this.listProducts();
    }

    listProducts(page: number = 1) {
        Helpers.setLoading(true)
        this._brewery.listProducts(page, this.pagination_limit).subscribe(data => {
            this.products = data.data.data;
            this.currentPage = data.data.current_page;
            this.totalItems = data.data.total;
            Helpers.setLoading(false)
        }, err => {
            Helpers.setLoading(false)
        });
    }

    deleteProduct(productId: number) {
        Helpers.setLoading(true)
        this._brewery.deleteProduct(productId).subscribe(data => {
            this.showAlert('alertProduct');
            this._alertService.success(data.message, true);
            this.listProducts(this.currentPage);
            Helpers.setLoading(false)
        }, err => {
            Helpers.setLoading(false)
            this.showAlert('alertProduct');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        });
    }

    updateProductStatus(productId: number, status: boolean) {
        Helpers.setLoading(true);
        this._brewery.updateProductStatus(productId, !status).subscribe(data => {
            Helpers.setLoading(false);
            this.showAlert('alertProduct');
            this._alertService.success(data.message, true);
            this.listProducts(this.currentPage);
        }, err => {
            this.showAlert('alertProduct');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            Helpers.setLoading(false)
        });
    }
}