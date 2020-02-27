import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../../../../../../services/orders.service';
import { Helpers } from '../../../../../../../helpers';

@Component({
    selector: "app-api-events",
    templateUrl: "./api-events.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [OrdersService]
})
export class ApiEventsComponent implements OnInit {

    private breweryPayments: any;
    private currentPage: number;
    private totalItems: number;
    readonly pagination_limit: number = 10;

    constructor(private _order: OrdersService) { }

    ngOnInit() {
        this.getBreweryPayments();
    }

    getBreweryPayments(page: number = 1) {
        Helpers.setLoading(true);
        this._order.getBreweryPayments(page, this.pagination_limit).subscribe(data => {
            this.breweryPayments = data.data.data;
            this.currentPage = data.data.current_page;
            this.totalItems = data.data.total;

            Helpers.setLoading(false);
        }, err => {
            Helpers.setLoading(false);
        })
    }
}