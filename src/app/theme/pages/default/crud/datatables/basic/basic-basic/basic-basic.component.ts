import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { BreweryService } from '../../../../../../../services/brewery.service';

@Component({
    selector: "app-basic-basic",
    templateUrl: "./basic-basic.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./basic-basic.component.css']
})
export class BasicBasicComponent implements OnInit {

    constructor(private _brewery: BreweryService) { }

    private breweries: any;

    ngOnInit() {
        this.getBreweries();
    }

    private currentPage: number;
    private totalItems: number;
    readonly pagination_limit: number = 20;

    getBreweries(page: number = 1) {
        Helpers.setLoading(true);
        this._brewery.listBreweries(page, this.pagination_limit).subscribe(data => {
            this.breweries = data.data.data;
            this.currentPage = data.data.current_page;
            this.totalItems = data.data.total;
            Helpers.setLoading(false);
        }, err => {
            Helpers.setLoading(false);
        })
    }
}